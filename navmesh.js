/**
 * A NavMesh represents the traversable area of a map and gives
 * utilities for pathfinding.
 * Usage:
 *   // Assuming the 2d map tiles array is available:
 *   var navmesh = new NavMesh(map);
 *   navmesh.calculatePath(currentlocation, targetLocation, callback);
 * @module navmesh
 */
define(['./polypartition', './parse-map', './pathfinder', './lib/clipper', './worker!./aStarWorker.js', 'bragi'],
function(  pp,                MapParser,     Pathfinder,     ClipperLib,     workerPromise,              Logger) {
  var Point = pp.Point;
  var Poly = pp.Poly;
  var Partition = pp.Partition;
  var Edge = pp.Edge;
  var PolyUtils = pp.PolyUtils;
  
  /**
   * @constructor
   * @alias module:navmesh
   * @param {MapTiles} map - The 2d array defining the map tiles.
   */
  var NavMesh = function(map) {
    if (typeof map == 'undefined') { return; }
    this.initialized = false;

    // Parse map tiles into polygons.
    var polys = MapParser.parse(map);
    if (!polys) {
      throw "Map parsing failed!";
    }

    // Set callbacks for worker promise object.
    workerPromise.then(function(worker) {
      this.workerInitialized = false;
      Logger.log("navmesh", "Using worker.");
      this.worker = worker;
      this.worker.onmessage = function(message) {
        var data = message.data;
        var name = data[0];
        if (name !== "log")
          Logger.log("navmesh:debug", "Message received from worker: ", data);
          
        if (name == "log") {
          this._workerLogger(data.slice(1));
        } else if (name == "init") {
          this.workerInitialized = data[1];
          this._workerInit();
        }
      }.bind(this);
    }.bind(this), function(Error) {
      Logger.log("navmesh:warn", "No worker, falling back to in-thread computation.");
      Logger.log("navmesh:warn", "Worker error:", Error);
      this.worker = false;
    }.bind(this));

    this.init(polys);
  };

  /**
   * Initialize the navigation mesh with the polygons describing the
   * map elements.
   * @private
   * @param {ParsedMap} - The map information parsed into polygons.
   */
  NavMesh.prototype.init = function(parsedMap) {
    // Save original parsed map polys.
    this.parsedMap = parsedMap;

    // Perform initial separation of any slightly overlapping polygons.
    this._separatePolys(parsedMap.walls);
    this._separatePolys(parsedMap.obstacles);

    // Offset polys from side so they represent traversable area.
    var areas = this._offsetPolys(parsedMap);

    this.polys = [];
    areas.forEach(function(area) {
      var outline = area.polygon;
      var holes = area.holes;
      var polys = this._generatePartition(outline, holes);
      Array.prototype.push.apply(this.polys, polys);
    }, this);

    if (!this.worker) {
      this.pathfinder = new Pathfinder(this.polys);
    }

    // Keep track of original polygons, generate their edges in advance.
    //this.original_polys = parsedMap.walls.concat(parsedMap.obstacles);
    this.obstacle_edges = [];
    //this.original_polys.forEach(function(poly) {
    areas.forEach(function(area) {
      var polys = [area.polygon].concat(area.holes);
      polys.forEach(function(poly) {
        for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
          this.obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
        }
      }, this);
    }, this);
    this.initialized = true;
  }

  /**
   * Callback for path calculation requests.
   * @callback pathCallback
   * @param {?Array.<Point>} - The calculated path, the first Point
   *   of which should be the target of any navigation. The goal Point
   *   is included at the end of the path.
   */
  /**
   * Calculate a path from the source point to the target point, invoking
   * the callback with the path after calculation.
   * @param {Point} source - The start location of the search.
   * @param {Point} target - The target of the search.
   * @param {pathCallback} callback - The callback function invoked
   *   when the path has been calculated.
   */
  NavMesh.prototype.calculatePath = function(source, target, callback) {
    Logger.log("navmesh:debug", "Calculating path.");

    // Use web worker if present.
    if (this.worker && this.workerInitialized) {
      Logger.log("navmesh:debug", "Using worker to calculate path.");
      this.worker.postMessage(["aStar", source, target]);
      // Set callback so it is accessible when results are sent back.
      this.lastCallback = callback;
    } else {
      path = this.pathfinder.aStar(source, target);
      if (typeof path !== 'undefined') {
        // Remove first entry, which is current position.
        path = path.slice(1);
      }
      callback(path);
    }
  }

  // Return true if p1 is visible from p2. The offset outline and holes are
  // used as obstacles in this case.
  NavMesh.prototype.checkVisible = function(p1, p2) {
    var edge = new Edge(p1, p2);

    checkEdge = function(edges, edge_index, my_edge) {
      var thisEdge = edges[edge_index];

      if (edge_index !== edges.length - 1) {
        setTimeout(function() {
          checkEdge(edges, edge_index + 1, my_edge);
        }, 1000);
      }
    }
    var blocked = this.obstacle_edges.some(function(e) {return e.intersects(edge);});
    return !blocked;
  }

  // private
  // Given a polygon outline and an [optional] array of polygons
  // representing holes in the polygon, partition the outline. Returns
  // an array of polygons representing the partitioned space
  NavMesh.prototype._generatePartition = function(outline, holes) {
    // Ensure proper vertex order for holes and outline.
    outline.setOrientation("CCW");
    holes.forEach(function(e) {
      e.setOrientation("CW");
      e.hole = true;
    });

    var partitioner = new Partition();

    return partitioner.convexPartition(outline, holes);
  }

  /**
   * Takes an array of polygons that overlap themselves and others
   * at discrete corner points and separate those overlapping corners
   * slightly so the polygons are suitable for triangulation by
   * poly2tri.js. This changes the Poly objects in the array.
   * @private
   * @param {Array.<Poly>} polys - The polygons to separate.
   * @param {number} [offset=1] - The number of units the vertices
   *   should be moved away from each other.
   */
  NavMesh.prototype._separatePolys = function(polys, offset) {
    offset = offset || 1;
    var discovered = {};
    var dupes = {};
    // Offset to use in calculation.
    // Find duplicates.
    for (var s1 = 0; s1 < polys.length; s1++) {
      var poly = polys[s1];
      for (var i = 0; i < poly.numpoints; i++) {
        var point = poly.points[i].toString();
        if (!discovered.hasOwnProperty(point)) {
          discovered[point] = true;
        } else {
          dupes[point] = true;
        }
      }
    }

    // Get duplicate points.
    var dupe_points = [];
    var dupe;
    for (var s1 = 0; s1 < polys.length; s1++) {
      var poly = polys[s1];
      for (var i = 0; i < poly.numpoints; i++) {
        var point = poly.points[i];
        if (dupes.hasOwnProperty(point.toString())) {
          dupe = [point, i, poly];
          dupe_points.push(dupe);
        }
      }
    }

    // Sort elements in descending order based on their indices to
    // prevent future indices from becoming invalid when changes are made.
    dupe_points.sort(function(a, b) {
      return b[1] - a[1]
    })
    // Edit duplicates.
    var prev, next, point, index, p1, p2;
    dupe_points.forEach(function(e, i, ary) {
      point = e[0], index = e[1], poly = e[2];
      prev = poly.points[poly.getPrevI(index)];
      next = poly.points[poly.getNextI(index)];
      p1 = point.add(prev.sub(point).normalize().mul(offset));
      p2 = point.add(next.sub(point).normalize().mul(offset));
      // Insert new points.
      poly.points.splice(index, 1, p1, p2);
      poly.update();
    });
  }

  /**
   * Represents the outline of a shape along with its holes.
   * @typedef MapArea
   * @type {object}
   * @property {Poly} polygon - The polygon defining the exterior of
   *   the shape.
   * @property {Array.<Poly>} holes - The holes of the shape.
   */

  /**
   * Offset the polygons such that there is a `offset` unit buffer
   * between the sides of the outline and around the obstacles. This
   * buffer makes it so that the mesh truly represents the movable area
   * in the map. Assumes vertices defining interior shapes (like the
   * main outline of an enclosed map) are given in CCW order and
   * obstacles are given in CW order.
   * @private
   * @param {Array.<Poly>} polys - The polygons to offset.
   * @param {number} [offset=16] - The amount to offset the polygons
   *   from the movable areas.
   * @return {Array.<MapArea>} - The shapes defining the polygons after
   *   offsetting and merging.
   */
  NavMesh.prototype._offsetPolys = function(parsedMap, offset) {
    // ~= ball radius / 2
    if (typeof offset == 'undefined') offset = 16;

    // Separate interior and exterior walls. The CCW shapes correspond
    // to the interior wall outlines of out map, the CW shapes are walls
    // that were traced on their outside.
    var interior_walls = [];
    var exterior_walls = parsedMap.walls.filter(function(poly, index) {
      if (poly.getOrientation() == "CCW") {
        interior_walls.push(poly);
        return false;
      }
      return true;
    });

    interior_walls = interior_walls.map(this._convertPolyToClipper);
    exterior_walls = exterior_walls.map(this._convertPolyToClipper);

    var scale = 100;
    
    ClipperLib.JS.ScaleUpPaths(interior_walls, scale);
    ClipperLib.JS.ScaleUpPaths(exterior_walls, scale);

    var cpr = new ClipperLib.Clipper();
    var co = new ClipperLib.ClipperOffset();
    co.MiterLimit = 2;
    var wall_fillType = ClipperLib.PolyFillType.pftEvenOdd;
    var obstacle_fillType = ClipperLib.PolyFillType.pftNonZero;

    var offsetted_interior_walls = [];
    // Handle interior walls.
    interior_walls.forEach(function(wall) {
      // First, create a shape with the outline as the interior.
      var boundingShape = this._getBoundingShapeForPaths([wall]);
      //ClipperLib.JS.ScaleUpPath(boundingShape, scale);
      cpr.Clear();
      cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
      cpr.AddPath(wall, ClipperLib.PolyType.ptClip, true);

      var solution_paths = new ClipperLib.Paths();
      cpr.Execute(ClipperLib.ClipType.ctDifference,
        solution_paths,
        ClipperLib.PolyFillType.pftNonZero,
        ClipperLib.PolyFillType.pftNonZero);

      // Once we have the shape as created above, inflate it. This gives
      // better results than treating the outline as the exterior of a
      // shape and deflating it.
      var offsetted_paths = new ClipperLib.Paths();

      co.Clear();
      co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
      co.Execute(offsetted_paths, offset * scale);

      // If this is not true then the offsetting process shrank the
      // outline into non-existence and only the bounding shape is
      // left.
      // >= 2 in case the offsetting process isolates portions of the
      // outline (see: GamePad).
      if (offsetted_paths.length >= 2) {
        // Get only the paths defining the outlines we were interested
        // in, discarding the exterior bounding shape.
        offsetted_paths.shift();

        // Reverse paths since from here on we're going to treat the
        // outlines as the exterior of a shape.
        offsetted_paths.forEach(function(path) {
          path.reverse();
        });
        Array.prototype.push.apply(offsetted_interior_walls, offsetted_paths);
      }
    }, this);
    
    // Offset exterior walls.
    var offsetted_exterior_walls = [];

    exterior_walls.forEach(function(wall) {
      var offsetted_exterior_wall = new ClipperLib.Paths();
      co.Clear();
      co.AddPath(wall, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
      co.Execute(offsetted_exterior_wall, offset * scale);
      offsetted_exterior_walls.push(offsetted_exterior_wall[0]);
    });
    
    // Offset obstacles.
    var offsetted_obstacles = new ClipperLib.Paths();

    var obstacles = parsedMap.obstacles.map(this._convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(obstacles, scale);
    co.Clear();
    co.AddPaths(obstacles, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_obstacles, offset * scale);

    // Take difference of polygons defining interior wall and polygons
    // defining exterior walls, limiting to exterior wall polygons whose
    // area is less than the interior wall polygons so the difference
    // operation doesn't remove potentially traversable areas.
    var merged_paths = [];
    offsetted_interior_walls.forEach(function(wall) {
      var area = ClipperLib.JS.AreaOfPolygon(wall, scale);
      var smaller_exterior_walls = offsetted_exterior_walls.filter(function(ext_wall) {
        return ClipperLib.JS.AreaOfPolygon(ext_wall, scale) < area;
      });
      var paths = new ClipperLib.Paths();
      cpr.Clear();
      cpr.AddPath(wall, ClipperLib.PolyType.ptSubject, true);
      cpr.AddPaths(smaller_exterior_walls, ClipperLib.PolyType.ptClip, true);
      cpr.AddPaths(offsetted_obstacles, ClipperLib.PolyType.ptClip, true);
      cpr.Execute(ClipperLib.ClipType.ctDifference,
        paths,
        ClipperLib.PolyFillType.pftNonZero,
        ClipperLib.PolyFillType.pftNonZero
      );
      Array.prototype.push.apply(merged_paths, paths);
    });

    // Merge everything.
    cpr.Clear();
    cpr.AddPaths(merged_paths, ClipperLib.PolyType.ptSubject, true);
    var unioned_shapes_polytree = new ClipperLib.PolyTree();
    cpr.Execute(ClipperLib.ClipType.ctUnion, unioned_shapes_polytree, wall_fillType, null);

    var polys = new Array();

    /**
     * An area is an interior shape along with its holes, if any.
     */
    var areas = [];

    var outer_polygons = unioned_shapes_polytree.Childs();

    // Organize shapes into their outer polygons and holes.
    for (var i = 0; i < outer_polygons.length; i++) {
      var outer_polygon = outer_polygons[i];
      var contour = outer_polygon.Contour();
      ClipperLib.JS.ScaleDownPath(contour, scale);
      var area = {
        polygon: contour,
        holes: []
      }

      outer_polygon.Childs().forEach(function(child) {
        var contour = child.Contour();
        ClipperLib.JS.ScaleDownPath(child.Contour(), scale);
        // Add as a hole.
        area.holes.push(contour);

        // Add children as additional outer polygons to be expanded.
        child.Childs().forEach(function(child_outer) {
          outer_polygons.push(child_outer);
        });
      });
      areas.push(area);
    }
    
    // Convert Clipper Paths to Polys.
    areas.forEach(function(area) {
      area.polygon = this._convertClipperToPoly(area.polygon);
      area.holes = area.holes.map(this._convertClipperToPoly);
    }, this);

    return areas;
  }

  /**
   * A point in ClipperLib is just an object with properties
   * X and Y corresponding to a point.
   * @typedef CLPoint
   * @type {object}
   * @property {integer} X - The x coordinate of the point.
   * @property {integer} Y - The y coordinate of the point.
   */

  /**
   * A shape in ClipperLib is simply an array of CLPoints.
   * @typedef CLShape
   * @type {Array.<CLPoint>}
   */

  /**
   * Takes a Poly and converts it into a ClipperLib polygon.
   * @private
   * @param {Poly} poly - The Poly to convert.
   * @return {CLShape} - The converted polygon.
   */
  NavMesh.prototype._convertPolyToClipper = function(poly) {
    return poly.points.map(function(p) {
      return {X:p.x, Y:p.y};
    });
  }

  /**
   * Convert a ClipperLib shape into a Poly.
   * @private
   * @param {CLShape} clip - The shape to convert.
   * @return {Poly} - The converted shape.
   */
  NavMesh.prototype._convertClipperToPoly = function(clip) {
    var poly = new Poly();
    poly.init(clip.length);
    poly.points = clip.map(function(p) {
      return new Point(p.X, p.Y);
    });
    return poly;
  }

  /**
   * Generate a bounding shape for paths with a given buffer. If using
   * for an offsetting operation, the returned CLShape does NOT need to
   * be scaled up.
   * @private
   * @param {Array.<CLShape>} paths - The paths to get a bounding shape for.
   * @param {integer} [buffer=5] - How many units to pad the bounding
   *   rectangle.
   * @return {CLShape} - A bounding rectangle for the paths.
   */
  NavMesh.prototype._getBoundingShapeForPaths = function(paths, buffer) {
    if (typeof buffer == "undefined") buffer = 5;
    var bounds = ClipperLib.Clipper.GetBounds(paths);
    bounds.left -= buffer;
    bounds.top -= buffer;
    bounds.right += buffer;
    bounds.bottom += buffer;
    var shape = [];
    shape.push({X: bounds.right, Y: bounds.bottom});
    shape.push({X: bounds.left, Y: bounds.bottom});
    shape.push({X: bounds.left, Y: bounds.top});
    shape.push({X: bounds.right, Y: bounds.top});
    return shape;
  }

  /**
   * Handler for log messages sent by worker.
   * @private
   * @param {Array.<(string|object)>} message - Array of arguments to
   *   pass to `Logger.log`. The first element should be the group to
   *   associate the message with.
   */
  NavMesh.prototype._workerLogger = function(message) {
    Logger.log.apply(null, message);
  }

  /**
   * Fully initialize listeners for pathfinding web worker.
   * @private
   */
  NavMesh.prototype._workerInit = function() {
    if (this.initialized && this.worker && this.workerInitialized) {
      // Send polygons of navigation mesh to web worker.
      this.worker.postMessage(["polys", this.polys]);
    }

    /**
     * Set up listeners for web worker messages.
     * Messages can have type "log" and "result".
     */
    this.worker.onmessage = function(message) {
      var data = message.data;
      var name = data[0];

      // Omit log messages from worker in debug message.
      if (name !== "log")
        Logger.log("navmesh:debug", "Message received from worker:", data);

      if (name == "log") {
        this._workerLogger(data.slice(1));
      } else if (name == "result") {
        var path = data[1];

        if (path) {
          // Convert Path back to points.
          path = path.map(function(location) {
            return new Point(location.x, location.y);
          });
          // Remove first entry, which is current position.
          path = path.slice(1);
        }
        this.lastCallback(path);
      }
    }.bind(this)
  }

  return NavMesh;
});
