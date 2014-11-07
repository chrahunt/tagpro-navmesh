// Code for generating the cell value<->action pairs.

// Testing.
function test(val, expected) {
  var fn;
  if (val instanceof Array) {
    fn = arrayCompare;
  } else {
    fn = function(a, b) {return a == b;}
  }

  if (fn(val, expected)) {
    console.log("Test passed!");
  } else {
    console.error("Test failed!");
    console.log("Expected: " + expected);
    console.log("Actual: " + val);
  }
}

// Compare two arrays value-by-value.
function arrayCompare(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

// Given a length-4 array specifying the values for the nw, ne, se, sw quadrants
// of a contour cell, return it's integer value. Each quadrant should have value
// 0-3.
function getCellValue(cell) {
  return cell[0] * 64 + cell[1] * 32 + cell[2] * 8 + cell[3] * 1;
}

// Given a length-4 array specifying the arrangement of an entrance or exit, return
// its value without including the special characters.
function getEValue(cell) {
  var val = new Array(4);
  for (var i = 0; i < 4; i++) {
    if (cell[i] != 4)
      val[i] = cell[i];
    else
      val[i] = 0;
  }
  return getCellValue(val);
}

// Given a number from 0-255, return the cell that would have generated it.
function getCell(n) {
  var cell = new Array(4);

  cell[3] = n % 4;
  n = Math.floor(n / 4);
  cell[2] = n % 4;
  n = Math.floor(n / 4);
  cell[1] = n % 4;
  n = Math.floor(n / 4);
  cell[0] = n % 4;
  n = Math.floor(n / 4);
  
  return cell;
}

// Rotate array values clockwise the number of times indicated.
function rotate(ary, n) {
  if (typeof n == 'undefined') n = 1;
  return ary.slice(-n).concat(ary.slice(0, -n));
}

test(rotate([1, 0, 0, 0]), [0, 1, 0, 0]);
test(rotate([1, 0, 0, 1]), [1, 1, 0, 0]);

// Rotate direction clockwise by 90 degrees the number of times indicated.
function rotateDir(dir, n) {
  if (typeof n == 'undefined') n = 1;
  // What happens to directions when rotated 90 degrees CW.
  var rotated_directions = {
    "n": "e",
    "e": "s",
    "s": "w",
    "w": "n",
    "ne": "se",
    "se": "sw",
    "sw": "nw",
    "nw": "ne"
  };
  var result = dir;
  for (var i = 0; i < n; i++) {
    result = rotated_directions[result];
  }
  return result;
}

test(rotateDir("n", 1), "e");
test(rotateDir("n", 2), "s");
test(rotateDir("ne", 1), "se");


// Return the mask for an entrance/exit node such that, when & with 
// a contour cell, it will produce the same number as the value of the node if the
// contour cell contains that arrangement.
function getMask(cell) {
  var mask = new Array(4);
  for (var i = 0; i < 4; i++) {
    if (cell[i] != 4)
      mask[i] = 3;
    else
      mask[i] = 0;
  }
  return getCellValue(mask);
}


// Create the object that holds countour cell->(action, vertex) information.
function makeActionIndex() {
  var action_index = {};
  var opposing_directions = {
    "n": "s",
    "e": "w",
    "s": "n",
    "w": "e",
    "ne": "sw",
    "se": "nw",
    "sw": "ne",
    "nw": "se"
  };
}

// Drawing functions.
// Takes in a cell and draws it.
function drawCell(cell, canvas, loc, fill) {
  // Also takes in a number and outputs a cell.
  if (typeof cell == 'number') cell = getCell(cell);
  if (typeof loc2 == 'undefined') loc2 = {x: 0, y: 0};
  if (typeof fill == 'undefined') fill = '#8ED6FF';
  // Given a number in a quadrant and a location specifying the top left corner of
  // the quadrant, draw the relevant shape.
  function drawQuadrant(n, q, loc) {
    // draw upper triangle going certain direction at location
    function drawUpperTriangle(d, loc) {
      if (d == "r") {
        var first = {x: 50, y: 0};
        var second = {x: 50, y: 50};
      } else {
        var first = {x: 50, y: 0};
        var second = {x: 0, y: 50};
      }
      context.beginPath();
      context.moveTo(loc.x, loc.y);
      context.lineTo(loc.x + first.x, loc.y + first.y);
      context.lineTo(loc.x + second.x, loc.y + second.y);
      context.lineTo(loc.x, loc.y);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
      context.fillStyle = fill;
      context.fill();
      context.closePath();
    }
    function drawLowerTriangle(d, loc) {
      if (d == "r") {
        loc = {x: loc.x + 50, y: loc.y};
        var first = {x: 0, y: 50};
        var second = {x: -50, y: 50};
      } else {
        var first = {x: 50, y: 50};
        var second = {x: 0, y: 50};
      }
      context.beginPath();
      context.moveTo(loc.x, loc.y);
      context.lineTo(loc.x + first.x, loc.y + first.y);
      context.lineTo(loc.x + second.x, loc.y + second.y);
      context.lineTo(loc.x, loc.y);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
      context.fillStyle = fill;
      context.fill();
      context.closePath();
    }
    function drawTileOutline(loc) {
      context.beginPath();
      context.moveTo(loc.x, loc.y);
      context.lineTo(loc.x + 50, loc.y);
      context.lineTo(loc.x + 50, loc.y + 50);
      context.lineTo(loc.x, loc.y + 50);
      context.lineTo(loc.x, loc.y);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
      context.closePath();
    }
    // blank space, just draw outline without filling.
    if (n == 0) {
      drawTileOutline(loc);
    } else if (n == 1) { // tile.
      context.beginPath();
      context.moveTo(loc.x, loc.y);
      context.lineTo(loc.x + 50, loc.y);
      context.lineTo(loc.x + 50, loc.y + 50);
      context.lineTo(loc.x, loc.y + 50);
      context.lineTo(loc.x, loc.y);
      context.lineWidth = 1;
      context.strokeStyle = 'black';
      context.stroke();
      context.fillStyle = fill;
      context.fill();
      context.closePath();
    } else if (n == 2) {
      drawTileOutline(loc);
      if (q == 0 || q == 2) {
        drawLowerTriangle("l", loc);
      } else {
        drawLowerTriangle("r", loc);
      }
    } else if (n == 3) {
      drawTileOutline(loc);
      if (q == 0 || q == 2) {
        drawUpperTriangle("r", loc);
      } else {
        drawUpperTriangle("l", loc);
      }
    }
  }
  var context = canvas.getContext('2d');
  var offsets = [
    {x: 0, y: 0},
    {x: 50, y: 0},
    {x: 50, y: 50},
    {x: 0, y: 50}
  ];

  // number at element, quadrant
  cell.forEach(function(n, q) {
    var offset = offsets[q];
    var new_loc = {x: loc.x + offset.x, y: loc.y + offset.y};
    drawQuadrant(n, q, new_loc);
  });
}


// Placeholder for irrelevant material.
var _ = 4;
var $ = 5;

// Adjacent tile arrangements defining entrances.
// 0 - empty tile
// 1 - corner of square tile
// 2 - corner of diagonal tile such that bottom diagonal of quadrant is shaded
// 3 - corner of diagonal tile such that upper diagonal of quadrant is shaded
// _ - not relevant to matching
// $ - cells to look at for exit information if there is more than one entrance/exit.
var entrances = [
  [0, _, _, 1],
  [2, _, _, _],
  [3, _, _, 1],
  [0, _, _, 3]
];

// Direction one would have entered from if tracing around polygon containing one of the entrance
// combinations.
var entrance_dirs = [
  "e",
  "se",
  "e",
  "e"
];

// Locations to look for exits if there are more than 1 entrance/exit combo.
var multi_entrance_exits = [
  [_, _, $, $],
  [$, _, _, $],
  [_, _, $, $],
  [_, _, _, $]
];

// Adjacent tile arrangements defining exits.
var exits = [
  [1, _, _, 0],
  [3, _, _, _],
  [1, _, _, 2],
  [2, _, _, 0]
];

// Direction of exits given above.
var exit_dirs = [
  "w",
  "nw",
  "w",
  "w"
];

var definitions = entrances.length;
// Arrays to be appended to.
var orientation_arrays = [entrances, multi_entrance_exits, exits];
var dir_arrays = [entrance_dirs, exit_dirs];

// Add rotations of each element in the above arrays back into the arrays.
for (var i = 0; i < definitions; i++) {
  var orientation_elts = orientation_arrays.map(function(ary) {
    return ary[i];
  });
  var dir_elts = dir_arrays.map(function(ary) {
    return ary[i];
  });
  for (var j = 1; j < 4; j++) {
    orientation_elts.forEach(function(elt, index) {
      orientation_arrays[index].push(rotate(elt, j));
    });
    dir_elts.forEach(function(elt, index) {
      dir_arrays[index].push(rotateDir(elt, j));
    });
  }
}

// List of masks, when you & the mask with the value of the cell
// if it equals the mask value then it matches.
var entranceMasks = entrances.map(function(e) {
  return [getMask(e), getEValue(e)];
});

var exitMasks = exits.map(function(e) {
  return [getMask(e), getEValue(e)];
});

// Array with every possible cell permutation.
var cells = [];
for (var i = 0; i < 256; i++) {
  cells.push(i);
}

var action_values = new Array(256);
// Array that holds the cell itself along with the number of matched entrances
// and exits.
var broken_cells = [];

// Loop through cells, get entrances and exits, and assign them to
// action values.
cells.forEach(function(cell) {
  var val = cell;
  var matched_ents = [];
  var matched_exits = [];
  // Get relevant entrances.
  for (var i = 0; i < entranceMasks.length; i++) {
    var mask = entranceMasks[i][0];
    var e_val = entranceMasks[i][1];
    if ((val & mask) == e_val) {
      matched_ents.push(i);
    }
  }
  for (var i = 0; i < entranceMasks.length; i++) {
    var mask = exitMasks[i][0];
    var e_val = exitMasks[i][1];
    if ((val & mask) == e_val) {
      matched_exits.push(i);
    }
  }
  // Only one exit and one entrance found.
  if (matched_exits.length == 1 && matched_ents.length == 1) {
    var m_exit = matched_exits[0];
    var m_ent = matched_ents[0];
    action_values[val] = {
      v: exit_dirs[m_exit] !== entrance_dirs[m_ent],
      loc: exit_dirs[m_exit]
    };
  } else if (matched_ents.length == 0 && matched_exits.length == 0) {
    // No entrances or exits found.
    action_values[val] = {
      v: false,
      loc: "none"
    };
  } else if (matched_exits.length == matched_ents.length) {
    // Equal lengths and greater than 1.
    // Todo: handle this!
  } else {
    broken_cells.push([cell, matched_ents, matched_exits]);
  }
});

console.error("Number of unequal entrance/exit combinations: " + broken_cells.length);

// test drawing
var c = document.getElementById('c');
var text_width = 40;
var tile_width = 100;
var total_width = text_width + tile_width;
var total_height = 125;
// Initialize canvas size.
c.width = broken_cells.length >= 5 ? total_width * 5 : broken_cells.length * total_width;
c.height = broken_cells.length >= 5 ? Math.ceil(broken_cells.length / 5) * total_height : total_height;

function drawBadCells(broken_cells) {
  // Drawing bad cells:
  var draw_loc = {x: 0, y: 0};
  for (var i = 0; i < broken_cells.length; i++) {
    var cell = broken_cells[i];
    c.getContext('2d').fillStyle = 'black';
    c.getContext('2d').fillText(cell[0], draw_loc.x + 5, draw_loc.y + 10)
    c.getContext('2d').fillText("ents:" + cell[1].length, draw_loc.x + 5, draw_loc.y + 20)
    c.getContext('2d').fillText("exts:" + cell[2].length, draw_loc.x + 5, draw_loc.y + 35)

    drawCell(cell[0], c, {x: draw_loc.x + text_width, y: draw_loc.y});
    if ((i % 5) == 4) {
      draw_loc = {x: 0, y: draw_loc.y + total_width};
    } else {
      draw_loc = {x: draw_loc.x + total_width, y: draw_loc.y};
    }
  }
}

drawBadCells(broken_cells);

// How can I get a better idea of what's going on.
// click on a cell and loop through the located exits/entrances.
// entrances green, exits red.
// draw regular cell first.
// Keep track of how many clicks on specific elements.
var clicks = [];
for (var i = 0; i < broken_cells.length; i++) {
  clicks.push(0);
}
// Takes an event and returns the location clicked within the canvas
// element.
function getCanvasPointClicked(e, canvas) {
  var rect = canvas.getBoundingClientRect();
  return {x: e.clientX - rect.left, y: e.clientY - rect.top};
}

// Given a location, return the index of the element that
// is present at that location. If it doesn't correspond to a good index, then
// it is -1.
function getIndexForLoc(loc) {
  var col = Math.floor(loc.x / total_width);
  var row = Math.floor(loc.y / total_height);
  var index = col + (row * 5);
  return index;
}

// Draw outline around clicked element, calling back to navmesh function.
document.getElementById('c').addEventListener('click', function(evt) {
  this.getContext('2d').clearRect(0, 0, this.width, this.height);
  drawBadCells(broken_cells);
  var p = getCanvasPointClicked(evt, this);
  var shift = evt.shiftKey;
  // Get index of point clicked.
  var index = getIndexForLoc(p);
  // Get cell.
  var cell = broken_cells[index];
  // Increment times clicked.
  clicks[index]++;
  var this_elt = clicks[index] % (cell[1].length + cell[2].length);
  var shape, fill;
  // Get which shape should be displayed.
  // matched ents
  if (this_elt < cell[1].length) {
    shape = cell[1][this_elt];
    shape = entranceMasks[shape][1];
    fill = 'green';
  } else if (this_elt < cell[0].length) {
    shape = cell[2][this_elt - cell[1].length];
    shape = exitMasks[shape][1];
    fill = 'red';
  }
  // Get original location
  var loc = {x: ((index % 5) * total_width + 40), y: Math.floor((index - 1) / 5) * total_width};
  // redraw shape
  drawCell(cell[0], this, loc, 'red');
  drawCell(shape, this, loc, fill);

  
}, false);
