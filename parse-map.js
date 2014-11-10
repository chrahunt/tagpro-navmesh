define(['./action-values'],
function(   ActionValues) {
  // Utilities for generating usable map representations from map tiles.
  var mapParser = function() {}

  // Takes in a tile grid and returns an array of shapes representing the
  // grid. A shape is an array of vertices. A vertex is an objects with
  // x and y properties corresponding to the location of the vertex.
  mapParser.parse = function(tiles) {
    // Returns 1 if a cell is a 'bad' cell (tile or otherwise to be avoided), 0 otherwise.
    function isBadCell(elt) {
      var bad_cells = [0, 1, 1.1, 1.2, 1.3, 1.4];
      if(bad_cells.indexOf(elt) !== -1) {
        // Ensure empty spaces get mapped to full tiles so outside of
        // map isn't traced.
        if (elt == 0) {
          return 1;
        } else {
          return elt;
        }
        return elt;
      } else {
        return 0;
      }
    }

    // Takes a 2D array and returns an array of arrays resulting from applying fn to
    // each value in each sub-array.
    function map2d(arr, fn) {
      return arr.map(function(row) {
        return row.map(fn);
      });
    }

    function preprocess(arr) {
      function identifier(cell) {
        var str = cell[0] + "-" + cell[1] + "-" + cell[2] + "-" + cell[3];
        return str;
      }
      var bad_arrangements = new Set();
      bad_arrangements.add(identifier([1, 1, 1.4, 1]));
      bad_arrangements.add(identifier([1, 1, 1, 1.3]));
      bad_arrangements.add(identifier([1, 1.1, 1, 1]));
      bad_arrangements.add(identifier([1.2, 1, 1, 1]));
      for (var i = 0; i < (arr.length - 1); i++) {
        for (var j = 0; j < (arr[0].length - 1); j++) {
          var cell = [arr[i][j], arr[i][j+1], arr[i+1][j+1], arr[i+1][j]];
          // Check if in bad arrangements.
          if (bad_arrangements.has(identifier(cell))) {
            arr[i][j] = 1;
            arr[i][j+1] = 1;
            arr[i+1][j+1] = 1;
            arr[i+1][j] = 1;
          }
        }
      }
      return arr;
    }

    /*
     * Given a rectangular 2D array, returns a 2D array with dimensions one
     * less in each direction where each cell is composed of the values of
     * the four surrounding it in the original array, given as an array of
     * values in CCW order starting from the upper left quadrant. e.g. given
     * [[1, 0, 1],
     *  [1, 0, 0],
     *  [1, 1, 1]]
     * the tiles
     * [1, 0,  [0, 1,  [1, 0,  [0, 0  
     *  1, 0]   0, 0]   1, 1]   1, 1]
     * would be generated.
     * Things get more complicated to accommodate representing diagonal tiles.
     * Within a contour tile (a tile in the resulting contour grid) the following
     * values in a quadrant of the tile hold the meaning specified:
     *   2 - the lower diagonal of that quadrant is filled
     *   3 - the upper diagonal of that quadrant is filled
     * #todo: elaborate further if needed.
     */
    function generateContourGrid(arr) {
      // Generate grid for holding values.
      var contour_grid = new Array(arr.length - 1);
      for (var n = 0; n < contour_grid.length; n++) {
        contour_grid[n] = new Array(arr[0].length - 1);
      }
      var corners = [1.1, 1.2, 1.3, 1.4];
      // Specifies the resulting values for the above corner values. The index
      // of the objects in this array corresponds to the proper values for the
      // quadrant of the same index.
      var corner_values = [
        {1.1: 3, 1.2: 0, 1.3: 2, 1.4: 1},
        {1.1: 0, 1.2: 3, 1.3: 1, 1.4: 2},
        {1.1: 3, 1.2: 1, 1.3: 2, 1.4: 0},
        {1.1: 1, 1.2: 3, 1.3: 0, 1.4: 2}
      ];
      for (var i = 0; i < (arr.length - 1); i++) {
        for (var j = 0; j < (arr[0].length - 1); j++) {
          var cell = [arr[i][j], arr[i][j+1], arr[i+1][j+1], arr[i+1][j]];
          // Convert corner tiles to appropriate representation.
          cell.forEach(function(val, i, cell) {
            if (corners.indexOf(val) !== -1) {
              cell[i] = corner_values[i][val];
            }
          });

          contour_grid[i][j] = cell;
        }
      }
      return contour_grid;
    }

    // Return whether there should be a vertex at the given location and
    // which location to go next, if any.
    // Value returned is an object with properties 'v' and 'loc'. 'v' is a boolean
    // indicating whether there is a vertex, and 'loc' gives the next location to move, if any.
    // loc is a string, of none, down, left, right, up, down corresponding to
    // tracing out a shape clockwise (or the interior of a shape CCW), or a function
    // that takes a string corresponding to the direction taken to get to the current
    // cell.
    // There will never be a vertex without a next direction.
    function getAction(cell) {
      var str = cell[0] + "-" + cell[1] + "-" + cell[2] + "-" + cell[3];
      return ActionValues[str];
    }

    // Returns the location of obj in arr with equality determined by cmp.
    // If no element is found then this returns -1.
    // cmp should be a function that takes two elements and returns true
    // if they are equal, false otherwise.
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
      var directions = {
        "n": [-1, 0],
        "e": [0, 1],
        "s": [1, 0],
        "w": [0, -1],
        "ne": [-1, 1],
        "se": [1, 1],
        "sw": [1, -1],
        "nw": [-1, -1]
      };
      // Takes the current location and direction at this point and
      // returns the next location to check. Returns null if this cell is
      // not part of a shape.
      function nextNeighbor(elt, dir) {
        var drow = 0, dcol = 0;
        if (dir == "none") {
          return null;
        } else {
          var offset = directions[dir];
          return {r: elt.r + offset[0], c: elt.c + offset[1]};
        }
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

      // Get identifier for given node and direction
      function getIdentifier(node, dir) {
        return "r" + node.r + "c" + node.c + "d" + dir;
      }
      
      var discovered = [];
      var node = {r: 0, c: 0};
      var shapes = [];
      var current_shape = [];
      var shape_node_start = null;
      var last_action = null;
      // Object to track location + actions that have been taken.
      var taken_actions = {};

      // Iterate until all nodes have been visited.
      while (discovered.length !== total) {
        if (!node) {
          console.log("Reached end.");
          break;
        }
        // It's okay to be in a discovered node if shapes are adjacent,
        // we just want to keep track of the ones we've seen.
        if (find(discovered, node, eltCompare) == -1) {
          discovered.push(node);
        }

        var action = actionInfo[node.r][node.c];
        var dir;
        // If action has multiple possibilities.
        if (action instanceof Array) {
          // Part of a shape, find the info with that previous action as
          // in_dir.
          if (last_action !== "none") {
            var action_found = false;
            for (var i = 0; i < action.length; i++) {
              var this_action = action[i];
              if (this_action["loc"]["in_dir"] == last_action) {
                action = this_action;
                dir = this_action["loc"]["out_dir"];
                action_found = true;
                break;
              }
            }

            if (!action_found) {
              throw "Error!";
            }
          } else {
            // Find the first action that has not been taken previously.
            var action_found = false;
            for (var i = 0; i < action.length; i++) {
              var this_action = action[i];
              if (!taken_actions[getIdentifier(node, this_action["loc"]["out_dir"])]) {
                action = this_action
                dir = this_action["loc"]["out_dir"];
                action_found = true;
                break;
              }
            }
            if (!action_found) {
              throw "Error!";
            }
          }
        } else { // Action only has single possibility.
          dir = action.loc;
        }

        // Set node/action as having been visited.
        taken_actions[getIdentifier(node, dir)] = true;

        last_action = dir;
        var next = nextNeighbor(node, dir);
        if (next) { // Part of a shape.
          // Save location for restarting after this shape has been defined.
          var first = false;
          if (current_shape.length == 0) {
            first = true;
            shape_node_start = node;
            shape_node_start_action = last_action;
          }
          
          // Current node and direction is same as at start of shape,
          // shape has been explored.
          if (!first && eltCompare(node, shape_node_start) && last_action == shape_node_start_action) {
            shapes.push(current_shape);
            current_shape = [];
            // Get the next undiscovered node.
            node = nextCell(shape_node_start);
            while (node && (find(discovered, node, eltCompare) !== -1)) {
              node = nextCell(node);
            }
            shape_node_start = null;
          } else {
            if (action.v || first) {
              current_shape.push(node);
            }
            node = next;
          }
        } else { // Not part of a shape.
          node = nextCell(node);
          // Get the next undiscovered node.
          while (node && (find(discovered, node, eltCompare) !== -1)) {
            node = nextCell(node);
          }
        }
      } // end while
      return shapes;
    }

    // Convert a row/column value to a coordinate pair representing the center
    // of that value, assumes the row/column value is from the original tile
    // grid.
    function getCoordinates(location) {
      var tile_width = 40;
      var x = location.r * tile_width;// + (tile_width / 2);
      var y = location.c * tile_width;// + (tile_width / 2);
      return {x: x, y: y};
    }

    // Takes in an array of shapes and converts from contour grid layout
    // to actual coordinates.
    function convertShapesToCoords(shapes) {
      var tile_width = 40;

      var new_shapes = map2d(shapes, function(loc) {
        // It would be loc.r + 1 and loc.c + 1 but that has been removed
        // to account for the one-tile width of padding added in doParse.
        var row = loc.r * tile_width - (tile_width / 2);
        var col = loc.c * tile_width - (tile_width / 2);
        return {x: row, y: col}
      });
      return new_shapes;
    }

    // Given an x and y value, return a polygon (octagon) that approximates
    // a spike centered at that x, y location. Points in CW order.
    function getSpikeShape(coord) {
      var x = coord.x, y = coord.y;
      var spike_radius = 14;
      // almost = spike_radius * tan(pi/8) for the vertices of a regular octagon.
      var point_offset = 5.8;
      return [
        {x: x - spike_radius, y: y - point_offset},
        {x: x - spike_radius, y: y + point_offset},
        {x: x - point_offset, y: y + spike_radius},
        {x: x + point_offset, y: y + spike_radius},
        {x: x + spike_radius, y: y + point_offset},
        {x: x + spike_radius, y: y - point_offset},
        {x: x + point_offset, y: y - spike_radius},
        {x: x - point_offset, y: y - spike_radius}
      ];
    }

    // Returns an array of the row/column locations of the spikes in
    // the map, replacing them with floor tiles in the original array.
    function extractSpikes(tiles) {
      var spike_locations = [];
      tiles.forEach(function(row, row_n) {
        row.forEach(function(cell_value, index, row) {
          if (cell_value == 7) {
            spike_locations.push({r: row_n, c: index});
            row[index] = 2;
          }
        });
      });
      return spike_locations;
    }

    // Bring everything together.
    function doParse(tiles) {
      // Make copy of tiles to preserve original.
      tiles = JSON.parse(JSON.stringify(tiles));

      // Returns a list of the spike locations and removes them from
      // the tiles.
      var spike_locations = extractSpikes(tiles);

      // Pad tiles with a single ring of empty space on all sides, to
      // ensure interior of map is closed.
      var empty_row = [];
      for (var i = 0; i < tiles[0].length + 2; i++) {
        empty_row.push(0);
      }
      tiles.forEach(function(row) {
        row.unshift(0);
        row.push(0);
      });
      tiles.unshift(empty_row);
      tiles.push(empty_row.slice());

      // Actually doing the conversion.
      // Get rid of all but wall/obstacle cells.
      var threshold_tiles = map2d(tiles, isBadCell);

      // Preprocess tiles to get rid of diagonal tiles that cause problems
      // outside bounds of map.
      var preprocessed_tiles = preprocess(threshold_tiles);

      // Generate contour grid, essentially a grid whose cells are at the
      // intersection of every set of 4 cells in the original map.
      var contour_grid_2 = generateContourGrid(preprocessed_tiles);

      // Get tile vertex and actions for each cell in contour grid.
      var tile_actions = map2d(contour_grid_2, getAction);

      var generated_shapes = generateShapes(tile_actions);
      var actual_shapes = generated_shapes.filter(function(elt) {
        return elt.length > 0;
      });

      var converted_shapes = convertShapesToCoords(actual_shapes);

      // Get spike-approximating shapes and add to list.
      spike_locations.forEach(function(spike) {
        converted_shapes.push(getSpikeShape(getCoordinates(spike)));
      });
      return converted_shapes;
    }

    return doParse(tiles);
  }

  // Convert arrays of points as returned by mapParser.parse into Polys.
  mapParser.convertShapesToPolys = function(shapes) {
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
  return mapParser;
});
