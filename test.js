var contour = [
    new poly2tri.Point(100, 100),
    new poly2tri.Point(100, 300),
    new poly2tri.Point(300, 300),
    new poly2tri.Point(300, 100)
];
var swctx = new poly2tri.SweepContext(contour);

var hole = [
    new poly2tri.Point(200, 200),
    new poly2tri.Point(200, 250),
    new poly2tri.Point(250, 250)
];
swctx.addHole(hole);
// or swctx.addHoles([hole1, hole2]) for multiple holes

swctx.triangulate();
var triangles = swctx.getTriangles();

triangles.forEach(function(t) {
    t.getPoints().forEach(function(p) {
        console.log(p.x, p.y);
    });
    // or t.getPoint(0), t.getPoint(1), t.getPoint(2)
});
