requirejs.config({
  map: {
    '*': {
      'tile-grids': '../common/tile-grids',
      'drawutils': '../common/drawutils',
      'navmesh': '../../build/navmesh',
      'parse-map': '../../navmesh/parse-map',
      // Needed for some geometry classes
      'polypartition': '../../navmesh/polypartition',
    }
  },
  baseUrl: '.'
});

require(['parse-map', 'drawutils', 'tile-grids'],
function( MapParser,   DrawUtils,   TileGrids) {
  var tiles = TileGrids["Volt"];
  // Get outline of walls in map.
  var parsed_map = MapParser.parse(tiles);
  
  var polys = parsed_map.walls.concat(parsed_map.obstacles);

  // Initialize canvas.
  var canvas = document.getElementById('c');
  DrawUtils.initCanvasForTiles(canvas, tiles);

  DrawUtils.drawOutline(polys, canvas, function(poly) {
    if (poly.getOrientation() == "CCW") {
      return "green";
    } else {
      return "red";
    }
  });
});
