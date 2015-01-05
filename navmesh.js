requirejs.config({
  shim: {
    './clipper': {
      exports: 'ClipperLib'
    }
  }
});

/**
 * A NavMesh represents the traversable area of a map and gives
 * utilities for pathfinding.
 * Usage:
 *   var polys = mapParser.parse(tiles);
 *   var navmesh = new NavMesh(polys);
 *   navmesh.calculatePath(currentlocation, targetLocation, callback);
 * @module navmesh
 */
define(['./polypartition', './priority-queue', './clipper', './worker!./aStarWorker.js', 'bragi'],
function(  pp,                PriorityQueue,      ClipperLib,  aStarWorker,               Logger) {
  var Point = pp.Point;
  var Poly = pp.Poly;
  var Partition = pp.Partition;
  var Edge = pp.Edge;
  var PolyUtils = pp.PolyUtils;
  
  /**
   * @constructor
   * @alias module:navmesh
   * @param {Array.<Poly>}
   */
  var NavMesh = function(polys) {
    if (typeof polys == 'undefined') { return; }
    this.initialized = false;

    if (aStarWorker) {
      this.workerInitialized = false;
      Logger.log("navmesh", "Using worker.");
      this.worker = aStarWorker;
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
    } else {
      Logger.log("navmesh:warn", "No worker, falling back to in-thread computation.");
      this.worker = false;
    }
    this.init(polys);
  };

  /**
   * Initialize the navigation mesh with the polygons describing the
   * map elements.
   * @param {Array.<Poly>} - The Poly objects defining the map features.
   */
  NavMesh.prototype.init = function(polys) {
    // Perform initial separation of any slightly overlapping polygons.
    this._separatePolys(polys);

    // Offset polys from side so they represent traversable area.
    var areas = this._offsetPolys(polys);

    this.polys = [];
    areas.forEach(function(area) {
      var outline = area.polygon;
      var holes = area.holes;
      var polys = this._generatePartition(outline, holes);
      Array.prototype.push.apply(this.polys, polys);
    }, this);

    this.grid = this._generateAdjacencyGrid(this.polys);

    // Keep track of original polygons, generate their edges in advance.

    this.original_polys = polys;
    this.obstacle_edges = [];
    this.original_polys.forEach(function(poly) {
      for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
        this.obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
      }
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
    var sourcePoly, targetPoly;
    var path = [];
    sourcePoly = PolyUtils.findPolyForPoint(source, this.polys);
    targetPoly = PolyUtils.findPolyForPoint(target, this.polys);
    
    // Already in the same polygon as the target.
    if (sourcePoly == targetPoly) {
      path.push(target);
      callback(path);
      return;
    }

    Logger.log("navmesh:debug", "Calculating path.");
    // Use web worker if present.
    if (this.worker && this.workerInitialized) {
      Logger.log("navmesh:debug", "Using worker to calculate path.");
      this.worker.postMessage(["aStar", source, target]);
      // Set callback so it is accessible when results are sent back.
      this.lastCallback = callback;
    } else {
      path = this._aStar(source, target, this.polys);
      if (typeof path !== 'undefined') {
        // Remove first entry, which is current position, and add target.
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

  // Computes path from source to target, using sides and centers of the edges
  // between adjacent polygons. source and target are Points and polys should
  // be the final partitioned map.
  // @throws  
  NavMesh.prototype._aStar = function(source, target, polys) {
    // Compares the value of two nodes.
    function nodeValue(node1, node2) {
      return (node1.dist + heuristic(node1.point)) - (node2.dist + heuristic(node2.point));
    }

    // Distance between polygons.
    function euclideanDistance(p1, p2) {
      return p1.dist(p2);
    }

    // Distance between polygons. todo: update
    function manhattanDistance(elt1, elt2) {
      return (elt1.r - elt2.r) + (elt1.c - elt2.c);
    }

    // Takes Point and returns value.
    function heuristic(p) {
      return euclideanDistance(p, target);
    }

    function PathfindingException(m) {
      this.message = m;
      this.toString = function() {
        return "PathfindingException: " + this.message;
      }
    }

    var sourcePoly = PolyUtils.findPolyForPoint(source, this.polys);
    // We're outside of the mesh somehow. Try a few nearby points.
    if (typeof sourcePoly == 'undefined') {
      var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
      for (var i = 0; i < offsetSource.length; i++) {
        // Make new point.
        var point = source.add(offsetSource[i]);
        sourcePoly = PolyUtils.findPolyForPoint(point, this.polys);
        if (!(typeof sourcePoly == 'undefined')) {
          source = point;
          break;
        }
      }
      if (typeof sourcePoly == 'undefined') {
        return;
      }
    }
    var targetPoly = PolyUtils.findPolyForPoint(target, this.polys);

    // Warning, may have compatibility issues.
    var discoveredPolys = new WeakSet();
    var discoveredPoints = new WeakSet();
    var pq = new PriorityQueue({ comparator: nodeValue });
    var found = null;
    // Initialize with start location.
    pq.queue({dist: 0, poly: sourcePoly, point: source, parent: null});
    while (pq.length > 0) {
      var node = pq.dequeue();
      if (node.poly == targetPoly) {
        found = node;
        break;
      } else {
        discoveredPolys.add(node.poly);
        discoveredPoints.add(node.point);
      }
      // This may be undefined if there was no polygon found.
      var neighbors = this.grid.get(node.poly);
      if (typeof neighbors == "undefined") continue;

      for (var i = 0; i < neighbors.length; i++) {
        var elt = neighbors[i];
        var neighborFound = discoveredPolys.has(elt.poly);

        for (var j = 0; j < elt.edge.points.length; j++) {
          var p = elt.edge.points[j];
          if (!neighborFound || !discoveredPoints.has(p))
            pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
        }
      }
      /*neighbors.forEach(function(elt) {
        // Get neighbor/point combos that haven't been previously discovered.
        var neighborFound = discoveredPolys.has(elt.poly);

        elt.edge.points.forEach(function(p) {
          if (!neighborFound || !discoveredPoints.has(p))
            pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
        });
      });*/
    }

    if (found) {
      var path = [];
      var current = found;
      while (current.parent) {
        path.unshift(current.point);
        current = current.parent;
      }
      path.unshift(current.point);
      // Add end point to path.
      path.push(target);
      return path;
    } else {
      return;
    }
  }

  /**
   * Holds the "neighbor" relationship of Poly objects in the partition
   * using the Poly's themselves as keys, and an array of Poly's as
   * values, where the Polys in the array are neighbors of the Poly
   * that was the key.
   * @typedef AdjacencyGrid
   * @type {Object.<Poly, Array<Poly>>}
   */

  /**
   * Given an array of Poly objects, find all neighboring polygons for
   * each polygon.
   * @private
   * @param {Array.<Poly>} polys - The array of polys to find neighbors
   *   for.
   * @return {AdjacencyGrid} - The "neighbor" relationships.
   */
  NavMesh.prototype._generateAdjacencyGrid = function(polys) {
    var neighbors = new WeakMap();
    polys.forEach(function(poly, polyI, polys) {
      if (neighbors.has(poly)) {
        // Maximum number of neighbors already found.
        if (neighbors.get(poly).length == poly.numpoints) {
          return;
        }
      } else {
        // Initialize array.
        neighbors.set(poly, new Array());
      }
      // Of remaining polygons, find some that are adjacent.
      poly.points.forEach(function(p1, i, points) {
        // Next point.
        var p2 = points[poly.getNextI(i)];
        for (var polyJ = polyI + 1; polyJ < polys.length; polyJ++) {
          var poly2 = polys[polyJ];
          // Iterate over points until match is found.
          poly2.points.some(function(q1, j, points2) {
            var q2 = points2[poly2.getNextI(j)];
            var match = p1.eq(q2) && p2.eq(q1);
            if (match) {
              var edge = new Edge(p1, p2);
              neighbors.get(poly).push({ poly: poly2, edge: edge });
              if (!neighbors.has(poly2)) {
                neighbors.set(poly2, new Array());
              }
              neighbors.get(poly2).push({ poly: poly, edge: edge });
            }
            return match;
          });
          if (neighbors.get(poly).length == poly.numpoints) break;
        }
      });
    });
    return neighbors;
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

  // private
  // Returns the index of the largest polygon given an array of polygons.
  NavMesh.prototype._getLargestPoly = function(polys) {
    var best_poly = polys[0];
    var best_poly_index = 0;
    var best_poly_area = Math.abs(polys[0].getArea());

    for (var i = 1; i < polys.length; i++) {
      if (Math.abs(polys[i].getArea()) > best_poly_area) {
        best_poly = polys[i];
        best_poly_index = i;
        best_poly_area = Math.abs(polys[i].getArea());
      }
    }
    return best_poly_index;
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
  NavMesh.prototype._offsetPolys = function(polys, offset) {
    function find(arr, obj, cmp) {
      if (typeof cmp !== 'undefined') {
        for (var i = 0; i < arr.length; i++) {
          if (cmp(arr[i], obj)) {
            return i;
          }
        }
        return -1;
      }
    }

    /**
     * Given two shapes, return true if they are the same, point
     * for point.
     * @param {CLShape} elt1
     * @param {CLShape} elt2
     * @return {boolean} - Whether or not the shapes are the same.
     */
    function shpCompare(elt1, elt2) {
      if (elt1.length !== elt2.length) return false;
      for (var i = 0; i < elt1.length; i++) {
        if (elt1[i].X != elt2[i].X || elt1[i].Y != elt2[i].Y) {
          return false;
        }
      }
      return true;
    }

    /**
     * Make a deep copy of an object.
     * @param {*} o - The object to copy.
     * @return {*} - The copy.
     */
    function copy(o) {
      var out, v, key;
      out = Array.isArray(o) ? [] : {};
      for (key in o) {
        v = o[key];
        out[key] = (typeof v === "object") ? copy(v) : v;
      }
      return out;
    }

    // ~= ball radius / 2
    if (typeof offset == 'undefined') offset = 16;
    var indices = [];
    // Separate CW and CCW shapes. The CCW shapes correspond to the
    // interior wall outlines of out map, the CW shapes are obstacles.
    var outlines = [];
    polys = polys.filter(function(poly, index) {
      if (poly.getOrientation() == "CCW") {
        outlines.push(poly);
        return false;
      }
      return true;
    });

    var scale = 100;

    var cpr = new ClipperLib.Clipper();
    var co = new ClipperLib.ClipperOffset();
    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
    
    // Handle outlines.
    var offsetted_outlines = [];
    outlines.forEach(function(outline) {
      // First, create a shape with the outline as the interior.
      var cOutline = this._convertPolyToClipper(outline);
      var boundingShape = this._getBoundingShape(outline);
      ClipperLib.JS.ScaleUpPaths([cOutline, boundingShape], scale);
      cpr.Clear();
      cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
      cpr.AddPath(cOutline, ClipperLib.PolyType.ptClip, true);

      var solution_paths = new ClipperLib.Paths();
      cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, subject_fillType, clip_fillType);

      // Once we have the shape as created above, inflate it. This gives
      // better results than treating the outline as the exterior of a
      // shape and deflating it.
      co.AddPaths(solution_paths, true);
      var offsetted_paths = new ClipperLib.Paths();

      co.Clear();
      co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
      co.MiterLimit = 2;
      co.arcTolerance = 0.25;
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
        Array.prototype.push.apply(offsetted_outlines, offsetted_paths);
      }
    }, this);

    // Here we are going to inflate the holes.
    var hole_shapes = new Array();
    polys.forEach(function(poly) {
      poly.setOrientation("CCW");
      hole_shapes.push(this._convertPolyToClipper(poly));
    }, this);

    ClipperLib.JS.ScaleUpPaths(hole_shapes, scale);

    co.Clear();
    // Inflate holes.
    var offsetted_holes = new ClipperLib.Paths();
    co.AddPaths(hole_shapes, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_holes, offset * scale);

    // Merge everything together.
    var offsetted_shapes = copy(offsetted_holes);

    cpr.Clear();
    cpr.AddPaths(offsetted_outlines, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(offsetted_shapes, ClipperLib.PolyType.ptClip, true);

    var unioned_shapes_polytree = new ClipperLib.PolyTree();
    cpr.Execute(ClipperLib.ClipType.ctDifference, unioned_shapes_polytree, subject_fillType, clip_fillType);

    polys = new Array();

    /**
     * An area is a shape along with its holes, if any.
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

        // Add children as additional outer polygons.
        child.Childs().forEach(function(child_outer) {
          outer_polygons.push(child_outer);
        });
      });
      areas.push(area);
    }
    
    // Convert Clipper Paths to Polys.
    areas.forEach(function(area) {
      area.polygon = this._convertClipperToPoly(area.polygon);
      area.holes = area.holes.map(this._convertClipperToPoly, this);
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

  // private
  // Get bounds of a given polygon. Returns an object containing minX, minY, maxX, maxY.
  NavMesh.prototype._getBounds = function(poly) {
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    poly.points.forEach(function(p) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    return {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
  }

  // private
  // Get a clipper point array bounding a given Poly by amount 'buffer'.
  NavMesh.prototype._getBoundingShape = function(poly, buffer) {
    if (typeof buffer == 'undefined') buffer = 5;
    var bounds = this._getBounds(poly);
    bounds.minX -= buffer;
    bounds.minY -= buffer;
    bounds.maxX += buffer;
    bounds.maxY += buffer;
    var shape = [];
    shape.push({X: bounds.maxX, Y: bounds.maxY});
    shape.push({X: bounds.minX, Y: bounds.maxY});
    shape.push({X: bounds.minX, Y: bounds.minY});
    shape.push({X: bounds.maxX, Y: bounds.minY});
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

        if (typeof path !== "undefined") {
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
