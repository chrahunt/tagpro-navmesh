// Code for generating the cell value<->action pairs.

// A cell represents a contour cell with a value equal to the surrounding cells.
Cell = function(val) {
  if (typeof val == "string") {
    this.array = this._getCellArray(val);
  } else {
    this.array = val;
  }
}

// Given a length-4 array specifying the values for the nw, ne, se, sw quadrants
// of a contour cell, return a string uniquely representing it as n1-n2-n3-n4.
Cell.prototype.toString = function() {
  return this.array[0] + "-" + this.array[1] + "-" + this.array[2] + "-" + this.array[3];
}

// Given a string representing a cell, return the cell that would have generated it.
Cell.prototype._getCellArray = function(str) {
  var cell = new Array(4);
  var result = /(\d+)-(\d+)-(\d+)-(\d+)/.exec(str);

  cell[3] = +result[1];
  cell[2] = +result[2];
  cell[1] = +result[3];
  cell[0] = +result[4];
  
  return cell;
}

// Return a new cell rotated the number of times given.
Cell.prototype.rotate = function(n) {
  return new Cell(this._rotateArray(this.array, n));
}

// Rotate array values clockwise the number of times indicated.
Cell.prototype._rotateArray = function(array, n) {
  if (typeof n == 'undefined') n = 1;
  return array.slice(-n).concat(array.slice(0, -n));
}

// Returns true if a cell matches a given template.
Cell.prototype.matches = function(template) {
  var template_array = template.raw_array;
  for (var i = 0; i < template_array.length; i++) {
    if (template_array[i] == _) continue; // Disregarded quadrant.
    if (template_array[i] !== this.array[i]) {
      return false;
    }
  }
  return true;
}

// A Template is either an entrance or an exit and has functionality similar to a Cell,
// but accounts for the symbols used when defining templates. Always initialized with an
// array template.
Template = function(array, dir, exit_location) {
  if (typeof exit_location == 'undefined') {
    this.type = "exit";
  } else {
    this.type = "entrance";
    this.exit_location = exit_location;
  }
  this.raw_array = array;
  this.array = this._filterArray(this.raw_array);
  this.dir = dir;
  this.cell = new Cell(this.array);
}

// Return a template rotated n times.
Template.prototype.rotate = function(n) {
  var new_array = this._rotateArray(this.raw_array, n);
  // Switch upper/lower for rotation.
  for (var i = 0; i < new_array.length; i++) {

  }
  var new_dir = this._rotateDir(this.dir, n);
  var new_exit_location;
  if (this.type == "entrance") {
    new_exit_location = this._rotateArray(this.exit_location, n);
  }
  return new Template(new_array, new_dir, new_exit_location);
}

// Takes an array and filters out the values that do not correspond to actual tile values.
Template.prototype._filterArray = function(array) {
  var val = new Array(4);
  for (var i = 0; i < 4; i++) {
    if (array[i] != 4)
      val[i] = array[i];
    else
      val[i] = 0;
  }
  return val;
}

Template.prototype.toString = function() {
  return this.cell.toString();
}

Template.prototype._rotateArray = function(array, n) {
  function rotate(array) {
    var new_array = [0, 0, 0, 0];
    for (var i = 0; i < array.length; i++) {
      // Move as-is.
      if (array[i] == 0 || array[i] == 1 || array[i] == _ || array[i] == $ || i == 1 || i == 3) {
        new_array[(i + 1) % 4] = array[i];
      } else {
        // Change out twos for threes and vice-versa.
        new_array[(i + 1) % 4] = (array[i] == 3) ? 2 : 3;
      }
    }
    return new_array;
  }
  var new_array = array;
  for (var i = 0; i < n; i++) {
    new_array = rotate(new_array);
  }
  return new_array;
  //return this.cell._rotateArray(array, n);
}

