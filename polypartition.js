// Adapted/copied from https://code.google.com/p/polypartition/
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

Poly = function() {
  this.hole = false;
  this.points = null;
  this.numpoints = 0;
}

Poly.prototype.init = function(n) {
  this.points = new Array(n);
  this.numpoints = n;
}

Poly.prototype.triangle = function(p1, p2, p3) {
  this.init(3);
  this.points[0] = p1;
  this.points[1] = p2;
  this.points[2] = p3;
}

// Takes an index and returns the point at that index, or null.
Poly.prototype.getPoint = function(n) {
  if (this.points && this.points.length > n)
    return this.points[n];
  return null;
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

PVertex = function() {
  this.active = false;
  this.convex = false;
  this.ear = false;
  this.next = null;
  this.prev = null;
  this.angle = 0;
  this.p = null;
};

Partition = function() {};

Partition.prototype.isConvex = function(p1, p2, p3) {
  var tmp = (p3.y - p1.y) * (p2.x - p1.x) - (p3.x - p1.x) * (p2.y - p1.y);
  return (tmp > 0);
}

Partition.prototype.isInside = function(p1, p2, p3, p) {
  if (this.isConvex(p1, p, p2)) return false;
  if (this.isConvex(p2, p, p3)) return false;
  if (this.isConvex(p3, p, p1)) return false;
  return true;
}

Partition.prototype.normalize = function(p) {
  var n = Math.sqrt(p.x * p.x + p.y * p.y);
  if (n !== 0)
    return p.div(n);
  else
    return new Point(0, 0);
}

Partition.prototype.updateVertex = function(v, vertices, numvertices) {
  var v1 = v.prev;
  var v2 = v.next;

  v.convex = this.isConvex(v1.p, v.p, v2.p);
  var vec1 = this.normalize(v1.p - v.p);
  var vec3 = this.normalize(v3.p - v.p);
  v.angle = vec1.x * vec3.x + vec1.y * vec3.y;

  if (v.convex) {
    v.ear = true;
    for (var i = 0; i < numvertices; i++) {
      if (vertices[i].p.eq(v)) continue;
      if (vertices[i].p.eq(v1)) continue;
      if (vertices[i].p.eq(v3)) continue;
      if (this.isInside(v1.p, v.p, v3.p, vertices[i].p)) {
        v.ear = false;
        break;
      }
    }
  } else {
    v.ear = false;
  }
}

Partition.prototype.triangulate = function(poly) {
  var triangles = new Array();
  var numvertices = poly.numpoints;
  if (numvertices < 3)
    return null;
  if (numvertices == 3) {
    triangles.push(poly);
    return triangles;
  }

  var vertices = (new Array(numvertices)).map(function() {
    return new PVertex();
  });

  for (var i = 0; i < numvertices; i++) {
    vertices[i].active = true;
    vertices[i].p = poly.getPoint(i);
    vertices[i].next = vertices[poly.getNextI(i)];
    vertices[i].prev = vertices[poly.getPrevI(i)];
  }
  vertices.forEach(function(e) {
    this.updateVertex(e, vertices, numvertices);
  });

  var ear = null;
  var earfound = false;
  for (var i = 0; i < numvertices - 3; i++) {
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
