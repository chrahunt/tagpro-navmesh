// Adapted/copied from https://code.google.com/p/polypartition/
// With additional help from Delaunay Triangulation Code, by Joshua Bell
/*
 * A point represents a vertex in a 2d environment.
 */
Point = function(x, y) {
  this.x = x;
  this.y = y;
}

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
function Edge(v0, v1) {
  this.v0 = v0;
  this.v1 = v1
}

Edge.prototype.equals = function(other) {
  return (this.v0 === other.v0 && this.v1 === other.v1);
}

Edge.prototype.inverse = function() {
  return new Edge(this.v1, this.v0);
}

//// POLY ////
Poly = function() {
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
}

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

// Set a point, fails silently otherwise. Maybe replace with bracket
// notation somehow?
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

// Subdivides edges to keep length between consecutive vertices below
// threshold. The division takes place at equal intervals in a given
// edge such that the resulting line segments are below the threshold.
Poly.prototype.subdivide = function(threshold) {
  var newpoints = new Array();
  var start, end, dist, npoints, dx, dy;
  for (var i = 0; i < this.numpoints; i++) {
    start = this.points[i];
    end = this.points[this.getNextI(i)];
    dist = start.dist(end);
    newpoints.push(start);
    if (dist > threshold) {
      npoints = Math.ceil(dist / threshold);
      dx = (end.x - start.x) / npoints;
      dy = (end.y - start.y) / npoints;
      for (var j = 1; j < npoints; j++) {
        newpoints.push(new Point(start.x + (j * dx), start.y + (j * dy)));
      }
    }
  }
  this.points = newpoints;
  this.numpoints = this.points.length;
}

// Only works on triangles, sets the center, radius, and radius_squared
// of the circumcircle corresponding to a polygon.
Poly.prototype.calcCircumcircle = function() {
  if (this.numpoints != 3) return;
  var v0 = this.points[0];
  var v1 = this.points[1];
  var v2 = this.points[2];
  var A = v1.x - v0.x;
  var B = v1.y - v0.y;
  var C = v2.x - v0.x;
  var D = v2.y - v0.y;

  var E = A * (v0.x + v1.x) + B * (v0.y + v1.y);
  var F = C * (v0.x + v2.x) + D * (v0.y + v2.y);

  var G = 2.0 * (A * (v2.y - v1.y) - B * (v2.x - v1.x));

  var dx, dy;

  if (Math.abs(G) < EPSILON) {
    // Collinear - find extremes and use the midpoint

    var minx = Math.min(v0.x, v1.x, v2.x);
    var miny = Math.min(v0.y, v1.y, v2.y);
    var maxx = Math.max(v0.x, v1.x, v2.x);
    var maxy = Math.max(v0.y, v1.y, v2.y);

    this.center = new Point((minx + maxx) / 2, (miny + maxy) / 2);

    dx = this.center.x - minx;
    dy = this.center.y - miny;
  } else {
    var cx = (D * E - B * F) / G;
    var cy = (A * F - C * E) / G;

    this.center = new Point(cx, cy);

    dx = this.center.x - v0.x;
    dy = this.center.y - v0.y;
  }

  this.radius_squared = dx * dx + dy * dy;
  this.radius = Math.sqrt(this.radius_squared);
}

// Returns true if a point is within this triangle's circumcircle.
Poly.prototype.inCircumcircle = function(p) {
  var dx = this.center.x - p.x;
  var dy = this.center.y - p.y;
  var dist_squared = dx * dx + dy * dy;

  return (dist_squared <= this.radius_squared);
}

