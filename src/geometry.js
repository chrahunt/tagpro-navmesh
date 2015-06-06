/**
 * A point can represent a vertex in a 2d environment or a vector.
 * @constructor
 * @param {number} x - The `x` coordinate of the point.
 * @param {number} y - The `y` coordinate of the point.
 */
Point = function(x, y) {
  this.x = x;
  this.y = y;
};
exports.Point = Point;

/**
 * Convert a point-like object into a point.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.fromPointLike = function(p) {
  return new Point(p.x, p.y);
};

/**
 * String method for point-like objects.
 * @param {PointLike} p - The point-like object to convert.
 * @return {Point} - The new point representing the point-like
 *   object.
 */
Point.toString = function(p) {
  return "x" + p.x + "y" + p.y;
};

/**
 * Takes a point or scalar and adds slotwise in the case of another
 * point, or to each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to add to this
 *   point.
 */
Point.prototype.add = function(p) {
  if (typeof p == "number")
    return new Point(this.x + p, this.y + p);
  return new Point(this.x + p.x, this.y + p.y);
};

/**
 * Takes a point or scalar and subtracts slotwise in the case of
 * another point or from each parameter in the case of a scalar.
 * @param {(Point|number)} - The Point, or scalar, to subtract from
 *   this point.
 */
Point.prototype.sub = function(p) {
  if (typeof p == "number")
    return new Point(this.x - p, this.y - p);
  return new Point(this.x - p.x, this.y - p.y);
};

/**
 * Takes a scalar value and multiplies each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to multiple the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.mul = function(f) {
  return new Point(this.x * f, this.y * f);
};

/**
 * Takes a scalar value and divides each parameter of the point
 * by the scalar.
 * @param  {number} f - The number to divide the parameters by.
 * @return {Point} - A new point with the calculated coordinates.
 */
Point.prototype.div = function(f) {
  return new Point(this.x / f, this.y / f);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are equal. Two points are equal if their parameters are
 * equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are equal.
 */
Point.prototype.eq = function(p) {
  return (this.x == p.x && this.y == p.y);
};

/**
 * Takes another point and returns a boolean indicating whether the
 * points are not equal. Two points are considered not equal if their
 * parameters are not equal.
 * @param  {Point} p - The point to check equality against.
 * @return {boolean} - Whether or not the two points are not equal.
 */
Point.prototype.neq = function(p) {
  return (this.x != p.x || this.y != p.y);
};

// Given another point, returns the dot product.
Point.prototype.dot = function(p) {
  return (this.x * p.x + this.y * p.y);
};

// Given another point, returns the 'cross product', or at least the 2d
// equivalent.
Point.prototype.cross = function(p) {
  return (this.x * p.y - this.y * p.x);
};

// Given another point, returns the distance to that point.
Point.prototype.dist = function(p) {
  var diff = this.sub(p);
  return Math.sqrt(diff.dot(diff));
};

// Given another point, returns the squared distance to that point.
Point.prototype.dist2 = function(p) {
  var diff = this.sub(p);
  return diff.dot(diff);
};

/**
 * Returns true if the point is (0, 0).
 * @return {boolean} - Whether or not the point is (0, 0).
 */
Point.prototype.zero = function() {
  return this.x == 0 && this.y == 0;
};

Point.prototype.len = function() {
  return this.dist(new Point(0, 0));
};

Point.prototype.normalize = function() {
  var n = this.dist(new Point(0, 0));
  if (n > 0) return this.div(n);
  return new Point(0, 0);
};

Point.prototype.toString = function() {
  return 'x' + this.x + 'y' + this.y;
};

/**
 * Return a copy of the point.
 * @return {Point} - The new point.
 */
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
 * Edges are used to represent the border between two adjacent
 * polygons.
 * @constructor
 * @param {Point} p1 - The first point of the edge.
 * @param {Point} p2 - The second point of the edge.
 */
Edge = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  this.center = p1.add(p2.sub(p1).div(2));
  this.points = [this.p1, this.center, this.p2];
};
exports.Edge = Edge;

Edge.prototype._CCW = function(p1, p2, p3) {
  a = p1.x; b = p1.y;
  c = p2.x; d = p2.y;
  e = p3.x; f = p3.y;
  return (f - b) * (c - a) > (d - b) * (e - a);
};

