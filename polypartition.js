define(["./poly2tri"],
function(poly2tri) {
  // Adapted/copied from https://code.google.com/p/polypartition/
  var exports = {};
  /*
   * A point represents a vertex in a 2d environment.
   */
  Point = function(x, y) {
    this.x = x;
    this.y = y;
  }
  exports.Point = Point;

  Point.prototype.add = function(p) {
    return new Point(this.x + p.x, this.y + p.y);
  }

  Point.prototype.sub = function(p) {
    return new Point(this.x - p.x, this.y - p.y);
  }

  Point.prototype.mul = function(f) {
    return new Point(this.x * f, this.y * f);
  }

  Point.prototype.div = function(f) {
    return new Point(this.x / f, this.y / f);
  }

  Point.prototype.eq = function(p) {
    return (this.x == p.x && this.y == p.y);
  }

  Point.prototype.neq = function(p) {
    return (this.x != p.x || this.y != p.y);
  }

  // Given another point, returns the dot product.
  Point.prototype.dot = function(p) {
    return (this.x * p.x + this.y * p.y);
  }

  // Given another point, returns the 'cross product', or at least the 2d
  // equivalent.
  Point.prototype.cross = function(p) {
    return (this.x * p.y - this.y * p.x);
  }

  // Given another point, returns the distance to that point.
  Point.prototype.dist = function(p) {
    var diff = this.sub(p);
    return Math.sqrt(diff.dot(diff))
  }

  Point.prototype.normalize = function() {
    var n = this.dist(new Point(0, 0));
    if (n > 0) return this.div(n);
    return new Point(0, 0);
  }

  Point.prototype.toString = function() {
    return 'x' + this.x + 'y' + this.y;
  }

  //// EDGE ////
  // Edges are used to represent the border between two adjacent
  // polygons.
  Edge = function(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.center = p1.add(p2.sub(p1).div(2));
    this.points = [this.p1, this.center, this.p2];
  }
  exports.Edge = Edge;

  Edge.prototype._CCW = function(p1, p2, p3) {
    a = p1.x; b = p1.y;
    c = p2.x; d = p2.y;
    e = p3.x; f = p3.y;
    return (f - b) * (c - a) > (d - b) * (e - a);
  }

  // from http://stackoverflow.com/a/16725715
  Edge.prototype.intersects = function(edge) {
    var q1 = edge.p1, q2 = edge.p2;
    if (q1.eq(this.p1) || q1.eq(this.p2) || q2.eq(this.p1) || q2.eq(this.p2)) return false;
    return (this._CCW(this.p1, q1, q2) != this._CCW(this.p2, q1, q2)) && (this._CCW(this.p1, this.p2, q1) != this._CCW(this.p1, this.p2, q2));
  }


  //// POLY ////
  Poly = function() {
    this.hole = false;
    this.points = null;
    this.numpoints = 0;
  }
  exports.Poly = Poly;

  Poly.prototype.init = function(n) {
    this.points = new Array(n);
    this.numpoints = n;
  }

  Poly.prototype.update = function() {
    this.numpoints = this.points.length;
  }

  Poly.prototype.triangle = function(p1, p2, p3) {
    this.init(3);
    this.points[0] = p1;
    this.points[1] = p2;
    this.points[2] = p3;
    this.calcCircumcircle();
  }

  // Takes an index and returns the point at that index, or null.
  Poly.prototype.getPoint = function(n) {
    if (this.points && this.numpoints > n)
      return this.points[n];
    return null;
  }

  // Set a point, fails silently otherwise. TODO: replace with bracket notation.
  Poly.prototype.setPoint = function(i, p) {
    if (this.points && this.points.length > i) {
      this.points[i] = p;
    }
  }

  // Given an index i, return the index of the next point.
  Poly.prototype.getNextI = function(i) {
    return (i + 1) % this.numpoints;
  }

  Poly.prototype.getPrevI = function(i) {
    if (i == 0)
      return (this.numpoints - 1);
    return i - 1;
  }

  // Returns the signed area of a polygon, if the vertices are given in
  // CCW order then the area will be > 0, < 0 otherwise.
  Poly.prototype.getArea = function() {
    var area = 0;
    for (var i = 0; i < this.numpoints; i++) {
      var i2 = this.getNextI(i);
      area += this.points[i].x * this.points[i2].y - this.points[i].y * this.points[i2].x;
    }
    return area;
  }

  Poly.prototype.getOrientation = function() {
    var area = this.getArea();
    if (area > 0) return "CCW";
    if (area < 0) return "CW";
    return 0;
  }

  Poly.prototype.setOrientation = function(orientation) {
    var current_orientation = this.getOrientation();
    if (current_orientation && (current_orientation !== orientation)) {
      this.invert();
    }
  }

  Poly.prototype.invert = function() {
    var newpoints = new Array(this.numpoints);
    for (var i = 0; i < this.numpoints; i++) {
      newpoints[i] = this.points[this.numpoints - i - 1];
    }
    this.points = newpoints;
  }

  Poly.prototype.getCenter = function() {
    var x = this.points.map(function(p) { return p.x });
    var y = this.points.map(function(p) { return p.y });
    var minX = Math.min.apply(null, x);
    var maxX = Math.max.apply(null, x);
    var minY = Math.min.apply(null, y);
    var maxY = Math.max.apply(null, y);
    return new Point((minX + maxX)/2, (minY + maxY)/2);
  }

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
  }

  // Print list of points. csep is coordinate separator, psep is point
  // separator, default is space and newline, respectively.
  Poly.prototype.toPointString = function(csep, psep) {
    csep = csep || ' ';
    psep = psep || '\n';
    var out = "";
    this.points.forEach(function(p) {
      out = out + p.x + csep + p.y + psep;
    });
    return out;
  }

  Poly.prototype.toString = function() {
    var center = this.centroid();
    return "" + center.x + " " + center.y;
  }

  // Adapted from http://stackoverflow.com/a/8721483
  Poly.prototype.containsPoint3 = function(p) {
    var result = false;
    for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
      var p1 = this.points[j], p2 = this.points[i];
      if ((p2.y > p.y) != (p1.y > p.y) &&
          (p.x < (p1.x - p2.x) * (p.y - p2.y) / (p1.y - p2.y) + p2.x)) {
        result = !result;
      }
    }
    return result;
  }

  Poly.prototype.containsPoint2 = function(p) {
    for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
      var p1 = this.points[j], p2 = this.points[i];
      if (PolyUtils.isConvex(p1, p, p2)) return false;
    }
    return true;
  }

  // Only works when the polygon is convex.
  // Adapted from http://stackoverflow.com/a/1119673
  Poly.prototype.containsPoint = function(p) {
    var previous_side = "none";
    var i, p1, p2, affine_segment, affine_point, prod, current_side;
    for (var i = 0, j = this.numpoints - 1; i < this.numpoints; j = i++) {
      p1 = this.points[j], p2 = this.points[i];
      affine_segment = p2.sub(p1);
      affine_point = p.sub(p1);
      // Get side of point relative to segment.
      prod = affine_segment.cross(affine_point);
      if (prod < 0) current_side = "left";
      else if (prod > 0) current_side = "right";
      else current_side = "none";

      // Actions based on results.
      if (current_side == "none") return false;
      else if (previous_side == "none") previous_side = current_side;
      else if (previous_side !== current_side) return false;
    }
    return true;
  }

  PVertex = function() {
    this.active = false;
    this.convex = false;
    this.ear = false;
    this.next = null;
    this.prev = null;
    this.angle = 0;
    this.p = null;
  };

  //// PARTITION ////
  Partition = function() {
    this.drawCallback = null;
  };
  exports.Partition = Partition;

  Partition.prototype.isConvex = function(p1, p2, p3) {
    var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
    return (tmp > 0);
  }

  Partition.prototype.isReflex = function(p1, p2, p3) {
    return !this.isConvex(p1, p2, p3);
  }

  Partition.prototype.normalize = function(p) {
    var n = Math.sqrt(p.dot(p));
    if (n !== 0)
      return p.div(n);
    else
      return new Point(0, 0);
  }

  Partition.prototype.convertTrianglesToPolys = function(triangles) {
    var polys = triangles.map(function(triangle) {
      var poly = new Poly();
      poly.init(3);
      triangle.getPoints().forEach(function(p, i) {
        poly.setPoint(i, new Point(p.x, p.y));
      });
      return poly;
    });
    return polys;
  }

  // Using Hertel-Mehlhorn
  // Takes a polygon outline and an array of polygons defining holes.
  // Poly vertices must be in CW order, holes in CCW order. This can be
  // done using setOrientation.
  Partition.prototype.convexPartition = function(poly, holes) {
    var i11, i12, i13, i21, i22, i23;
    var parts = new Array();

    // Check if poly is convex only if there are no holes.
    if (!holes) {
      var reflex = false;
      // Check if already convex.
      for (var i = 0; i < poly.numpoints; i++) {
        var prev = poly.getPrevI(i);
        var next = poly.getNextI(i);
        if (this.isReflex(poly.getPoint(prev), poly.getPoint(i), poly.getPoint(next))) {
          reflex = true;
          break;
        }
      }
      if (!reflex) {
        parts.push(poly);
        return parts;
      }
    }

    // Turn holes into arrays of poly2tri Points.
    holes = holes.map(function(poly) {
      return poly.points.map(function(p) {
        return new poly2tri.Point(p.x, p.y);
      });
    });

    // Do the same for the outline.
    var contour = poly.points.map(function(p) {
      return new poly2tri.Point(p.x, p.y);
    });

    var swctx = new poly2tri.SweepContext(contour);
    var triangles = swctx.addHoles(holes).triangulate().getTriangles();
    
    // Convert poly2tri triangles back into polygons and filter out the small ones.
    triangles = this.convertTrianglesToPolys(triangles).filter(function(poly) {
      return poly.getArea() > 5;
    });

    console.log("Triangles generated: " + triangles.length);

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

        if (!this.isConvex(p1, p2, p3)) continue;

        p2 = poly1.getPoint(i12);
        i13 = poly1.getNextI(i12);
        p3 = poly1.getPoint(i13);
        i23 = poly2.getPrevI(i21);
        p1 = poly2.getPoint(i23);

        if (!this.isConvex(p1, p2, p3)) continue;

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
    console.log("Resulting number of polygons: " + triangles.length);
    return triangles;
  }

  var PolyUtils = {};

  PolyUtils.isConvex = function(p1, p2, p3) {
    var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
    return (tmp > 0);
  }

  return exports;
});

