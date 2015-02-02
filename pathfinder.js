define(['./lib/priority-queue', './polypartition'],
function(   PriorityQueue,      pp) {
  var PolyUtils = pp.PolyUtils;

  /**
   * Pathfinder implements pathfinding on a navigation mesh.
   * @constructor
   * @param {Array.<Poly>} polys - The polygons defining the navigation mesh.
   * @param {boolean} [init=true] - Whether or not to initialize the pathfinder.
   */
  var Pathfinder = function(polys, init) {
    if (typeof init == "undefined") init = true;
    this.polys = polys;
    if (init) {
      this.init();
    }
  }

  Pathfinder.prototype.init = function() {
    this.grid = this.generateAdjacencyGrid(this.polys);
  }

  /**
   * Computes path from source to target, using sides and centers of the edges
   * between adjacent polygons. source and target are Points and polys should
   * be the final partitioned map.
   * @param {Point} source - The start location for the search.
   * @param {Point} target - The target location for the search.
   * @return {?Array.<Point>} - A series of points representing the path from
   *   the source to the target. If a path is not found, `null` is returned.
   */
  Pathfinder.prototype.aStar = function(source, target) {
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

    var sourcePoly = PolyUtils.findPolyForPoint(source, this.polys);

    // We're outside of the mesh somehow. Try a few nearby points.
    if (!sourcePoly) {
      var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
      for (var i = 0; i < offsetSource.length; i++) {
        // Make new point.
        var point = source.add(offsetSource[i]);
        sourcePoly = PolyUtils.findPolyForPoint(point, this.polys);
        if (sourcePoly) {
          source = point;
          break;
        }
      }
      if (!sourcePoly) {
        return null;
      }
    }
    var targetPoly = PolyUtils.findPolyForPoint(target, this.polys);

    // Handle trivial case.
    if (sourcePoly == targetPoly) {
      return [source, target];
    }

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
      for (var i = 0; i < neighbors.length; i++) {
        var elt = neighbors[i];
        var neighborFound = discoveredPolys.has(elt.poly);

        for (var j = 0; j < elt.edge.points.length; j++) {
          var p = elt.edge.points[j];
          if (!neighborFound || !discoveredPoints.has(p))
            pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
        }
      }
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
      return null;
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
   *   among.
   * @return {AdjacencyGrid} - The "neighbor" relationships.
   */
  Pathfinder.prototype.generateAdjacencyGrid = function(polys) {
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

  return Pathfinder;
});