// Rotate direction clockwise by 90 degrees the number of times indicated.
Template.prototype._rotateDir = function(dir, n) {
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

// In cases where multiple entrance/exits were found, match this entrance with the proper
// exit based on the exit_location array.
Template.prototype.getExit = function(matched_exits) {
  var specific_exits = [];
  // Get start location.
  var start = this.exit_location.indexOf($);
  // Loop CCW starting from exit_location start searching for exits.
  var found = false;
  for (var i = 0; i < 4; i++) {
    var index = (start - i + 4) % 4;

    for (var j = 0; j < matched_exits.length; j++) {
      var exit = matched_exits[j];
      if (exit.raw_array[index] !== _) {
        specific_exits.push(exit);
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }

  if (specific_exits.length !== 1) {
    throw "More than one exit found!";
  }
  return specific_exits[0];
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

Point = function(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function(p) {
  return new Point(this.x + p.x, this.y + p.y);
}

// Drawing functions.
// Takes in a cell and draws it.
function drawCell(cell, canvas, loc, fill) {
  // Also takes in a number and outputs a cell.
  if (typeof loc == 'undefined') loc = {x: 0, y: 0};
  if (typeof fill == 'undefined') fill = '#8ED6FF';

  var quadrant_width = 50;
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
  cell.array.forEach(function(n, q) {
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
  new Template([0, _, _, 1], "e", [_, _, _, $]),
  new Template([2, _, _, _], "se", [$, _, _, _]),
  new Template([3, _, _, 1], "e", [_, _, _, $]),
  new Template([0, _, _, 3], "e", [_, _, _, $]),
  new Template([3, _, _, 3], "e", [_, _, _, $])
];

// Adjacent tile arrangements defining exits.
var exits = [
  new Template([1, _, _, 0], "w"),
  new Template([3, _, _, _], "nw"),
  new Template([1, _, _, 2], "w"),
  new Template([2, _, _, 0], "w"),
  new Template([2, _, _, 2], "w")
];

// Number of initial definitions made above for entrances and exits.
var definitions = entrances.length;
// Add all rotations of each template element in the above arrays back into the arrays.
for (var i = 0; i < definitions; i++) {
  var entrance = entrances[i];
  var exit = exits[i];
  for (var j = 1; j < 4; j++) {
    entrances.push(entrance.rotate(j));
    exits.push(exit.rotate(j));
  }
}

// Array with every possible cell permutation.
var cells = [];
for (var i = 0; i < 4; i++) {
  for (var j = 0; j < 4; j++) {
    for (var k = 0; k < 4; k++) {
      for (var l = 0; l < 4; l++) {
        cells.push(new Cell(i + "-" + j + "-" + k + "-" + l));
      }
    }
  }
}

var action_values = {};
// Array that holds the cell itself along with the number of matched entrances
// and exits.
var broken_cells = [];

// Update number of definitions.
definitions = entrances.length;

// Loop through cells, get entrances and exits, and assign them to
// action values.
cells.forEach(function(cell, index) {
  //if (index !== 10) return;
  var matched_entrances = [];
  var matched_exits = [];
  // Get relevant entrances.
  for (var i = 0; i < definitions; i++) {
    var entrance_template = entrances[i];
    var exit_template = exits[i];
    if (cell.matches(entrance_template)) {
      matched_entrances.push(entrance_template);
    }
    if (cell.matches(exit_template)) {
      matched_exits.push(exit_template);
    }
  }

  // Only one exit and one entrance found.
  if (matched_exits.length == 1 && matched_entrances.length == 1) {
    var matched_exit = matched_exits[0];
    var matched_entrance = matched_entrances[0];
    action_values[cell.toString()] = {
      v: matched_exit.dir !== matched_entrance.dir,
      loc: matched_exit.dir
    };
  } else if (matched_entrances.length == 0 && matched_exits.length == 0) {
    // No entrances or exits found.
    action_values[cell.toString()] = {
      v: false,
      loc: "none"
    };
  } else if (matched_exits.length == matched_entrances.length) {
    // Equal lengths but more than 1 matched set.
    // Associate proper entrance values with proper exit values.
    action_values[cell.toString()] = [];
    var locs = [];
    matched_entrances.forEach(function(entrance) {
      var exit = entrance.getExit(matched_exits);
      locs.push({in_dir: entrance.dir, out_dir: exit.dir});
    });
    locs.forEach(function(loc) {
      action_values[cell.toString()].push({
        v: loc.in_dir !== loc.out_dir,
        loc: loc
      });
    });
  } //else {
    broken_cells.push([cell, matched_entrances, matched_exits]);
  //}
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
c.height = broken_cells.length >= 5 ? Math.ceil(broken_cells.length / 5) * total_width : total_width;

// Function for drawing the cells that were unmatched.
function drawBadCells(cells) {
  var context = c.getContext('2d');
  var canvas = c; // from global.
  // Drawing bad cells
  var draw_loc = {x: 0, y: 0};
  for (var i = 0; i < cells.length; i++) {
    var cell_info = cells[i];
    var cell = cell_info[0];
    var matched_entrances = cell_info[1];
    var matched_exits = cell_info[2]

    // Write information.
    context.fillStyle = 'black';
    context.fillText(cell.toString(), draw_loc.x + 5, draw_loc.y + 10)
    context.fillText("ents:" + matched_entrances.length, draw_loc.x + 5, draw_loc.y + 20)
    context.fillText("exts:" + matched_exits.length, draw_loc.x + 5, draw_loc.y + 35)

    drawCell(cell, canvas, {x: draw_loc.x + text_width, y: draw_loc.y});
    // Increment drawing location.
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
  var row = Math.floor(loc.y / total_width);
  var index = col + (row * 5);
  return index;
}

/*
// Draw outline around clicked element, calling back to navmesh function.
document.getElementById('c').addEventListener('click', function(evt) {
  this.getContext('2d').clearRect(0, 0, this.width, this.height);
  drawBadCells(broken_cells);
  var p = getCanvasPointClicked(evt, this);
  var shift = evt.shiftKey;
  // Get index of point clicked.
  var index = getIndexForLoc(p);
  console.log("Index clicked: " + index);
  // Get cell.
  var cell_info = broken_cells[index];
  var cell = cell_info[0];
  var matched_entrances = cell_info[1];
  var matched_exits = cell_info[2];

  // Increment times clicked.
  clicks[index]++;
  var this_elt = clicks[index] % (matched_entrances.length + matched_exits.length);

  var shape, fill;
  // Get which shape should be displayed.
  // matched ents
  if (this_elt < matched_entrances.length) {
    shape = matched_entrances[this_elt];
    fill = 'green';
  } else {
    shape = matched_exits[this_elt - matched_entrances.length];
    fill = 'red';
  }

  // Get original location.
  var loc = {x: ((index % 5) * total_width + 40), y: Math.floor(index / 5) * total_width};
  
  // Draw template.
  drawCell(shape, this, loc, fill);
}, false);
*/
