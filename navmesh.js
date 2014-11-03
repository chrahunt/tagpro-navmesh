requirejs.config({
  shim: {
    './clipper': {
      exports: 'ClipperLib'
    }
  }
});

define(['./polypartition', './priority-queue', './clipper'],
function(  pp,                PriorityQueue,      ClipperLib) {
  Point = pp.Point;
  Poly = pp.Poly;
  Partition = pp.Partition;
  // Edges are used to represent the border between two adjacent
  // polygons.
  Edge = function(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.center = p1.add(p2.sub(p1).div(2));
    this.points = [this.p1, this.center, this.p2];
  }

  // A NavMesh represents the roll-able area of the map and gives
  // utilities for pathfinding.
  // A NavMesh may be initialized with the polygons representing the
  // map shapes.
  // Usage:
  //   var polys = mapParser.parse(tiles);
  //   var navmesh = new NavMesh(polys);
  //   var path = navmesh.calculatePath(currentlocation, targetLocation);
  var NavMesh = function(polys) {
    if (typeof polys === 'undefined') { return; }
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
  }

  // Returns a path from the source point to the target point. Path has the form
  // of points representing the center of each of the polygons required to get
  // to the target from the source.
  NavMesh.prototype.calculatePath = function(source, target) {
    var sourcePoly, targetPoly;
    var path = [];
    sourcePoly = this.findPolyForPoint(source);
    targetPoly = this.findPolyForPoint(target);
    
    // Already in the same polygon as the target.
    if (sourcePoly == targetPoly) {
      path.push(target);
      return path;
    }

    path = this._aStar(source, target, this.polys);
    path.push(target);
    return path;
  }

  // Returns list of polys needed to get from source to target.
  // Currently uses distance from/to centroids as measure of value for
  // paths.
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
    
    var sourcePoly = this.findPolyForPoint(source);
    var targetPoly = this.findPolyForPoint(target);

    var discoveredPolys = [];
    var discoveredPoints = [];
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
        discoveredPolys.push(node.poly);
        discoveredPoints.push(node.point);
      }
      var neighbors = this.grid[node.poly];
      neighbors.forEach(function(elt) {
        // Get neighbor/point combos that haven't been previously discovered.
        var neighborFound = (discoveredPolys.indexOf(elt.poly) != -1);

        elt.edge.points.forEach(function(p) {
          if (!neighborFound || (discoveredPoints.indexOf(p) == -1))
            pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
        });
      });
    }

    if (found) {
      var path = [];
      var current = found;
      while (current.parent) {
        path.unshift(current.point);
        current = current.parent;
      }
      path.unshift(current.point);
      return path;
    } else {
      return null;
    }
  }

  // private
  // Given an array of Poly objects, find all neighboring polygons for
  // each polygon. Return value is an object with Poly keys and an array
  // of Poly objects as values, representing the neighboring polygons.
  NavMesh.prototype._generateAdjacencyGrid = function(polys) {
    var neighbors = {};
    polys.forEach(function(poly, polyI, polys) {
      if (neighbors.hasOwnProperty(poly)) {
        // Maximum number of neighbors already found.
        if (neighbors[poly].length == poly.numpoints) {
          return;
        }
      } else {
        // Initialize array.
        neighbors[poly] = new Array();
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
              neighbors[poly].push({ poly: poly2, edge: edge });
              if (!neighbors.hasOwnProperty(poly2)) {
                neighbors[poly2] = new Array();
              }
              neighbors[poly2].push({ poly: poly, edge: edge });
            }
            return match;
          });
          if (neighbors[poly].length == poly.numpoints) break;
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

  // Given a point, return the polygon that contains it, if any.
  NavMesh.prototype.findPolyForPoint = function(p) {
    var i, poly;
    for (i in this.polys) {
      poly = this.polys[i];
      if (poly.containsPoint(p)) {
        return poly;
      }
    }
  }

  // private
  // Returns the index of the largest polygon given an array of polygons.
  NavMesh.prototype._getLargestPoly = function(polys) {
    var best_poly = polys[0];
    var best_poly_index = 0;
    var best_poly_area = Math.abs(polys[0].getArea());
    console.log(polys[0].getArea());
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
  // mesh truly represents the movable area in the map.
  NavMesh.prototype._offsetPolys = function(polys, offset) {
    if (typeof offset == 'undefined') offset = 19;
    var outline_i = this._getLargestPoly(polys);
    var outline = polys.splice(outline_i, 1)[0];

    // Handle outline.
    // First, create a shape with the map as the interior.
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

    // Once we have the shape as created above, inflate it.
    var co = new ClipperLib.ClipperOffset();
    co.AddPaths(solution_paths, true);
    var offsetted_paths = new ClipperLib.Paths();

    co.Clear();
    co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.MiterLimit = 2;
    co.arcTolerance = 0.25;
    co.Execute(offsetted_paths, offset * scale);
    ClipperLib.JS.ScaleDownPaths(offsetted_paths, scale);
    console.log(offsetted_paths);
    var new_outline = this._convertClipperToPoly(offsetted_paths[1]);

    // Handle holes.
    co.Clear();

    var hole_shapes = new Array();
    polys.forEach(function(poly) {
      poly.setOrientation("CCW");
      hole_shapes.push(this._convertPolyToClipper(poly));
    }, this);

    ClipperLib.JS.ScaleUpPaths(hole_shapes, scale);

    var offsetted_holes = new ClipperLib.Paths();
    co.AddPaths(hole_shapes, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_holes, offset * scale);

    cpr.Clear();
    cpr.AddPaths(offsetted_holes, ClipperLib.PolyType.ptSubject, true);

    var unioned_holes = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctUnion, unioned_holes, subject_fillType, clip_fillType);
    ClipperLib.JS.ScaleDownPaths(unioned_holes, scale);
    polys = new Array();
    unioned_holes.forEach(function(shape) {
      polys.push(this._convertClipperToPoly(shape));
    }, this);

    polys.unshift(new_outline);
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
  // Get bounds of a given polygon.
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



  return NavMesh;
});
