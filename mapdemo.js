require(['parse-map', 'polypartition', 'tile-grids'],
function( MapParser,   pp,              tile_grids) {
  Point = pp.Point;
  Poly = pp.Poly;
  Partition = pp.Partition;
  // Drawing functions.
  // Takes in an array of x, y objects
  function drawShape(shapeInfo, canvas) {
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = shapeInfo.shift();
    context.moveTo(start.x, start.y);
    for (var i = 0; i < shapeInfo.length; i++) {
      context.lineTo(shapeInfo[i].x, shapeInfo[i].y);
    }
    context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
  }

  function drawPoint(point, canvas) {
    var context = canvas.getContext('2d');
    var radius = 5;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  function drawPath(pathInfo, canvas) {
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = pathInfo.shift();
    context.moveTo(start.x, start.y);
    for (var i = 0; i < pathInfo.length; i++) {
      context.lineTo(pathInfo[i].x, pathInfo[i].y);
    }
    //context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = 'blue';
    context.stroke();
    context.closePath();
    pathInfo.forEach(function(p) {
      drawPoint(p, canvas);
    });
  }

  // Takes in a polygon, canvas element, and [optional] color string.
  function drawPoly(poly, canvas, color) {
    if (typeof color == 'undefined') color = 'black';
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = poly.getPoint(0);
    context.moveTo(start.x, start.y);
    for (var i = 1; i < poly.numpoints; i++) {
      context.lineTo(poly.getPoint(i).x, poly.getPoint(i).y);
    }
    context.lineTo(start.x, start.y);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }

  function initCanvasForTiles(tiles) {
    var c = document.getElementById('c');
    c.width = tiles.length * 40;
    c.height = tiles[0].length * 40;
    var c2 = c.getContext('2d');
    c2.fillStyle = '#dd0';
    return c;
  }

  // Draw outlines on canvas.
  function drawOutline(shapes, canvas) {
    for (var i = 0; i < shapes.length; i++) {
      if (shapes[i] instanceof Poly) {
        if (shapes[i].getOrientation() == "CCW") {
          drawPoly(shapes[i], canvas, 'green');
        } else {
          drawPoly(shapes[i], canvas, 'red');
        }
      } else {
        drawShape(shapes[i], canvas);
      }
    }
  }

  // Takes an event and returns the location clicked within the canvas
  // element.
  function getCanvasPointClicked(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    return new Point(e.clientX - rect.left, e.clientY - rect.top);
  }

  var tiles = tile_grids["Volt"];
  // Get outline of walls in map.
  var parsed_map = MapParser.parse(tiles);
  
  var polys = parsed_map.walls.concat(parsed_map.obstacles);
  // Initialize canvas.
  var canvas = initCanvasForTiles(tiles);

  drawOutline(polys, canvas);
});
