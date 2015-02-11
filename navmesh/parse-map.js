/**
 * @module map/parse
 */
define(['./action-values', './polypartition'],
function(  ActionValues,      pp) {
  var Point = pp.Point;
  var Poly = pp.Poly;

  /**
   * Contains utilities for generating usable map representations from
   * map tiles.
   */
  var MapParser = {};

  /**
   * An object with x and y properties that represents a coordinate pair.
   * @typedef MPPoint
   * @type {object}
   * @property {number} x - The x coordinate of the location.
   * @property {number} y - The y coordinate of the location.
   */

  /**
   * A Shape is an array of points, where points are objects with x and y properties which represent coordinates on the map.
   * @typedef MPShape
   * @type {Array.<MPPoint>}
   */

  /**
   * An object with r and c properties that represents a row/column
   * location in a 2d array.
   * @typedef ArrayLoc
   * @type {object}
   * @property {integer} r - The row number of the array location.
   * @property {integer} c - The column number of the array location.
   */

  /**
   * The 2d tile grid from `tagpro.map`, or a similar 2d grid resulting
   * from an operation on the original.
   * @typedef MapTiles
   * @type {Array.<Array.<number>>}
   */

  /**
   * A Cell is just an array that holds the values of the four adjacent
   * cells in a 2d array, recorded in CCW order starting from the upper-
   * left quadrant. For example, given a 2d array:
   * [[1, 0, 1],
   *  [1, 0, 0],
   *  [1, 1, 1]]
   * we would generate the representation using the cells:
   * [1, 0,  [0, 1,  [1, 0,  [0, 0  
   *  1, 0]   0, 0]   1, 1]   1, 1].
   * These correspond to the parts of a tile that would be covered if
   * placed at the intersection of 4 tiles. The value 0 represents a
   * blank location, 1 indicates that the quadrant is covered.
   * To represent how such tiles would be covered in the case of diagonal
   * tiles, we use 2 to indicate that the lower diagonal of a quadrant is
   * filled, and 3 to indicate that the upper diagonal of a quadrant is
   * filled. The tiles available force the diagonals of each quadrant to
   * point to the center, so this is sufficient for describing all
   * possible overlappings.
   * @typedef Cell
   * @type {Array.<number>}
   */

  /**
   * Callback that receives each of the elements in the 2d map function.
   * @callback mapCallback
   * @param {*} - The element from the 2d array.
   * @return {*} - The transformed element.
   */

  /**
   * Applies `fn` to every individual element of the 2d array `arr`.
   * @param {Array.<Array.<*>>} arr - The 2d array to use.
   * @param {mapCallback} fn - The function to apply to each element.
   * @return {Array.<Array.<*>>} - The 2d array after the function
   *   has been applied to each element.
   */
  function map2d(arr, fn) {
    return arr.map(function(row) {
      return row.map(fn);
    });
  }

  /**
   * Returns 1 if a tile value is one that we want to consider as
   * a wall (we consider empty space to be a wall), or the tile value
   * itself for diagonal walls. 0 is returned otherwise.
   * @param {number} elt - The tile value at a row/column location
   * @return {number} - The number to insert in place of the tile value.
   */
  function isBadCell(elt) {
    var bad_cells = [1, 1.1, 1.2, 1.3, 1.4];
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

  /**
   * Converts the provided array into its equivalent representation
   * using cells.
   * @param {MapTiles} arr - 
   * @param {Array.<Array.<Cell>>} - The converted array.
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

  /**
   * Callback function for testing equality of items.
   * @callback comparisonCallback
   * @param {*} - The first item.
   * @param {*} - The second item.
   * @return {boolean} - Whether or not the items are equal.
   */

  /**
   * Returns the location of obj in arr with equality determined by cmp.
   * @param {Array.<*>} arr - The array to be searched.
   * @param {*} obj - The item to find a match for.
   * @param {comparisonCallback} cmp - The callback that defines
   *   whether `obj` matches.
   * @return {integer} - The index of the first element to match `obj`,
   *   or -1 if no such element was located.
   */
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

  /**
   * Compare two objects defining row/col locations in an array
   * and return true if they represent the same row/col location.
   * @param {ArrayLoc} elt1
   * @param {ArrayLoc} elt2
   * @return {boolean} - Whether or not these two array locations
   *   represent the same row/column.
   */
  function eltCompare(elt1, elt2) {
    return (elt1.c == elt2.c && elt1.r == elt2.r);
  }

  /**
   * Takes in the vertex/action information and returns an array of arrays,
   * where each array corresponds to a shape and each element of the array is
   * a vertex which is connected to it's previous and next neighbor (circular).
   * @param {} actionInfo
   * @return {Array.<Array<ArrayLoc>>} - Array of vertex locations in 
   */
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
    var iterations = 0;

    // Iterate until all nodes have been visited.
    while (discovered.length !== total) {
      if (!node) {
        // Reached end.
        break;
      }
      if (iterations > total * 4) {
        // Sanity check on number of iterations. Maximum number of
        // times a single tile would be visited is 4 for a fan-like
        // pattern of triangle wall tiles.
        break;
      } else {
        iterations++;
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

    if (discovered.length == total) {
      return shapes;
    } else {
      return null;
    }
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

  /**
   * Convert an array location to a point representing the top-left
   * corner of the tile in global coordinates.
   * @param {ArrayLoc} location - The array location to get the
   *   coordinates for.
   * @return {MPPoint} - The coordinates of the tile.
   */
  function getCoordinates(location) {
    var tile_width = 40;
    var x = location.r * tile_width;
    var y = location.c * tile_width;
    return {x: x, y: y};
  }

  /**
   * Takes in an array of shapes and converts from contour grid layout
   * to actual coordinates.
   * @param {Array.<Array.<ArrayLoc>>} shapes - output from generateShapes
   * @return {Array.<Array.<{{x: number, y: number}}>>}
   */
  function convertShapesToCoords(shapes) {
    var tile_width = 40;

    var new_shapes = map2d(shapes, function(loc) {
      // It would be loc.r + 1 and loc.c + 1 but that has been removed
      // to account for the one-tile width of padding added in doParse.
      var row = loc.r * tile_width;
      var col = loc.c * tile_width;
      return {x: row, y: col}
    });
    return new_shapes;
  }

  // Given an x and y value, return a polygon (octagon) that approximates
  // a spike at the tile given by that x, y location. Points in CW order.
  function getSpikeShape(coord) {
    var x = coord.x + 20, y = coord.y + 20;
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

  /**
   * Returns an array of the array locations of the spikes contained
   * in the map tiles, replacing those array locations in the original
   * map tiles with 2, which corresponds to a floor tile.
   * @private
   * @param {MapTiles} tiles - The map tiles.
   * @return {Array.<ArrayLoc>} - The array of locations that held
   *   spike tiles.
   */
  MapParser.extractSpikes = function(tiles) {
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

  var Obstacle = function(type, ids) {
    this.type = type;
    this.vals = [];
    this.info = {};
    ids.forEach(function(id) {
      if (typeof id == "number") {
        this.vals.push(id);
        this.info[id] = this.type;
      } else {
        this.vals.push(id.num);
        this.info[id] = id.name;
      }
    }, this);
  }

  Obstacle.prototype.describes = function(val) {
    if(this.vals.indexOf(Math.floor(+val)) !== -1) {
      return (this.info[+val] || this.info[Math.floor(+val)]);
    } else {
      return false;
    }
  };

  var Obstacles = [
    new Obstacle("bomb", [10, 10.1]),
    new Obstacle("boost",
      [5, 5.1, {num: 14, name: "redboost"}, {num: 15, name: "blueboost"}]),
    new Obstacle("gate",
      [9, {num: 9.1, name: "greengate"}, {num: 9.2, name: "redgate"},
      {num: 9.3, name: "bluegate"}])
  ];

  MapParser.extractDynamicObstacles = function(tiles) {
    var dynamic_obstacles = [];
    tiles.forEach(function(row, x) {
      row.forEach(function(tile, y) {
        Obstacles.some(function(obstacle_type) {
          var dynamic_obstacle = obstacle_type.describes(tile)
          if (dynamic_obstacle) {
            dynamic_obstacles.push({
              type: dynamic_obstacle,
              x: x,
              y: y,
              v: tile
            });
            tiles[x][y] = 0;
            return true;
          } else {
            return false;
          }
        });
      });
    });
    return dynamic_obstacles;
  }

  /**
   * The returned value from the map parsing function.
   * @typedef ParsedMap
   * @type {object}
   * @property {Array.<MPShape} walls - The parsed walls.
   * @property {Array.<MPShape} obstacles - The parsed obstacles.
   */

  /**
   * Converts the 2d array defining a TagPro map into shapes.
   * @param {MapTiles} tiles - The tiles as retrieved from `tagpro.map`.
   * @return {?ParsedMap} - The result of converting the map into
   *   polygons, or null if there was an issue parsing the map.
   */
  MapParser.parse = function(tiles) {
    // Make copy of tiles to preserve original array
    tiles = JSON.parse(JSON.stringify(tiles));

    // Returns a list of the spike locations and removes them from
    // the tiles.
    var spike_locations = MapParser.extractSpikes(tiles);

    var dynamic_obstacles = MapParser.extractDynamicObstacles(tiles);

    // Pad tiles with a ring of wall tiles, to ensure the map is
    // closed.
    var empty_row = [];
    for (var i = 0; i < tiles[0].length + 2; i++) {
      empty_row.push(1);
    }
    tiles.forEach(function(row) {
      row.unshift(1);
      row.push(1);
    });
    tiles.unshift(empty_row);
    tiles.push(empty_row.slice());

    // Actually doing the conversion.
    // Get rid of tile values except those for the walls.
    var threshold_tiles = map2d(tiles, isBadCell);

    // Generate contour grid, essentially a grid whose cells are at the
    // intersection of every set of 4 cells in the original map.
    var contour_grid_2 = generateContourGrid(threshold_tiles);

    // Get tile vertex and actions for each cell in contour grid.
    var tile_actions = map2d(contour_grid_2, getAction);

    var generated_shapes = generateShapes(tile_actions);
    if (!generated_shapes) {
      return null;
    }

    var actual_shapes = generated_shapes.filter(function(elt) {
      return elt.length > 0;
    });

    var converted_shapes = convertShapesToCoords(actual_shapes);

    // Get spike-approximating shapes and add to list.
    var static_obstacles = spike_locations.map(function(spike) {
      return getSpikeShape(getCoordinates(spike));
    });

    return {
      walls: this.convertShapesToPolys(converted_shapes),
      static_obstacles: this.convertShapesToPolys(static_obstacles),
      dynamic_obstacles: dynamic_obstacles
    };
  }

  /**
   * Convert shapes into polys.
   * @param {Array.<Shape>} shapes - The shapes to be converted.
   * @return {Array.<Poly>} - The converted shapes.
   */
  MapParser.convertShapesToPolys = function(shapes) {
    var polys = shapes.map(function(shape) {
      return MapParser.convertShapeToPoly(shape);
    });
    return polys;
  }

  
  /**
   * Convert a shape into a Poly.
   * @param {MPShape} shape - The shape to convert.
   * @return {Poly} - The converted shape.
   */
  MapParser.convertShapeToPoly = function(shape) {
    var poly = new Poly();
    poly.init(shape.length);
    for (var i = 0; i < shape.length; i++) {
      var point = new Point(shape[i].x, shape[i].y);
      poly.setPoint(i, point);
    }
    return poly;
  }

  return MapParser;
});
