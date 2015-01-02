requirejs.config({
  shim: {
    './clipper': {
      exports: 'ClipperLib'
    }
  }
});

define(['./polypartition', './priority-queue', './clipper', './worker!./aStarWorker.js', 'bragi'],
function(  pp,                PriorityQueue,      ClipperLib,  aStarWorker,               Logger) {
  Point = pp.Point;
  Poly = pp.Poly;
  Partition = pp.Partition;
  Edge = pp.Edge;
  
  // A NavMesh represents the roll-able area of the map and gives
  // utilities for pathfinding.
  // A NavMesh may be initialized with the polygons representing the
  // map shapes.
  // Usage:
  //   var polys = mapParser.parse(tiles);
  //   var navmesh = new NavMesh(polys);
  //   var path = navmesh.calculatePath(currentlocation, targetLocation);
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

  // Takes in polygons and generates a navigation mesh.
  // Assumption made is that the outline enclosing all other polygons
  // has the largest area.
  NavMesh.prototype.init = function(polys) {
    // Perform initial separation of any slightly overlapping polygons.
    this._separatePolys(polys);

    // Offset polys so they represent walkable area.
    polys = this._offsetPolys(polys);

    // Determine polygon that should be used as the outline.
    var outline_i = this._getLargestPoly(polys);
    var outline = polys.splice(outline_i, 1)[0];

    this.polys = this._generatePartition(outline, polys);
    this.grid = this._generateAdjacencyGrid(this.polys);

    // Keep track of original polygons, generate their edges in advance.
    polys.unshift(outline);

    this.original_polys = polys;
    this.obstacle_edges = [];
    this.original_polys.forEach(function(poly) {
      for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
        this.obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
      }
    }, this);
    this.initialized = true;
  }

  // Returns a path from the source point to the target point. Path has the form
  // of points representing the center of each of the polygons required to get
  // to the target from the source.
  NavMesh.prototype.calculatePath = function(source, target, callback) {
    var sourcePoly, targetPoly;
    var path = [];
    sourcePoly = this.findPolyForPoint(source);
    targetPoly = this.findPolyForPoint(target);
    
    // Already in the same polygon as the target.
    if (sourcePoly == targetPoly) {
      path.push(target);
      callback(path);
      return;
    }

    Logger.log("navmesh", "Calculating path.");
    // Use web worker if present.
    if (this.worker && this.workerInitialized) {
      Logger.log("navmesh", "Using worker to calculate path.");
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

  // Given a point, return the polygon that contains it, if any.
  // May implement a more efficient method later.
  NavMesh.prototype.findPolyForPoint = function(p) {
    var i, poly;
    for (i in this.polys) {
      poly = this.polys[i];
      if (poly.containsPoint(p)) {
        return poly;
      }
    }
  }

  // Return true if p1 is visible from p2. The offset outline and holes are
  // used as obstacles in this case.
  NavMesh.prototype.checkVisible = function(p1, p2) {
    var edge = new Edge(p1, p2);
    //console.log("Checking if this edge intersects any of these.");
    window.BotEdge = edge;
    checkEdge = function(edges, edge_index, my_edge) {
      var thisEdge = edges[edge_index];
      //window.BotEdge2 = thisEdge;
      console.log("Checking if this edge and the red one intersect.");
      if (thisEdge.intersects(my_edge)) {
        console.log("They intersect!");
      } else {
        console.log("They don't intersect!");
      }
      if (edge_index !== edges.length - 1) {
        setTimeout(function() {
          checkEdge(edges, edge_index + 1, my_edge);
        }, 1000);
      }
    }
    //checkEdge(this.obstacle_edges, 0, edge);
    var blocked = this.obstacle_edges.some(function(e) {return e.intersects(edge);});
    //console.log("Visible: " + !blocked);
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

    var sourcePoly = this.findPolyForPoint(source);
    // We're outside of the mesh somehow. Try a few nearby points.
    if (typeof sourcePoly == 'undefined') {
      var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
      for (var i = 0; i < offsetSource.length; i++) {
        // Make new point.
        var point = source.add(offsetSource[i]);
        sourcePoly = this.findPolyForPoint(point);
        if (!(typeof sourcePoly == 'undefined')) {
          source = point;
          break;
        }
      }
      if (typeof sourcePoly == 'undefined') {
        return;
      }
    }
    var targetPoly = this.findPolyForPoint(target);

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

  // private
  // Convert an array of polygons that overlap themselves and others
  // at discrete corner points and 'nib' their overlapping corners so
  // they are suitable for triangulation by poly2tri.js.
  // polys should be an Array of Poly objects, [optional] offset is the
  // number of units the vertices should be moved away. Nothing is returned
  // and this method changes the polys in the given array.
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

  // private
  // Offset the polygons such that there is a 'offset' unit buffer between the sides
  // of the outline and around the obstacles. This buffer makes it so that the
  // mesh truly represents the movable area in the map. 'offset' is optional and has
  // a default value of 18 (which is half the size of a ball in TagPro).
  // Assumes vertices defining interior shapes (like the main outline of an enclosed map)
  // are given in CCW order and obstacles are given in CW order.
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

    // Compare two array locations.
    function shpCompare(elt1, elt2) {
      if (elt1.length !== elt2.length) return false;
      for (var i = 0; i < elt1.length; i++) {
        if (elt1[i].X != elt2[i].X || elt1[i].Y != elt2[i].Y) {
          return false;
        }
      }
      return true;
    }

    // Deep copy given object/array.
    function copy(o) {
      var out, v, key;
      out = Array.isArray(o) ? [] : {};
      for (key in o) {
        v = o[key];
        out[key] = (typeof v === "object") ? copy(v) : v;
      }
      return out;
    }

    if (typeof offset == 'undefined') offset = 18; // ball radius / 2
    var indices = [];
    // For the moment assumes that there is only 1 'outline'.
    var outline = polys.filter(function(poly, index) {
      if (poly.getOrientation() == "CCW") {
        indices.push(index);
        return true;
      }
      return false;
    });
    var outline_i = indices[0];
    outline = outline[0];
    polys.splice(outline_i, 1);


    // Handle outline.
    // First, create a shape with the outline as the interior.
    var scale = 100;
    var cOutline = this._convertPolyToClipper(outline);
    var boundingShape = this._getBoundingShape(outline);
    var cpr = new ClipperLib.Clipper();
    ClipperLib.JS.ScaleUpPaths([cOutline, boundingShape], scale);
    cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPath(cOutline, ClipperLib.PolyType.ptClip, true);

    var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
    var clip_fillType = ClipperLib.PolyFillType.pftNonZero;

    var solution_paths = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, subject_fillType, clip_fillType);

    // Once we have the shape as created above, inflate it. This works better than treating the outline
    // as the exterior of a shape and deflating it.
    var co = new ClipperLib.ClipperOffset();
    co.AddPaths(solution_paths, true);
    var offsetted_paths = new ClipperLib.Paths();

    co.Clear();
    co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.MiterLimit = 2;
    co.arcTolerance = 0.25;
    co.Execute(offsetted_paths, offset * scale);

    // Get only the path defining the outline we were interested in, discarding the exterior bounding
    // shape.
    var offsetted_outline = offsetted_paths[1];

    // Here we are going to inflate the holes.
    co.Clear();

    var hole_shapes = new Array();
    polys.forEach(function(poly) {
      poly.setOrientation("CCW");
      hole_shapes.push(this._convertPolyToClipper(poly));
    }, this);

    ClipperLib.JS.ScaleUpPaths(hole_shapes, scale);

    // Inflate holes.
    var offsetted_holes = new ClipperLib.Paths();
    co.AddPaths(hole_shapes, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_holes, offset * scale);

    // Merge everything together.
    // Copy and change orientation of all holes.
    var offsetted_shapes = copy(offsetted_holes);
    /*offsetted_shapes.forEach(function(shape) {
      shape.reverse();
    });*/
    //offsetted_shapes.push(offsetted_outline);

    cpr.Clear();
    cpr.AddPath(offsetted_outline, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(offsetted_shapes, ClipperLib.PolyType.ptClip, true);

    var unioned_holes = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctDifference, unioned_holes, subject_fillType, clip_fillType);
    /*unioned_holes.forEach(function(u) {
      if (find(offsetted_holes, u, shpCompare) !== -1) {
        console.log("Found.");
      } else {
        console.log(u);
      }
    });*/
    ClipperLib.JS.ScaleDownPaths(unioned_holes, scale);
    polys = new Array();
    unioned_holes.forEach(function(shape) {
      polys.push(this._convertClipperToPoly(shape));
    }, this);

    //polys.unshift(new_outline);
    return polys;
  }

  // private
  // Convert polygon into array of objects with X, Y properties, as
  // expected by Clipper.
  NavMesh.prototype._convertPolyToClipper = function(poly) {
    return poly.points.map(function(p) {
      return {X:p.x, Y:p.y};
    });
  }

  // private
  // Convert clipper point array into Poly.
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

  // First element of message array should be the group to log the
  // message to.
  NavMesh.prototype._workerLogger = function(message) {
    //var group = message.shift();
    Logger.log.apply(null, message);
  }

  NavMesh.prototype._workerInit = function() {
    if (this.initialized && this.worker && this.workerInitialized) {
      this.worker.postMessage(["polys", this.polys]);
    }

    /**
     * Set up listeners for web worker messages.
     * Messages can have type "log" and "result".
     */
    this.worker.onmessage = function(message) {
      var data = message.data;
      var name = data[0];
      var content = data[1];
      // Omit log messages from worker in debug message.
      if (name !== "log")
        Logger.log("navmesh:debug", "Message received from worker:", data);

      if (name == "log") {
        this._workerLogger(data.slice(1));
      } else if (name == "result") {
        var path = content.map(function(location) {
          return new Point(location.x, location.y);
        });

        if (typeof path !== "undefined") {
          // Remove first entry, which is current position.
          path = path.slice(1);
        }
        this.lastCallback(path);
      }
    }.bind(this)
  }

  return NavMesh;
});
