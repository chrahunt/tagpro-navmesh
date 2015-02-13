require(['./pathfinder', './polypartition'],
function(   Pathfinder,     pp) {
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

  var Logger = {};

  /**
   * Sends message to parent to be logged to console. Takes same
   * arguments as Bragi logger.
   * @param {string} group - The group to associate the message with.
   * @param {...*} - arbitrary arguments to be passed back to the parent
   *   logging function.
   */
  Logger.log = function(group) {
    var message = ["log"];
    Array.prototype.push.apply(message, arguments);
    postMessage(message);
  }

  /**
   * Set up various actions to take on communication.
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
    Logger.log("worker:debug", "Message received to worker:", data);
    if (name == "polys") {
      // Polygons defining map.
      self.polys = data[1].map(Convert.toPoly);

      // Initialize pathfinder module.
      self.pathfinder = new Pathfinder(self.polys);
    } else if (name == "aStar") {
      var source = Convert.toPoint(data[1]);
      var target = Convert.toPoint(data[2]);

      var path = self.pathfinder.aStar(source, target);
      postMessage(["result", path]);
    } else if (name == "isInitialized") {
      postMessage(["initialized"]);
    }
  }

  Logger.log("worker", "Worker loaded.");
  // Sent confirmation that worker is initialized.
  postMessage(["initialized"]);
});