// Print list of points. csep is coordinate separator, psep is point
// separator, default is space and newline, respectively.
Poly.prototype.toString = function(csep, psep) {
  csep = csep || ' ';
  psep = psep || '\n';
  var out = "";
  this.points.forEach(function(p) {
    out = out + p.x + csep + p.y + psep;
  });
  return out;
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
var EPSILON = 1.0e-6;
Partition = function() {
  this.drawCallback = null;
};

Partition.prototype.isConvex = function(p1, p2, p3) {
  var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
  return (tmp > 0);
}

Partition.prototype.isReflex = function(p1, p2, p3) {
  return !this.isConvex(p1, p2, p3);
}

Partition.prototype.isInside = function(p1, p2, p3, p) {
  if (this.isConvex(p1, p, p2)) return false;
  if (this.isConvex(p2, p, p3)) return false;
  if (this.isConvex(p3, p, p1)) return false;
  return true;
}

Partition.prototype.inCone = function(p1, p2, p3, p) {
  var convex = this.isConvex(p1, p2, p3);

  if (convex) {
    if (!this.isConvex(p1, p2, p)) return false;
    if (!this.isConvex(p2, p3, p)) return false;
    return true;
  } else {
    if (this.isConvex(p1, p2, p)) return true;
    if (this.isConvex(p2, p3, p)) return true;
    return false;
  }
}

Partition.prototype.normalize = function(p) {
  var n = Math.sqrt(p.dot(p));
  if (n !== 0)
    return p.div(n);
  else
    return new Point(0, 0);
}

Partition.prototype.intersects = function(p11, p12, p21, p22) {
  if (p11.eq(p21)) return false;
  if (p11.eq(p22)) return false;
  if (p12.eq(p21)) return false;
  if (p12.eq(p22)) return false;

  var v1ort = new Point();
  var v2ort = new Point();
  v1ort.x = p12.y - p11.y;
  v1ort.y = p11.x - p12.x;

  v2ort.x = p22.y - p21.y;
  v2ort.y = p21.x - p22.x;

  var dot21 = p21.sub(p11).dot(v1ort);
  var dot22 = p22.sub(p11).dot(v1ort);
  var dot11 = p11.sub(p21).dot(v2ort);
  var dot12 = p12.sub(p21).dot(v2ort);

  if (dot11 * dot12 > 0) return false;
  if (dot21 * dot22 > 0) return false;

  return true;
}

Partition.prototype.updateVertex = function(v, vertices, numvertices) {
  var v1 = v.prev;
  var v3 = v.next;

  v.convex = this.isConvex(v1.p, v.p, v3.p);
  var vec1 = this.normalize(v1.p.sub(v.p));
  var vec3 = this.normalize(v3.p.sub(v.p));
  v.angle = vec1.dot(vec3);

  if (v.convex) {
    v.ear = true;
    for (var i = 0; i < numvertices; i++) {
      if (vertices[i].p.eq(v1.p)) continue;
      if (vertices[i].p.eq(v.p)) continue;
      if (vertices[i].p.eq(v3.p)) continue;
      if (this.isInside(v1.p, v.p, v3.p, vertices[i].p)) {
        v.ear = false;
        break;
      }
    }
  } else {
    v.ear = false;
  }
}

// Triangulate using ear clipping.
Partition.prototype.triangulate = function(poly) {
  var triangles = new Array();
  var numvertices = poly.numpoints;
  if (numvertices < 3)
    return null;
  if (numvertices == 3) {
    triangles.push(poly);
    return triangles;
  }

  var vertices = new Array(numvertices);
  for (var i = 0; i < numvertices; i++) {
    vertices[i] = new PVertex();
  }
  for (var i = 0; i < numvertices; i++) {
    vertices[i].active = true;
    vertices[i].p = poly.getPoint(i);
    vertices[i].next = vertices[poly.getNextI(i)];
    vertices[i].prev = vertices[poly.getPrevI(i)];
  }
  for (var i = 0; i < numvertices; i++) {
    this.updateVertex(vertices[i], vertices, numvertices);
  }

  var ear = null;
  for (var i = 0; i < numvertices - 3; i++) {
    var earfound = false;
    for (var j = 0; j < numvertices; j++) {
      if (!vertices[j].active) continue;
      if (!vertices[j].ear) continue;
      if (!earfound) {
        earfound = true;
        ear = vertices[j];
      } else {
        if (vertices[j].angle > ear.angle) {
          ear = vertices[j];
        }
      }
    }
    if (!earfound) return null;

    var triangle = new Poly();
    triangle.triangle(ear.prev.p, ear.p, ear.next.p);
    triangles.push(triangle);

    ear.active = false;
    if (ear.prev.next.p.neq(ear.p)) {
      console.log("Uh oh on prev!");
    }
    if (ear.next.prev.p.neq(ear.p)) {
      console.log("Uh oh on next!");
    }
    ear.prev.next = ear.next;
    ear.next.prev = ear.prev;

    if (i == numvertices - 4) break;

    this.updateVertex(ear.prev, vertices, numvertices);
    this.updateVertex(ear.next, vertices, numvertices);
  }

  for (var i = 0; i < numvertices; i++) {
    if (vertices[i].active) {
      var triangle = new Poly();
      triangle.triangle(vertices[i].prev.p, vertices[i].p, vertices[i].next.p);
      triangles.push(triangle);
    }
  }

  return triangles;
}

Partition.prototype.createBoundingTriangle = function(poly) {
  var minx, miny, maxx, maxy;
  poly.points.forEach(function(vertex) {
    if (minx === undefined || vertex.x < minx) { minx = vertex.x; }
    if (miny === undefined || vertex.y < miny) { miny = vertex.y; }
    if (maxx === undefined || vertex.x > maxx) { maxx = vertex.x; }
    if (maxy === undefined || vertex.y > maxy) { maxy = vertex.y; }
  });

  var dx = (maxx - minx) * 10;
  var dy = (maxy - miny) * 10;

  var stv0 = new Point(minx - dx, miny - dy * 3);
  var stv1 = new Point(minx - dx, maxy + dy);
  var stv2 = new Point(maxx + dx * 3, maxy + dy);
  var poly = new Poly();
  poly.triangle(stv0, stv1, stv2);

  return poly;
}

Partition.prototype.uniqueEdges = function(edges) {
  var uniqueEdges = [];
  for (var i = 0; i < edges.length; ++i) {
    var edge1 = edges[i];
    var unique = true;

    for (var j = 0; j < edges.length; ++j) {
      if (i === j)
        continue;
      var edge2 = edges[j];
      if (edge1.equals(edge2) || edge1.inverse().equals(edge2)) {
        unique = false;
        break;
      }
    }

    if (unique)
      uniqueEdges.push(edge1);
  }

  return uniqueEdges;
}

Partition.prototype.addVertex = function(vertex, triangles) {
  var edges = [];

  // Remove triangles with circumcircles containing the vertex

  triangles = triangles.filter(function(triangle) {
    if (triangle.inCircumcircle(vertex)) {
      edges.push(new Edge(triangle.points[0], triangle.points[1]));
      edges.push(new Edge(triangle.points[1], triangle.points[2]));
      edges.push(new Edge(triangle.points[2], triangle.points[0]));
      return false;
    }

    return true;
  });

  edges = this.uniqueEdges(edges);

  // Create new triangles from the unique edges and new vertex
  edges.forEach(function(edge) {
    var poly = new Poly();
    poly.triangle(edge.v0, edge.v1, vertex);
    triangles.push(poly);
  });

  return triangles;
}

// Triangulate using Delaunay triangulation.
Partition.prototype.triangulate_del = function(poly) {
  var triangles = new Array();

  var st = this.createBoundingTriangle(poly);

  triangles.push(st);

  poly.points.forEach(function(vertex) {
    triangles = this.addVertex(vertex, triangles);
  }, this);
  triangles = triangles.filter(function(triangle) {
    return !(triangle.points[0].eq(st.points[0]) || triangle.points[0].eq(st.points[1]) || triangle.points[0].eq(st.points[2]) ||
      triangle.points[1].eq(st.points[0]) || triangle.points[1].eq(st.points[1]) || triangle.points[1].eq(st.points[2]) ||
      triangle.points[2].eq(st.points[0]) || triangle.points[2].eq(st.points[1]) || triangle.points[2].eq(st.points[2]));
  });

  return triangles;
}

// Using Hertel-Mehlhorn
Partition.prototype.convexPartition = function(poly) {
  var i11, i12, i13, i21, i22, i23;
  var parts = new Array();

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

  var triangles = this.triangulate_del(poly);
  console.log(triangles.length + " triangles generated!");

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
  return triangles;
}


Partition.prototype.removeHoles = function(polys) {
  var hasholes = false;
  var resultpolys = new Array();

  // Check for trivial case.
  for (var s = 0; s < polys.length; s++) {
    if (polys[s].hole) {
      hasholes = true;
      break;
    }
  }
  if (!hasholes) {
    for (var s = 0; s < polys.length; s++) {
      resultpolys.push(polys[s]);
    }
    return resultpolys;
  }

  while(true) {
    hasholes = false;
    for (var s = 0; s < polys.length; s++) {
      var poly1 = polys[s];
      if (!poly1.hole) continue;

      if (!hasholes) {
        hasholes = true;
        var holepoly = poly1;
        var holepolyindex = s;
        var holepointindex = 0;
      }

      // Get the point with greatest x value.
      for (var i = 0; i < poly1.numpoints; i++) {
        if (poly1.getPoint(i).x > holepoly.getPoint(holepointindex).x) {
          holepoly = poly1;
          holepolyindex = s;
          holepointindex = i;
        }
      }
    }
    if (!hasholes) break;
    var holepoint = holepoly.getPoint(holepointindex);

    var pointfound = false;
    var bestpolypoint;
    for (var s1 = 0; s1 < polys.length; s1++) {
      poly = polys[s1];
      if (poly.hole) continue;
      for (var i = 0; i < poly.numpoints; i++) {
        if (poly.getPoint(i).x <= holepoint.x) continue;
        var prev = poly.getPrevI(i);
        var next = poly.getNextI(i);
        if (!this.inCone(poly.getPoint(prev), poly.getPoint(i), poly.getPoint(next), holepoint))
          continue;
        var polypoint = poly.getPoint(i);
        if (pointfound) {
          var v1 = this.normalize(polypoint.sub(holepoint));
          var v2 = this.normalize(bestpolypoint.sub(holepoint));
          if (v2.x > v1.x) continue;
        }
        var pointvisible = true;
        for (var s2 = 0; s2 < polys.length; s2++) {
          var poly2 = polys[s2];
          if (poly2.hole) continue;
          for (var i2 = 0; i2 < poly2.numpoints; i2++) {
            var linep1 = poly2.getPoint(i2);
            var linep2 = poly2.getPoint(poly2.getNextI(i2));
            if (this.intersects(holepoint, polypoint, linep1, linep2)) {
              pointvisible = false;
              break;
            }
          }
          if (!pointvisible) break;
        }
        if (pointvisible) {
          pointfound = true;
          bestpolypoint = polypoint;
          var polypoly = poly;
          var polypolyindex = s1;
          var polypointindex = i;
        }
      }
    }

    if (!pointfound) return 0;

    var newpoly = new Poly();
    newpoly.init(holepoly.numpoints + polypoly.numpoints + 2);

    var k = 0;
    for (var i = 0; i <= polypointindex; i++) {
      newpoly.setPoint(k, polypoly.getPoint(i));
      k++;
    }
    for (var i = 0; i <= holepoly.numpoints; i++) {
      newpoly.setPoint(k, holepoly.getPoint((i + holepointindex) % holepoly.numpoints));
      k++;
    }
    for (var i = polypointindex; i < polypoly.numpoints; i++) {
      newpoly.setPoint(k, polypoly.getPoint(i));
      k++;
    }

    if (holepolyindex > polypolyindex) {
      polys.splice(holepolyindex, 1);
      polys.splice(polypolyindex, 1);
    } else {
      polys.splice(polypolyindex, 1);
      polys.splice(holepolyindex, 1);
    }
    polys.push(newpoly);
  }

  return polys;
}
