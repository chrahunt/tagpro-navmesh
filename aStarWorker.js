importScripts('http://localhost:8000/map/require.js');

// Default response for indicating requirejs is not loaded.
onmessage = function(message) {
  var data = message.data;
  var name = data[0];
  if (name == "isInitialized") {
    postMessage(["init", false]);
  }
}

require({
        baseUrl: 'http://localhost:8000/map/'
    }, ['./priority-queue', './polypartition'],
function(  PriorityQueue,      pp) {
  var Point = pp.Point;
  var Poly = pp.Poly;
  var PolyUtils = pp.PolyUtils;

  /**
   * Object with utility methods for converting objects from serialized
   * message form into the required objects.
   */
  var Convert = {};

  /**
   * The format of a Point as serialized by the Web Worker message-
   * passing interface.
   * @typedef {object} PointObj
   * @property {number} x
   * @property {number} y
   */

  /**
   * Convert serialized Point object back to Point.
   * @param {PointObj} obj - The serialized Point object.
   */
  Convert.toPoint = function(obj) {
    return new Point(obj.x, obj.y);
  }

  /**
   * The format of a Poly as serialized by the Web Worker message-
   * passing interface.
   * @typedef {object} PolyObj
   * @property {Array.<PointObj>} points - The array of serialized
   *   Points.
   * @property {boolean} hole - Whether or not the polygon is a hole.
   * @property {integer} numpoints - The number of points in the Poly.
   */

   /**
    * Convert serialized Poly object back to Poly.
    * @param {PolyObj} obj - The serialized Poly object.
    */
  Convert.toPoly = function(obj) {
    var poly = new Poly();
    poly.points = obj.points.map(Convert.toPoint);
    poly.hole = obj.hole;
    poly.update();
    return poly;
  }

  // Copied from NavMesh.prototype.aStar.
  function aStar(source, target) {
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

    var sourcePoly = PolyUtils.findPolyForPoint(source, self.polys);
    // We're outside of the mesh somehow. Try a few nearby points.
    if (typeof sourcePoly == 'undefined') {
      var offsetSource = [new Point(5, 0), new Point(-5, 0), new Point(0, -5), new Point(0, 5)];
      for (var i = 0; i < offsetSource.length; i++) {
        // Make new point.
        var point = source.add(offsetSource[i]);
        sourcePoly = PolyUtils.findPolyForPoint(point, self.polys);
        if (!(typeof sourcePoly == 'undefined')) {
          source = point;
          break;
        }
      }
      if (typeof sourcePoly == 'undefined') {
        return;
      }
    }
    var targetPoly = PolyUtils.findPolyForPoint(target, self.polys);

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
      var neighbors = self.grid.get(node.poly);
      for (var i = 0; i < neighbors.length; i++) {
        var elt = neighbors[i];
        var neighborFound = discoveredPolys.has(elt.poly);

        for (var j = 0; j < elt.edge.points.length; j++) {
          var p = elt.edge.points[j];
          if (!neighborFound || !discoveredPoints.has(p))
            pq.queue({dist: node.dist + euclideanDistance(p, node.point), poly: elt.poly, point: p, parent: node});
        }
      }
      // Commented out and trying the above approach.
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

  // Copied from NavMes.prototype.generateAdjacencyGrid.
  function generateAdjacencyGrid(polys) {
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

  var Logger = {};

  /**
   * Sends message to parent to be logged to console. Takes same
   * arguments as Bragi logger.
   * @param {string} group - The group to associate the message with.
   * @param {*..} - arbitrary arguments to be passed back to the parent
   *   logging function.
   */
  Logger.log = function(group) {
    var message = ["log"];
    Array.prototype.push.apply(message, arguments);
    postMessage(message);
  }

  /**
   * Set up various actions to take on communication.
   * Messages come in as arrays with the first element being a string identifier
   * for the message type, and subsequent elements being arguments to be passed
   * to the relevant function.
   * Message types:
   * * polys - sets the polygons to use for navigation
   *     - {array} array of polygons defining the map
   * * aStar - computes A* on above-set items
   *     - {Point} start location to use for search
   *     - {Point} end location to use for search
   */
  onmessage = function(e) {
    var data = e.data;
    var name = data[0];
    Logger.log("worker:debug", "Message received to worker:", data);
    if (name == "polys") {
      // Polygons defining map.
      self.polys = data[1].map(Convert.toPoly);
      // Send poly back so we can examine it.
      Logger.log("worker", self.polys[0]); // DEBUG
      // Generate adjacency matrix for aStar.
      self.grid = generateAdjacencyGrid(self.polys);
    } else if (name == "aStar") {
      var source = Convert.toPoint(data[1]);
      var target = Convert.toPoint(data[2]);

      var path = aStar(source, target);
      postMessage(["result", path]);
    } else if (name == "isInitialized") {
      postMessage(["init", true]);
    }
  }

  Logger.log("worker", "Worker loaded.");
  // Sent confirmation that worker is initialized.
  postMessage(["init", true]);
});