/**
 * from http://stackoverflow.com/a/16725715
 * Checks whether this edge intersects the provided edge.
 * @param {Edge} edge - The edge to check intersection for.
 * @return {boolean} - Whether or not the edges intersect.
 */
Edge.prototype.intersects = function(edge) {
  var q1 = edge.p1, q2 = edge.p2;
  if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;
  return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));
};

/**
 * Polygon class.
 * Can be initialized with an array of points.
 * @constructor
 * @param {Array.<Point>} [points] - The points to use to initialize
 *   the poly.
 */
Poly = function(points) {
  if (typeof points == 'undefined') points = false;
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
  if (points) {
    this.numpoints = points.length;
    this.points = points.slice();
  }
};
exports.Poly = Poly;

Poly.prototype.init = function(n) {
  this.points = new Array(n);
  this.numpoints = n;
};

Poly.prototype.update = function() {
  this.numpoints = this.points.length;
};

Poly.prototype.triangle = function(p1, p2, p3) {
  this.init(3);
  this.points[0] = p1;
  this.points[1] = p2;
  this.points[2] = p3;
};

// Takes an index and returns the point at that index, or null.
Poly.prototype.getPoint = function(n) {
  if (this.points && this.numpoints > n)
    return this.points[n];
  return null;
};

// Set a point, fails silently otherwise. TODO: replace with bracket notation.
Poly.prototype.setPoint = function(i, p) {
  if (this.points && this.points.length > i) {
    this.points[i] = p;
  }
};

// Given an index i, return the index of the next point.
Poly.prototype.getNextI = function(i) {
  return (i + 1) % this.numpoints;
};

Poly.prototype.getPrevI = function(i) {
  if (i == 0)
    return (this.numpoints - 1);
  return i - 1;
};

// Returns the signed area of a polygon, if the vertices are given in
// CCW order then the area will be > 0, < 0 otherwise.
Poly.prototype.getArea = function() {
  var area = 0;
  for (var i = 0; i < this.numpoints; i++) {
    var i2 = this.getNextI(i);
    area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;
  }
  return area;
};

Poly.prototype.getOrientation = function() {
  var area = this.getArea();
  if (area > 0) return "CCW";
  if (area < 0) return "CW";
  return 0;
};

Poly.prototype.setOrientation = function(orientation) {
  var current_orientation = this.getOrientation();
  if (current_orientation && (current_orientation !== orientation)) {
    this.invert();
  }
};

Poly.prototype.invert = function() {
  var newpoints = new Array(this.numpoints);
  for (var i = 0; i < this.numpoints; i++) {
    newpoints[i] = this.points[this.numpoints - i - 1];
  }
  this.points = newpoints;
};

Poly.prototype.getCenter = function() {
  var x = this.points.map(function(p) { return p.x });
  var y = this.points.map(function(p) { return p.y });
  var minX = Math.min.apply(null, x);
  var maxX = Math.max.apply(null, x);
  var minY = Math.min.apply(null, y);
  var maxY = Math.max.apply(null, y);
  return new Point((minX + maxX)/2, (minY + maxY)/2);
};

// Adapted from http://stackoverflow.com/a/16283349
Poly.prototype.centroid = function() {
  var x = 0,
      y = 0,
      i,
      j,
      f,
      point1,
      point2;

  for (i = 0, j = this.points.length - 1; i < this.points.length; j = i, i += 1) {
    point1 = this.points[i];
    point2 = this.points[j];
    f = point1.x * point2.y - point2.x * point1.y;
    x += (point1.x + point2.x) * f;
    y += (point1.y + point2.y) * f;
  }

  f = this.getArea() * 3;
  x = Math.abs(x);
  y = Math.abs(y);
  return new Point(x / f, y / f);
};

Poly.prototype.toString = function() {
  var center = this.centroid();
  return "" + center.x + " " + center.y;
};

/**
 * Checks if the given point is contained within the Polygon.
 * Adapted from http://stackoverflow.com/a/8721483
 *
 * @param {Point} p - The point to check.
 * @return {boolean} - Whether or not the point is contained within
 *   the polygon.
 */
