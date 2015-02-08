requirejs.config({
  map: {
    '*': {
      'bragi': '../common/bragi-browser',
      'tile-grids': '../common/tile-grids',
      'navmesh': '../../build/navmesh.min',
      'drawutils': '../common/drawutils'
    }
  },
  baseUrl: '.'
});

require(['navmesh', 'tile-grids', 'drawutils', 'bragi'],
function( NavMesh,   TileGrids,    DrawUtils,   Logger) {
  

  // Takes an event and returns the location clicked within the canvas
  // element.
  function getCanvasPointClicked(e, canvas) {
    var rect = canvas.getBoundingClientRect();
    return new Point(e.clientX - rect.left, e.clientY - rect.top);
  }

  function forceRedraw() {
    document.getElementById('redraw').style.display = 'none';
    document.getElementById('redraw').style.display = 'block';
  }

  function getPathAndDrawUpdate(start, end) {
    var c2d = canvas.getContext('2d');
    c2d.clearRect(0, 0, c2d.canvas.width, c2d.canvas.height);
    DrawUtils.drawOutline(parts, canvas);

    navmesh.calculatePath(startPoint, endPoint, function(path) {
      if (path) {
        DrawUtils.drawPoly(PolyUtils.findPolyForPoint(endPoint, navmesh.polys), canvas, 'red');
        DrawUtils.drawPoly(PolyUtils.findPolyForPoint(startPoint, navmesh.polys), canvas, 'pink');
        path.unshift(startPoint);
        DrawUtils.drawPath(path, canvas);
      } else {
        Logger.log("script", "Path not found!");
      }
      forceRedraw();
    });
  }

  var tiles = TileGrids["Hurricane2"];

  // Convert and generate navmesh.
  var navmesh = new NavMesh(tiles, Logger);
  var Point = NavMesh.geom.Point;
  var Poly = NavMesh.geom.Poly;
  var PolyUtils = NavMesh.geom.PolyUtils;

  var canvas = document.getElementById('c');
  DrawUtils.initCanvasForTiles(canvas, tiles);

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
