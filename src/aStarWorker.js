var Pathfinder = require('./pathfinder');
var geo = require('./geometry');

/**
 * Pathfinding web worker implementation.
 * @ignore
 */
module.exports = function () {


var Point = geo.Point;
var Poly = geo.Poly;

/**
 * Object with utility methods for converting objects from serialized
 * message form into the required objects.
 * @private
 */
var Convert = {};

/**
 * The format of a Point as serialized by the Web Worker message-
 * passing interface.
 * @private
 * @typedef {object} PointObj
 * @property {number} x
 * @property {number} y
 */

/**
 * Convert serialized Point object back to Point.
 * @private
 * @param {PointObj} obj - The serialized Point object.
 */
Convert.toPoint = function(obj) {
  return new Point(obj.x, obj.y);
};

/**
 * The format of a Poly as serialized by the Web Worker message-
 * passing interface.
 * @private
 * @typedef {object} PolyObj
 * @property {Array.<PointObj>} points - The array of serialized
 *   Points.
 * @property {boolean} hole - Whether or not the polygon is a hole.
 * @property {integer} numpoints - The number of points in the Poly.
 */

 /**
  * Convert serialized Poly object back to Poly.
  * @private
  * @param {PolyObj} obj - The serialized Poly object.
  */
Convert.toPoly = function(obj) {
  var poly = new Poly();
  poly.points = obj.points.map(Convert.toPoint);
  poly.hole = obj.hole;
  poly.update();
  return poly;
};

var Logger = {};

/**
 * Sends message to parent to be logged to console. Takes same
 * arguments as Bragi logger.
 * @private
 * @param {string} group - The group to associate the message with.
 * @param {...*} - arbitrary arguments to be passed back to the parent
 *   logging function.
 */
Logger.log = function(group) {
  var message = ["log"];
  Array.prototype.push.apply(message, arguments);
  postMessage(message);
};

var Util = {};

Util.splice = function(ary, indices) {
  indices = indices.sort(Util._numberCompare).reverse();
  var removed = [];
  indices.forEach(function(i) {
    removed.push(ary.splice(i, 1)[0]);
  });
  return removed;
};

Util._numberCompare = function(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

/**
 * Set up various actions to take on communication.
 * @private
 * @param {Array} e - An array with the first element being a string
 *   identifier for the message type, and subsequent elements being
 *   arguments to be passed to the relevant function. Message types:
 *   * polys - sets the polygons to use for navigation
 *       - {Array.<Poly>} array of polygons defining the map
 *   * aStar - computes A* on above-set items
 *       - {Point} start location to use for search
 *       - {Point} end location to use for search
 *   * isInitialized - check if the worker is initialized.
 */
onmessage = function(e) {
  var data = e.data;
  var name = data[0];
  Logger.log("worker:debug", "Message received by worker:", data);
  if (name == "polys") {
    // Polygons defining map.
    self.polys = data[1].map(Convert.toPoly);

    // Initialize pathfinder module.
    self.pathfinder = new Pathfinder(self.polys);
  } else if (name == "polyUpdate") {
    // Update to navmesh.
    var newPolys = data[1].map(Convert.toPoly);
    var removedPolys = data[2];

    Util.splice(self.polys, removedPolys);
    Array.prototype.push.apply(self.polys, newPolys);

    // Re-initialize pathfinder.
    self.pathfinder = new Pathfinder(self.polys);
  } else if (name == "aStar") {
    var source = Convert.toPoint(data[1]);
    var target = Convert.toPoint(data[2]);

    var path = self.pathfinder.aStar(source, target);
    postMessage(["result", path]);
  } else if (name == "isInitialized") {
    postMessage(["initialized"]);
  }
};

Logger.log("worker", "Worker loaded.");
// Sent confirmation that worker is initialized.
postMessage(["initialized"]);

};
