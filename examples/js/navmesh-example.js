requirejs.config({
  shim: {
    'lib/clipper': {
      exports: 'ClipperLib'
    }
  },
  map: {
    '*': {
      'bragi': 'examples/js/lib/bragi-browser'
    }
  },
  baseUrl: '..',
  config: {
    requirejsUrl: 'examples/js/lib/require.js'
  }
});

require(['navmesh', 'parse-map', 'polypartition', 'examples/js/tile-grids'],
function( NavMesh,   mapParser,   pp,              tile_grids) {
  Point = pp.Point;
  Poly = pp.Poly;
  Partition = pp.Partition;
  PolyUtils = pp.PolyUtils;

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
        drawPoly(shapes[i], canvas);
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

  function getPathAndDrawUpdate(start, end) {
    var c2d = canvas.getContext('2d');
    c2d.clearRect(0, 0, c2d.canvas.width, c2d.canvas.height);
    drawOutline(parts, canvas);

    navmesh.calculatePath(startPoint, endPoint, function(path) {
      drawPoly(PolyUtils.findPolyForPoint(endPoint, navmesh.polys), canvas, 'red');
      drawPoly(PolyUtils.findPolyForPoint(startPoint, navmesh.polys), canvas, 'pink');
      path.unshift(startPoint);
      drawPath(path, canvas);
    });
  }

  var tiles = tile_grids["Hurricane2"];

  // Convert and generate navmesh.
  var navmesh = new NavMesh(tiles);
  var canvas = initCanvasForTiles(tiles);

  // Get shapes defining navmesh
  var parts = navmesh.polys;

  // Add original walls and obstacles to shapes for display.
  Array.prototype.push.apply(parts, navmesh.parsedMap.walls);
  Array.prototype.push.apply(parts, navmesh.parsedMap.obstacles);

  // Initialize canvas.

  // Set random start and end for pathfinding demo.
  if (parts.length > 0) {
    var startIndex = Math.floor(Math.random() * parts.length);
    var endIndex = Math.floor(Math.random() * parts.length);
    var startPoint = parts[startIndex].centroid();
    var endPoint = parts[endIndex].centroid();
  }

  getPathAndDrawUpdate(startPoint, endPoint);

  // Draw outline around clicked element, calling back to navmesh function.
  document.getElementById('c').addEventListener('click', function(evt) {
    var p = getCanvasPointClicked(evt, this);
    var shift = evt.shiftKey;
    var poly = PolyUtils.findPolyForPoint(p, navmesh.polys);
    if (poly) {
      if (shift) {
        endPoint = p;
      } else {
        startPoint = p;
      }
      getPathAndDrawUpdate(startPoint, endPoint);
    }
  }, false);
});
