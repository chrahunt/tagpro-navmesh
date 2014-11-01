// Drawing functions.
// Takes in an array of x, y objects
function drawShape(shapeInfo, canvas) {
  canvas.beginPath();
  var start = shapeInfo.shift();
  canvas.moveTo(start.x, start.y);
  for (var i = 0; i < shapeInfo.length; i++) {
    canvas.lineTo(shapeInfo[i].x, shapeInfo[i].y);
  }
  canvas.lineTo(start.x, start.y);
  canvas.lineWidth = 1;
  canvas.strokeStyle = 'black';
  canvas.stroke();
  canvas.closePath();
}

// Takes in a polygon
function drawPoly(poly, canvas, color) {
  if (typeof color == 'undefined') color = 'black';
  canvas.beginPath();
  var start = poly.getPoint(0);
  canvas.moveTo(start.x, start.y);
  for (var i = 1; i < poly.numpoints; i++) {
    canvas.lineTo(poly.getPoint(i).x, poly.getPoint(i).y);
  }
  canvas.lineTo(start.x, start.y);
  canvas.lineWidth = 1;
  canvas.strokeStyle = color;
  canvas.stroke();
  canvas.closePath();
}

function initCanvas() {
  var c = document.getElementById('c');
  c.width = tiles.length * 40;
  c.height = tiles[0].length * 40;
  var c2 = c.getContext('2d');
  c2.fillStyle = '#d00';
  return c2;
}

// Draw outlines on canvas.
function drawOutline(shapes, c2) {
  for (var i = 0; i < shapes.length; i++) {
    if (shapes[i] instanceof Poly) {
      drawPoly(shapes[i], c2);
    } else {
      drawShape(shapes[i], c2);
    }
  }
}

// Takes an event and returns the location clicked within the canvas
// element.
function getCanvasPointClicked(e, canvas) {
  var rect = canvas.getBoundingClientRect();
  return new Point(e.clientX - rect.left, e.clientY - rect.top);
}

var tiles = tile_grids["SNESv2"];
// Get outline of walls in map.
var shapeArrays = mapParser.parse(tiles);
var c2d = initCanvas();

var polys = mapParser.convertShapesToPolys(shapeArrays);
var navmesh = new NavMesh();
navmesh.init(polys);
var parts = navmesh.polys;

drawOutline(parts, c2d);

// Draw outline around clicked element, calling back to navmesh function.
document.getElementById('c').addEventListener('click', function(evt){
  var p = getCanvasPointClicked(evt, this);
  var poly = navmesh.findPolyForPoint(p);
  if (poly) {
    c2d.clearRect(0, 0, c2d.canvas.width, c2d.canvas.height);
    drawOutline(parts, c2d);
    drawPoly(poly, c2d, 'red');
  }
}, false);
