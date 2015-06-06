/**
 * Holds classes for points, polygons, and utilities for operating on
 * them.
 * Adapted/copied from https://code.google.com/p/polypartition/
 * @module PolyPartition
 */
var poly2tri = require('poly2tri');
var geo = require('./geometry');

var Point = geo.Point;
var Edge = geo.Edge;
var Poly = geo.Poly;

/**
 * The Point class used by poly2tri.
 * @private
 * @typedef P2TPoint
 */

/**
 * A polygon for use with poly2tri.
 * @private
 * @typedef P2TPoly
 * @type {Array.<P2TPoint>}
 */

/**
 * Convert a polygon into format required by poly2tri.
 * @private
 * @param {Poly} poly - The polygon to convert.
 * @return {P2TPoly} - The converted polygon.
 */
function convertPolyToP2TPoly(poly) {
  return poly.points.map(function(p) {
    return new poly2tri.Point(p.x, p.y);
  });
}

/**
 * Convert a polygon/triangle returned from poly2tri back into a
 * polygon.
 * @private
 * @param {P2TPoly} p2tpoly - The polygon to convert.
 * @return {Poly} - The converted polygon.
 */
function convertP2TPolyToPoly(p2tpoly) {
  var points = p2tpoly.getPoints().map(function(p) {
    return new Point(p.x, p.y);
  });

  return new Poly(points);
}

function isConvex(p1, p2, p3) {
  var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
  return (tmp > 0);
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
function separatePolys(polys, offset) {
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
  });
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
 * Partition a polygon with (optional) holes into a set of convex
 * polygons. The vertices of the polygon must be given in CW order,
 * and the vertices of the holes must be in CCW order. Uses poly2tri
 * for the initial triangulation and Hertel-Mehlhorn to combine them
 * into convex polygons.
 * @param {Poly} poly - The polygon to use as the outline.
 * @param {Array.<Poly>} [holes] - An array of holes present in the
 *   polygon.
 * @param {number} [minArea=5] - An optional parameter that filters
 *   out polygons in the partition smaller than this value.
 * @return {Array.<Poly>} - The set of polygons defining the
 *   partition of the provided polygon.
 */
module.exports = function(poly, holes, minArea) {
  if (typeof holes == 'undefined') holes = false;
  if (typeof minArea == 'undefined') minArea = 5;

  var i11, i12, i13, i21, i22, i23;
  var parts = new Array();

  // Check if poly is already convex only if there are no holes.
  if (!holes || holes.length == 0) {
    var reflex = false;
    // Check if already convex.
    for (var i = 0; i < poly.numpoints; i++) {
      var prev = poly.getPrevI(i);
      var next = poly.getNextI(i);
      if (!isConvex(poly.getPoint(prev), poly.getPoint(i), poly.getPoint(next))) {
        reflex = true;
        break;
      }
    }
    if (!reflex) {
      parts.push(poly);
      return parts;
    }
  }

  // Separate polys to remove collinear points.
  separatePolys(holes.concat(poly));

  // Convert polygon into format required by poly2tri.
  var contour = convertPolyToP2TPoly(poly);

  if (holes) {
    // Convert holes into format required by poly2tri.
    holes = holes.map(convertPolyToP2TPoly);
  }

  var swctx = new poly2tri.SweepContext(contour);
  if (holes) {
    swctx.addHoles(holes);
  }
  var triangles = swctx.triangulate().getTriangles();
  
  // Convert poly2tri triangles back into polygons and filter out the
  // ones too small to be relevant.
  triangles = triangles.map(convertP2TPolyToPoly).filter(function(poly) {
    return poly.getArea() >= minArea;
  });

  for (var s1 = 0; s1 < triangles.length; s1++) {
    var poly1 = triangles[s1];
    var s2_index = null;
    for (i11 = 0; i11 < poly1.numpoints; i11++) {
      var d1 = poly1.getPoint(i11);
      i12 = poly1.getNextI(i11);
      var d2 = poly1.getPoint(i12);

      var isdiagonal = false;
      for (var s2 = s1; s2 < triangles.length; s2++) {
        if (s1 == s2) continue;
        var poly2 = triangles[s2];
        for (i21 = 0; i21 < poly2.numpoints; i21++) {
          if (d2.neq(poly2.getPoint(i21))) continue;
          i22 = poly2.getNextI(i21);
          if (d1.neq(poly2.getPoint(i22))) continue;
          isdiagonal = true;
          object_2_index = s2;
          break;
        }
        if (isdiagonal) break;
      }

      if (!isdiagonal) continue;
      var p1, p2, p3;
      p2 = poly1.getPoint(i11);
      i13 = poly1.getPrevI(i11);
      p1 = poly1.getPoint(i13);
      i23 = poly2.getNextI(i22);
      p3 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      p2 = poly1.getPoint(i12);
      i13 = poly1.getNextI(i12);
      p3 = poly1.getPoint(i13);
      i23 = poly2.getPrevI(i21);
      p1 = poly2.getPoint(i23);

      if (!isConvex(p1, p2, p3)) continue;

      var newpoly = new Poly();
      newpoly.init(poly1.numpoints + poly2.numpoints - 2);
      var k = 0;
      for (var j = i12; j != i11; j = poly1.getNextI(j)) {
        newpoly.setPoint(k, poly1.getPoint(j));
        k++;
      }
      for (var j = i22; j != i21; j = poly2.getNextI(j)) {
        newpoly.setPoint(k, poly2.getPoint(j));
        k++;
      }

      if (s1 > object_2_index) {
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
        triangles.splice(object_2_index, 1);
      } else {
        triangles.splice(object_2_index, 1);
        triangles[s1] = newpoly;
        poly1 = triangles[s1];
      }
      i11 = -1;
    }
  }
  return triangles;
};