Poly.prototype.containsPoint = function(p) {
  var result = false;
  for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
    var p1 = this.points[j], p2 = this.points[i];
    if ((p2.y > p.y) != (p1.y > p.y) &&
        (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {
      result = !result;
    }
  }
  return result;
};

/**
 * Clone the given polygon into a new polygon.
 * @return {Poly} - A clone of the polygon.
 */
Poly.prototype.clone = function() {
  return new Poly(this.points.slice().map(function(point) {
    return point.clone();
  }));
};

/**
 * Translate a polygon along a given vector.
 * @param {Point} vec - The vector along which to translate the
 *   polygon.
 * @return {Poly} - The translated polygon.
 */
Poly.prototype.translate = function(vec) {
  return new Poly(this.points.map(function(point) {
    return point.add(vec);
  }));
};

/**
 * Returns an array of edges representing the polygon.
 * @return {Array.<Edge>} - The edges of the polygon.
 */
Poly.prototype.edges = function() {
  if (!this.hasOwnProperty("cached_edges")) {
    this.cached_edges = this.points.map(function(point, i) {
      return new Edge(point, this.points[this.getNextI(i)]);
    }, this);
  }
  return this.cached_edges;
};

/**
 * Naive check if other poly intersects this one, assuming both convex.
 * @param {Poly} poly
 * @return {boolean} - Whether the polygons intersect.
 */
Poly.prototype.intersects = function(poly) {
  var inside = poly.points.some(function(p) {
    return this.containsPoint(p);
  }, this);
  inside = inside || this.points.some(function(p) {
    return poly.containsPoint(p);
  });
  if (inside) {
    return true;
  } else {
    var ownEdges = this.edges();
    var otherEdges = poly.edges();
    var intersect = ownEdges.some(function(ownEdge) {
      return otherEdges.some(function(otherEdge) {
        return ownEdge.intersects(otherEdge);
      });
    });
    return intersect;
  }
};

var util = {};
exports.util = util;

/**
 * Given an array of polygons, returns the one that contains the point.
 * If no polygon is found, null is returned.
 * @param {Point} p - The point to find the polygon for.
 * @param {Array.<Poly>} polys - The polygons to search for the point.
 * @return {?Polygon} - The polygon containing the point.
 */
util.findPolyForPoint = function(p, polys) {
  var i, poly;
  for (i in polys) {
    poly = polys[i];
    if (poly.containsPoint(p)) {
      return poly;
    }
  }
  return null;
};

/**
 * Holds the properties of a collision, if one occurred.
 * @typedef Collision
 * @type {object}
 * @property {boolean} collides - Whether there is a collision.
 * @property {boolean} inside - Whether one object is inside the other.
 * @property {?Point} point - The point of collision, if collision
 *   occurs, and if `inside` is false.
 * @property {?Point} normal - A unit vector normal to the point
 *   of collision, if it occurs and if `inside` is false.
 */
/**
 * If the ray intersects the circle, the distance to the intersection
 * along the ray is returned, otherwise false is returned.
 * @param {Point} p - The start of the ray.
 * @param {Point} ray - Unit vector extending from `p`.
 * @param {Point} c - The center of the circle for the object being
 *   checked for intersection.
 * @param {number} radius - The radius of the circle.
 * @return {Collision} - The collision information.
 */
util.lineCircleIntersection = function(p, ray, c, radius) {
  var collision = {
    collides: false,
    inside: false,
    point: null,
    normal: null
  };
  var vpc = c.sub(p);

  if (vpc.len() <= radius) {
    // Point is inside obstacle.
    collision.collides = true;
    collision.inside = (vpc.len() !== radius);
  } else if (ray.dot(vpc) >= 0) {
    // Circle is ahead of point.
    // Projection of center point onto ray.
    var pc = p.add(ray.mul(ray.dot(vpc)));
    // Length from c to its projection on the ray.
    var len_c_pc = c.sub(pc).len();

    if (len_c_pc <= radius) {
      collision.collides = true;

      // Distance from projected point to intersection.
      var len_intersection = Math.sqrt(len_c_pc * len_c_pc + radius * radius);
      collision.point = pc.sub(ray.mul(len_intersection));
      collision.normal = collision.point.sub(c).normalize();
    }
  }
  return collision;
};
