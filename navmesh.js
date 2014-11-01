define(['polypartition', 'priority-queue'],
function(pp, PriorityQueue) {
  Point = pp.Point;
  Poly = pp.Poly;
  Partition = pp.Partition;

  var NavMesh = function() {};

  // Takes in polygons and generates a navigation mesh.
  // Assumption made is that the outline enclosing all other polygons
  // has the largest area.
  NavMesh.prototype.init = function(polys) {
    // Perform initial separation of any slightly overlapping polygons.
    this._separatePolys(polys);

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
      path.push(source, sourcePoly.centroid(), target);
      return path;
    }

    var polyPath = this._aStar(sourcePoly, targetPoly, this.polys);

    path.push(source);
    polyPath.forEach(function(poly) {
      path.push(poly.centroid());
    });
    path.push(target);
    return path;
  }

  // Returns list of polys needed to get from source to target
  NavMesh.prototype._aStar = function(source, target, polys) {
    function nodeValue(node1, node2) {
      return (node1.dist + heuristic(node1.loc)) - (node2.dist + heuristic(node2.loc));
    }

    // Distance between polygons.
    function euclideanDistance(p1, p2) {
      return p1.dist(p2);
    }

    // Distance between polygons. todo: update
    function manhattanDistance(elt1, elt2) {
      return (elt1.r - elt2.r) + (elt1.c - elt2.c);
    }

    // Takes Poly and returns value.
    function heuristic(poly) {
      return euclideanDistance(poly.centroid(), target.centroid());
    }

    var discovered = [];
    var pq = new PriorityQueue({ comparator: nodeValue });
    var found = null;
    // Initialize with start location.
    pq.queue({dist: 0, loc: source, parent: null});
    while (pq.length > 0) {
      var node = pq.dequeue();
      if (node.loc == target) {
        found = node;
        break;
      } else {
        discovered.push(node.loc);
      }
      // Get neighbors that haven't been previously discovered.
      var neighbors = this.grid[node.loc];
      neighbors = neighbors.filter(function(elt) {
        return (discovered.indexOf(elt) == -1);
      });
      neighbors.forEach(function(elt) {
        pq.queue({dist: node.dist + euclideanDistance(elt.centroid(), node.loc.centroid()), loc: elt, parent: node});
      });
    }

    if (found) {
      var path = [];
      var current = found;
      while (current.parent) {
        path.unshift(current.loc);
        current = current.parent;
      }
      path.unshift(current.loc);
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
              neighbors[poly].push(poly2);
              if (!neighbors.hasOwnProperty(poly2)) {
                neighbors[poly2] = new Array();
              }
              neighbors[poly2].push(poly);
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

  return NavMesh;
});
