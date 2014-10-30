// Tiles value returned from socket connection for SNES v2.
var tiles = [
  [1,1,1,1,1,1,7,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1],
  [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1],
  [1,1,1,1,10,2,2,2,2,2,2,2,2,2,6.3,2,2,2,2,2,1,1,1,1],
  [1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1],
  [1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
  [1,10,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,7,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,7,2,2,2,2,1],
  [1,2,2,2,2,3,2,2,2,8,2,2,1,2,2,2,2,2,7,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,5,2,2,1],
  [1,2,2,2,2,7,7,1,2,2,14,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,2,5,2,1,1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,7,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,7,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,8,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,7,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,7,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1],
  [1,1,1,1,1,1,2,2,2,2,7,9,9,9,7,2,2,2,1,1,2,2,2,1],
  [1,1,1,1,1,1,1,2,2,2,9,9,9,9,9,2,2,2,1,1,2,2,2,1],
  [1,1,1,1,1,1,1,2,2,2,9,9,6.2,9,9,2,2,2,1,1,2,6.3,2,1],
  [1,1,1,1,1,1,1,2,2,2,9,9,9,9,9,2,2,2,1,1,2,2,2,1],
  [1,1,1,1,1,1,2,2,2,2,7,9,9,9,7,2,2,2,1,1,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,7,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,7,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,8,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,7,1],
  [1,2,2,5,2,1,1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,7,1],
  [1,2,2,2,2,7,7,1,2,2,15,2,2,2,1,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,5,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1],
  [1,2,2,2,2,4,2,2,2,8,2,2,1,2,2,2,2,2,7,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,7,2,2,2,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,7,2,2,2,2,1],
  [1,10,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,7,2,2,2,2,2,1],
  [1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
  [1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1],
  [1,1,1,1,10,2,2,2,2,2,2,2,2,2,6.1,2,2,2,2,2,1,1,1,1],
  [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1],
  [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1],
  [1,1,1,1,1,1,7,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Returns 1 if a cell is a bad cell, 0 otherwise.
function isBadCell(elt) {
  var bad_cells = [1, 7, 1.1, 1.2, 1.3, 1.4];
  if(bad_cells.indexOf(elt) !== -1) {
    return 1;
  } else {
    return 0;
  }
}

// Takes a 2D array and returns an array resulting from applying fn to
// each value.
function threshold(arr, fn) {
  return arr.map(function(row) {
    return row.map(fn);
  });
}

function map2d(arr, fn) {
  return arr.map(function(row) {
    return row.map(fn);
  });
}

// Given a rectangular 2D array, returns a 2D array with dimensions one
// less in each direction where each cell is composed of the values of
// the four surrounding it in the original array.
function generateContourGrid(arr) {
  // Generate grid for holding values.
  var contour_grid = new Array(arr.length - 1);
  for (var n = 0; n < contour_grid.length; n++) {
    contour_grid[n] = new Array(arr[0].length - 1);
  }
  for (var i = 0; i < (arr.length - 1); i++) {
    for (var j = 0; j < (arr[0].length - 1); j++) {
      contour_grid[i][j] = [arr[i][j], arr[i][j+1], arr[i+1][j+1], arr[i+1][j]];
    }
  }
  return contour_grid;
}

// Return whether there should be a vertex at the given location and
// which location to go next, if any.
// Value returned is an object with property v and loc, v for whether
// there is a vertex, and loc for the next location to move, if any.
// loc is a string, of none, down, left, right, up, down corresponding to
// tracing out a shape clockwise (or the interior of a shape CCW), or a function
// that takes a string corresponding to the direction taken to get to the current
// cell.
// There will never be a vertex without a next direction.
function getAction(cell) {
  var num = cell[0] * 8 + cell[1] * 4 + cell[2] * 2 + cell[3];
  switch(num) {
    case 0:
      return {v: false, loc: "none"};
    case 1:
      return {v: true, loc: "down"};
    case 2:
      return {v: true, loc: "right"};
    case 3:
      return {v: false, loc: "right"};
    case 4:
      return {v: true, loc: "up"};
    case 5:
      return {v: true, loc: function(prev_dir) {
        if (prev_dir == "right") {
          return "down";
        } else {
          return "up";
        }
      }};
    case 6:
      return {v: false, loc: "up"};
    case 7:
      return {v: true, loc: "up"};
    case 8:
      return {v: true, loc: "left"};
    case 9:
      return {v: false, loc: "down"};
    case 10:
      return {v: true, loc: function(prev_dir) {
        if (prev_dir == "down") {
          return "left";
        } else {
          return "right";
        }
      }};
    case 11:
      return {v: true, loc: "right"};
    case 12:
      return {v: false, loc: "left"};
    case 13:
      return {v: true, loc: "down"};
    case 14:
      return {v: true, loc: "left"};
    case 15:
      return {v: false, loc: "none"};
  }
}

function find(arr, obj, cmp) {
  if (typeof cmp !== 'undefined') {
    for (var i = 0; i < arr.length; i++) {
      if (cmp(arr[i], obj)) {
        return i;
      }
    }
    return -1;
  }
}

// Compare two array locations.
function eltCompare(elt1, elt2) {
  return (elt1.c == elt2.c && elt1.r == elt2.r);
}

// Takes in the vertex/action information and returns an array of arrays,
// where each array corresponds to a shape and each element of the array is
// a vertex which is connected to it's previous and next neighbor (circular).
function generateShapes(actionInfo) {
  // Total number of cells.
  var total = actionInfo.length * actionInfo[0].length;

  // Takes the current location and direction at this point and
  // returns the next location to check. Returns null if this cell is
  // not part of a shape.
  function nextNeighbor(elt, dir) {
    var drow = 0, dcol = 0;
    if (dir == "none") {
      return null;
    } else if (dir == "up") {
      drow = -1;
    } else if (dir == "down") {
      drow = 1;
    } else if (dir == "left") {
      dcol = -1;
    } else if (dir == "right") {
      dcol = 1;
    }
    return {r: elt.r + drow, c: elt.c + dcol};
  }

  // Get the next cell, from left to right, top to bottom. Returns null
  // if last element in array reached.
  function nextCell(elt) {
    if (elt.c + 1 < actionInfo[elt.r].length) {
      return {r: elt.r, c: elt.c + 1};
    } else if (elt.r + 1 < actionInfo.length) {
      return {r: elt.r + 1, c: 0};
    }
    return null;
  }
  
  var discovered = [];
  var node = {r: 0, c: 0};
  var shapes = [];
  var current_shape = [];
  var shape_node_start = null;
  var last_action = null;
  //console.log(total);
  while (discovered.length !== total) {
    if (!node) {
      console.log("Reached end.");
      break;
    }
    // It's okay to be in a discovered node if shapes are adjacent,
    // we just want to keep track of the ones we've seen.
    if (find(discovered, node, eltCompare) == -1) {
      discovered.push(node);
      //console.log(discovered.length);
    }
    //console.log('test');
    var action = actionInfo[node.r][node.c];
    var dir = action.loc;
    if (typeof dir == 'function') {
      dir = dir(last_action);
    }
    last_action = dir;
    var next = nextNeighbor(node, dir);
    if (next) { // Part of a shape.
      // Save location for restarting after this shape has been defined.
      var first = false;
      if (current_shape.length == 0) {
        //console.log('setting');
        first = true;
        shape_node_start = node;
      }
      if (action.v || first) {
        current_shape.push(node);
      }
      // Next node is part of shape, shape has been explored.
      if (find(current_shape, next, eltCompare) !== -1) {
        shapes.push(current_shape);
        current_shape = [];
        // Get the next undiscovered node.
        node = nextCell(shape_node_start);
        while (node && (find(discovered, node, eltCompare) !== -1)) {
          node = nextCell(node);
        }
        shape_node_start = null;
      } else {
        node = next;
      }
    } else { // Not part of a shape.
      node = nextCell(node);
      // Get the next undiscovered node.
      while (node && (find(discovered, node, eltCompare) !== -1)) {
        node = nextCell(node);
      }
    }
  }
  return shapes;
}

// Takes in an array of shapes and converts from contour grid layout
// to actual coordinates.
function convertShapesToCoords(shapes) {
  var tile_width = 40;

  var new_shapes = map2d(shapes, function(loc) {
    return {x: (loc.r + 1) * tile_width, y: (loc.c + 1) * tile_width}
  });
  return new_shapes;
}

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
function drawPoly(poly, canvas) {
  canvas.beginPath();
  var start = poly.getPoint(0);
  canvas.moveTo(start.x, start.y);
  for (var i = 1; i < poly.numpoints; i++) {
    canvas.lineTo(poly.getPoint(i).x, poly.getPoint(i).y);
  }
  canvas.lineTo(start.x, start.y);
  canvas.lineWidth = 1;
  canvas.strokeStyle = 'black';
  canvas.stroke();
  canvas.closePath();
}

// Draw outlines on canvas.
function drawOutline(shapes) {
  var c = document.getElementById('c');
  c.width = tile_actions.length * 40;
  c.height = tile_actions[0].length * 40;
  var c2 = c.getContext('2d');
  c2.fillStyle = '#d00';

  for (var i = 0; i < shapes.length; i++) {
    if (shapes[i] instanceof Poly) {
      drawPoly(shapes[i], c2);
    } else {
      drawShape(shapes[i], c2);
    }
  }
}

// Convert shapes into Polys.
function convertShapesToPolys(shapes) {
  var polys = shapes.map(function(shape) {
    var poly = new Poly();
    poly.init(shape.length);
    for (var i = 0; i < shape.length; i++) {
      var point = new Point(shape[i].x, shape[i].y);
      poly.setPoint(i, point);
    }
    return poly;
  });
  return polys;
}

// Generate threshold for map.
var threshold_tiles = threshold(tiles, isBadCell);

// Generate contour grid.
var contour_grid_2 = generateContourGrid(threshold_tiles);

// Get tile vertex and actions for each cell in contour grid.
var tile_actions = threshold(contour_grid_2, getAction);

var generated_shapes = generateShapes(tile_actions);
var actual_shapes = generated_shapes.filter(function(elt) {
  return elt.length > 0;
});

console.log("Generated length: " + generated_shapes.length + " Actual length: " + actual_shapes.length);

console.log(actual_shapes);

var converted_shapes = convertShapesToCoords(actual_shapes);
var polys = convertShapesToPolys(converted_shapes);
// Get map outline.
var best_poly = polys[0];
var best_poly_index = 0;
var best_poly_area = Math.abs(polys[0].getArea());
console.log(polys[0].getArea());
for (var i = 1; i < polys.length; i++) {
  if (Math.abs(polys[i].getArea()) > best_poly_area) {
    best_poly = polys[i];
    best_poly_index = i;
    best_poly_area = Math.abs(polys[i].getArea());
  }
}
// Remove border poly.
polys.splice(i, 1);
// Set holes as such.
polys.forEach(function(e) {
  e.setOrientation("CW");
  e.hole = true;
});

var partitioner = new Partition();
// Get polygons defining regions of map.
var parts = partitioner.convexPartition(best_poly);

//var test_a = [best_poly];
drawOutline(parts);
//drawOutline(converted_shapes);

