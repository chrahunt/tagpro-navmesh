/**
 * A NavMesh represents the traversable area of a map and gives
 * utilities for pathfinding.
 * Usage:
 * ```javascript
 * // Assuming the 2d map tiles array is available:
 * var navmesh = new NavMesh(map);
 * navmesh.calculatePath(currentlocation, targetLocation, callback);
 * ```
 * @module NavMesh
 */
define(['./polypartition', './parse-map', './pathfinder', './lib/clipper', './worker!./aStarWorker.js'],
function(  pp,                MapParser,     Pathfinder,     ClipperLib,     workerPromise) {
  var Point = pp.Point;
  var Poly = pp.Poly;
  var Edge = pp.Edge;
  var PolyUtils = pp.PolyUtils;
  
  /**
   * @constructor
   * @alias module:NavMesh
   * @param {MapTiles} map - The 2d array defining the map tiles.
   * @param {Logger} [logger] - The logger to use.
   */
  var NavMesh = function(map, logger) {
    if (typeof logger == 'undefined') {
      logger = {};
      logger.log = function() {};
    }
    this.logger = logger;

    this.initialized = false;

    this.updateFuncs = [];

    this._setupWorker();
    
    // Parse map tiles into polygons.
    var polys = MapParser.parse(map);
    if (!polys) {
      throw "Map parsing failed!";
    }

    // Track map state.
    this.map = JSON.parse(JSON.stringify(map));

    // Initialize navmesh.
    this._init(polys);
  };

  /**
   * Callback for path calculation requests.
   * @callback PathCallback
   * @param {?Array.<PointLike>} - The calculated path beginning with
   *   the start point, and ending at the target point. If no path is
   *   found then null is passed to the callback.
   */

  /**
   * Calculate a path from the source point to the target point, invoking
   * the callback with the path after calculation.
   * @param {PointLike} source - The start location of the search.
   * @param {PointLike} target - The target of the search.
   * @param {PathCallback} callback - The callback function invoked
   *   when the path has been calculated.
   */
  NavMesh.prototype.calculatePath = function(source, target, callback) {
    this.logger.log("navmesh:debug", "Calculating path.");

    // Use web worker if present.
    if (this.worker && this.workerInitialized) {
      this.logger.log("navmesh:debug", "Using worker to calculate path.");
      this.worker.postMessage(["aStar", source, target]);
      // Set callback so it is accessible when results are sent back.
      this.lastCallback = callback;
    } else {
      source = Point.fromPointLike(source);
      target = Point.fromPointLike(target);
      path = this.pathfinder.aStar(source, target);
      callback(path);
    }
  };

  /**
   * Check whether one point is visible from another, without being
   * blocked by obstacles.
   * @param {PointLike} p1 - The first point.
   * @param {PointLike} p2 - The second point.
   * @return {boolean} - Whether `p1` is visible from `p2`.
   */
  NavMesh.prototype.checkVisible = function(p1, p2) {
    var edge = new Edge(Point.fromPointLike(p1), Point.fromPointLike(p2));
    var blocked = this.obstacle_edges.some(function(e) {return e.intersects(edge);});
    return !blocked;
  };

  /**
   * Ensure that passed function is executed when the navmesh has been
   * fully initialized.
   * @param {Function} fn - The function to call when the navmesh is
   *   initialized.
   */
  NavMesh.prototype.onInit = function(fn) {
    if (this.initialized) {
      fn();
    } else {
      setTimeout(function() {
        this.onInit(fn);
      }.bind(this), 10);
    }
  };

  /**
   * @typedef TileUpdate
   * @type {object}
   * @property {integer} x - The x index of the tile to update in the
   *   original map array.
   * @property {integer} y - The y index of the tile to update in the
   *   original map array.
   * @property {(number|string)} v - The new value for the tile.
   */

  /**
   * Takes an array of tiles and updates the navigation mesh to reflect
   * the newly traversable area. This should be set as a listener to
   * `mapupdate` socket events.
   * @param {Array.<TileUpdate>} - Information on the tiles updates.
   */
  NavMesh.prototype.mapUpdate = function(data) {
    // Check the passed values.
    var error = false;
    // Hold updated tile locations.
    var updates = [];
    data.forEach(function(update) {
      // Update internal map state.
      this.map[update.x][update.y] = update.v;
      if (error) return;
      var tileId = update.v;
      var locId = Point.toString(update);
      var passable = this._isPassable(tileId);
      var currentLocState = this.obstacle_state[locId];
      // All dynamic tile locations should be defined.
      if (typeof currentLocState == 'undefined') {
        error = true;
        this.logger.log("navmesh:error",
          "Dynamic obstacle found but not already initialized.");
        return;
      } else {
        if (passable == currentLocState) {
          // Nothing to do here.
          return;
        } else {
          this.obstacle_state[locId] = passable;
          // Track whether update is making the tiles passable or
          // impassable.
          update.passable = passable;
          updates.push(update);
        }
      }
    }, this);

    if (error) {
      return;
    }

    // Check that we have updates to carry out.
    if (updates.length > 0) {
      // See whether this is an update from passable to impassable
      // or vice-versa.
      var passable = updates[0].passable;

      // Ensure that they all have the same update type.
      updates.forEach(function(update) {
        if (update.passable !== passable) {
          error = true;
        }
      }, this);
      if (error) {
        this.logger.log("navmesh:error",
          "Not all updates of same type.");
        return;
      }
      // Passable/impassable-specific update functions.
      if (passable) {
        this._passableUpdate(updates);
      } else {
        this._impassableUpdate(updates);
      }
    }
  };

  /**
   * Set up the navmesh to listen to the relevant socket.
   * @param  {Socket} socket - The socket to listen on for `mapupdate`
   *   packets.
   */
  NavMesh.prototype.listen = function(socket) {
    socket.on("mapupdate", this.mapUpdate.bind(this));
  };

  /**
   * A function called when the navigation mesh updates.
   * @callback UpdateCallback
   * @param {Array.<Poly>} - The polys defining the current navigation
   *   mesh.
   * @param {Array.<Poly>} - The polys that were added to the mesh.
   * @param {Array.<integer>} - The indices of the polys that were
   *   removed from the mesh.
   */

  /**
   * Register a function to be called when the navigation mesh updates.
   * @param {UpdateCallback} fn - The function to be called.
   */
  NavMesh.prototype.onUpdate = function(fn) {
    this.updateFuncs.push(fn);
  };

  /**
   * Set specific tile identifiers as impassable to the agent.
   * @param {Array.<number>} ids - The tile ids to set as impassable.
   * @param {string} obstacle - The identifier for the polygon for the
   *   obstacles (already passed to addObstaclePoly).
   */
  NavMesh.prototype.setImpassable = function(ids) {
    // Remove ids already set as impassable.
    ids = ids.filter(function(id) {
      return this._isPassable(id);
    }, this);
    this.logger.log("navmesh:debug", "Ids passed:", ids);

    var updates = [];
    // Check if any of the dynamic tiles have the values passed.
    this.dynamic_obstacle_locations.forEach(function(loc) {
      var idx = ids.indexOf(this.map[loc.x][loc.y]);
      if (idx !== -1) {
        updates.push({
          x: loc.x,
          y: loc.y,
          v: ids[idx]
        });
      }
    }, this);

    // Add to list of impassable tiles.
    ids.forEach(function(id) {
      this.impassable[id] = true;
    }, this);

    if (updates.length > 0) {
      this.mapUpdate(updates);
    }
  };

  /**
   * Remove tile identifiers from set of impassable tile types.
   * @param {Array.<number>} ids - The tile ids to set as traversable.
   */
  NavMesh.prototype.removeImpassable = function(ids) {
    // Remove ids not set as impassable.
    ids = ids.filter(function(id) {
      return !this._isPassable(id);
    }, this);

    var updates = [];
    // Check if any of the dynamic tiles have the values passed.
    this.dynamic_obstacle_locations.forEach(function(loc) {
      var idx = ids.indexOf(this.map[loc.x][loc.y]);
      if (idx !== -1) {
        updates.push({
          x: loc.x,
          y: loc.y,
          v: ids[idx]
        });
      }
    }, this);

    // Remove from list of impassable tiles.
    ids.forEach(function(id) {
      this.impassable[id] = false;
    }, this);

    if (updates.length > 0) {
      this.mapUpdate(updates);
    }
  };

  /**
   * Initialize the navigation mesh with the polygons describing the
   * map elements.
   * @private
   * @param {ParsedMap} - The map information parsed into polygons.
   */
  NavMesh.prototype._init = function(parsedMap) {
    // Save original parsed map polys.
    this.parsedMap = parsedMap;

    // Static objects relative to the navmesh.
    var navigation_static_objects = {
      walls: parsedMap.walls,
      obstacles: parsedMap.static_obstacles
    }
    var navigation_dynamic_objects = parsedMap.dynamic_obstacles;

    // Offset polys from side so they represent traversable area.
    var areas = this._offsetPolys(navigation_static_objects);

    this.polys = areas.map(NavMesh._geometry.partitionArea);
    this.polys = NavMesh._util.flatten(this.polys);

    if (!this.worker) {
      this.pathfinder = new Pathfinder(this.polys);
    }

    this._setupDynamicObstacles(navigation_dynamic_objects);

    
    // Hold the edges of static obstacles.
    this.static_obstacle_edges = [];
    areas.forEach(function(area) {
      var polys = [area.polygon].concat(area.holes);
      polys.forEach(function(poly) {
        for (var i = 0, j = poly.numpoints - 1; i < poly.numpoints; j = i++) {
          this.static_obstacle_edges.push(new Edge(poly.points[j], poly.points[i]));
        }
      }, this);
    }, this);

    // Holds the edges of static and dynamic obstacles.
    this.obstacle_edges = this.static_obstacle_edges.slice();

    this.initialized = true;
  };

  /**
   * Set up mesh-dynamic obstacles.
   * @private
   */
  NavMesh.prototype._setupDynamicObstacles = function(obstacles) {
    // Holds tile id<->impassable (boolean) associations.
    this.impassable = {};
    // Polygons defining obstacles.
    this.obstacleDefinitions = {};
    // Relation between ids and obstacles.
    this.idToObstacles = {};

    var geo = NavMesh._geometry;

    // Add polygons describing dynamic obstacles.
    this._addObstaclePoly("bomb", geo.getApproximateCircle(15));
    this._addObstaclePoly("boost", geo.getApproximateCircle(15));
    this._addObstaclePoly("portal", geo.getApproximateCircle(15));
    this._addObstaclePoly("spike", geo.getApproximateCircle(14));
    this._addObstaclePoly("gate", geo.getSquare(20));
    this._addObstaclePoly("tile", geo.getSquare(20));
    this._addObstaclePoly("wall", geo.getSquare(20));
    this._addObstaclePoly("sewall", geo.getDiagonal(20, "se"));
    this._addObstaclePoly("newall", geo.getDiagonal(20, "ne"));
    this._addObstaclePoly("swwall", geo.getDiagonal(20, "sw"));
    this._addObstaclePoly("nwwall", geo.getDiagonal(20, "nw"));

    // Add id<->type associations.
    this._setObstacleType([10, 10.1], "bomb");
    this._setObstacleType([5, 5.1, 14, 14.1, 15, 15.1], "boost");
    this._setObstacleType([9, 9.1, 9.2, 9.3], "gate");
    this._setObstacleType([1], "wall");
    this._setObstacleType([1.1], "swwall");
    this._setObstacleType([1.2], "nwwall");
    this._setObstacleType([1.3], "newall");
    this._setObstacleType([1.4], "sewall");
    this._setObstacleType([7], "spike");

    // Set up obstacle state container. Holds whether position is
    // passable or not. Referenced using array location.
    this.obstacle_state = {};

    // Location of dynamic obstacles.
    this.dynamic_obstacle_locations = [];

    // Edges of offsetted obstacled, organized by id.
    this.dynamic_obstacle_polys = {};

    // Container to hold initial obstacle states.
    var initial_states = [];
    obstacles.forEach(function(obstacle) {
      var id = Point.toString(obstacle);

      // Generate offset obstacle.
      var obs = this._offsetDynamicObs([this._getTilePoly(obstacle)]);
      var areas = NavMesh._geometry.getAreas(obs);
      areas = areas.map(function(area) {
        area.holes.push(area.polygon);
        return area.holes;
      });
      areas = NavMesh._util.flatten(areas);
      // Get edges of obstacle.
      var edges = areas.map(function(poly) {
        return poly.edges();
      });
      edges = NavMesh._util.flatten(edges);
      this.dynamic_obstacle_polys[id] = edges;

      // Initialize obstacle states to all be passable.
      this.obstacle_state[id] = true;
      this.dynamic_obstacle_locations.push(Point.fromPointLike(obstacle));
      initial_states.push(obstacle);
    }, this);

    // Set up already-known dynamic impassable values.
    this.setImpassable([10, 5, 9.1]);
    // Walls and spikes.
    this.setImpassable([1, 1.1, 1.2, 1.3, 1.4, 7]);

    // Set up callback to regenerate obstacle edges for visibility checking.
    this.onUpdate(function(polys) {
      var obstacle_edges = [];
      for (id in this.obstacle_state) {
        if (!this.obstacle_state[id]) {
          Array.prototype.push.apply(
            obstacle_edges,
            this.dynamic_obstacle_polys[id]);
        }
      }
      this.obstacle_edges = this.static_obstacle_edges.concat(obstacle_edges);
    }.bind(this));

    // Initialize mapupdate with already-present dynamic obstacles.
    this.mapUpdate(initial_states);
  };

  /**
   * Add poly definition for obstacle type.
   * edges should be relative to center of tile.
   * @private
   */
  NavMesh.prototype._addObstaclePoly = function(name, poly) {
    this.obstacleDefinitions[name] = poly;
  };

  /**
   * Retrieve the polygon for a given obstacle id.
   * @private
   * @param {number} id - The id to retrieve the obstacle polygon for.
   * @return {Poly} - The polygon representing the obstacle.
   */
  NavMesh.prototype._getObstaclePoly = function(id) {
    var poly = this.obstacleDefinitions[this.idToObstacles[id]]
    if (poly) {
      return poly.clone();
    } else {
      this.logger.log("navmesh:debug", "No poly found for id:", id);
    }
  };

  /**
   * Update the navigation mesh to the given polys and call the update
   * functions.
   * @private
   * @param {Array.<Poly>} polys - The new polys defining the nav mesh.
   * @param {Array.<Poly>} added - The polys that were added to the mesh.
   * @param {Array.<integer>} removed - The indices of the polys that were
   *   removed from the mesh.
   */
  NavMesh.prototype._update = function(polys, added, removed) {
    this.polys = polys;
    this.updateFuncs.forEach(function(fn) {
      setTimeout(function() {
        fn(this.polys, added, removed);
      }.bind(this), 0);
    }, this);
  };

  /**
   * Set the relationship between specific tile identifiers and the
   * polygons representing the shape of the obstacle they correspond
   * to.
   * @private
   * @param {Array.<number>} ids - The tile ids to set as impassable.
   * @param {string} obstacle - The identifier for the polygon for the
   *   obstacles (already passed to addObstaclePoly).
   */
  NavMesh.prototype._setObstacleType = function(ids, type) {
    ids.forEach(function(id) {
      this.idToObstacles[id] = type;
    }, this);
  };

  /**
   * Check whether the provided id corresponds to a passable tile.
   * @return {boolean} - Whether the id is for a passable tile.
   */
  NavMesh.prototype._isPassable = function(id) {
    // Check if in list of impassable tiles.
    return !this.impassable.hasOwnProperty(id) || !this.impassable[id];
  };

  /**
   * Get a polygon corresponding to the dimensions and location of the
   * provided tile update.
   * @private
   * @param {TileUpdate} tile - The tile update information.
   * @return {Poly} - The polygon representing the tile.
   */
  NavMesh.prototype._getTilePoly = function(tile) {
    // Get the base poly from a list of such things by tile id
    // then translate according to the array location.
    var id = tile.v;
    var p = this._getWorldCoord(tile);
    var poly = this._getObstaclePoly(id).translate(p);
    return poly;
  };

  /**
   * Represents a point in space or a location in a 2d array.
   * @typedef PointLike
   * @type {object}
   * @property {number} x - The `x` coordinate for the point, or row
   *   for the array location.
   * @property {number} y - The `y` coordinate for the point. or column
   *   for the array location.
   */

  /**
   * Given an array location, return the world coordinate representing
   * the center point of the tile at that array location.
   * @private
   * @param {PointLike} arrayLoc - The location in the map for the point.
   * @returm {Point} - The coordinates for the center of the location.
   */
  NavMesh.prototype._getWorldCoord = function(arrayLoc) {
    var TILE_WIDTH = 40;
    return new Point(
      arrayLoc.x * TILE_WIDTH + (TILE_WIDTH / 2),
      arrayLoc.y * TILE_WIDTH + (TILE_WIDTH / 2)
    );
  };

  /**
   * Carry out the navmesh update for impassable dynamic obstacles that
   * have been removed from the navmesh.
   * @private
   * @param {Array.<TileUpdate>} updates - The tile update information.
   */
  NavMesh.prototype._passableUpdate = function(updates) {
    var scale = 100;
    // Assume each of the tiles is now a square of open space.
    var passableTiles = updates.map(function(update) {
      return this._getTilePoly({
        x: update.x,
        y: update.y,
        v: 1
      });
    }, this);

    // Offset and merge newly passable tiles, assuming no tile along
    // with its offset would have been larger than a single tile.
    // Set offset slightly larger that normal so that we catch all
    // relevant polygons that need to be updated in the navmesh.
    var passableArea = this._offsetDynamicObs(passableTiles, 20);

    var cpr = NavMesh._geometry.cpr;

    // Get impassable tiles bordering the now-passable area and offset them.
    var borderingTiles = this._getBorderedTiles(updates);
    var borderingPolys = borderingTiles.map(this._getTilePoly, this);
    var surroundingArea = this._offsetDynamicObs(borderingPolys);

    // Get difference between the open area and the surrounding obstacles.
    cpr.Clear();
    var actualPassableArea = new ClipperLib.Paths();
    cpr.AddPaths(passableArea, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(surroundingArea, ClipperLib.PolyType.ptClip, true);
    cpr.Execute(ClipperLib.ClipType.ctDifference,
      actualPassableArea,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero
    );

    var passableAreas = NavMesh._geometry.getAreas(actualPassableArea, scale);

    var passablePartition = NavMesh._geometry.partitionAreas(passableAreas);

    // Get mesh polys intersected by offsetted passable area.
    var intersection = this._getIntersectedPolys(passablePartition);
    var intersectedMeshPolys = intersection.polys;

    // Create outline with matched mesh polys.
    intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);

    // Merge intersected mesh polys and with newly passable area.
    cpr.Clear();
    cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(actualPassableArea, ClipperLib.PolyType.ptSubject, true);
    var newMeshArea = new ClipperLib.Paths();
    cpr.Execute(
      ClipperLib.ClipType.ctUnion,
      newMeshArea,
      ClipperLib.PolyFillType.pftNonZero,
      null);

    // Partition the unioned mesh polys and new passable area and add
    // to the existing mesh polys.
    var meshAreas = NavMesh._geometry.getAreas(newMeshArea, scale);
    var newPolys = NavMesh._geometry.partitionAreas(meshAreas);
    Array.prototype.push.apply(this.polys, newPolys);

    this._update(this.polys, newPolys, intersection.indices);
  };

  /**
   * Carry out the navmesh update for impassable dynamic obstacles that
   * have been added to the navmesh.
   * @private
   * @param {Array.<TileUpdate>} updates - The tile update information.
   */
  NavMesh.prototype._impassableUpdate = function(updates) {
    var scale = 100;
    // Get polygons defining these obstacles.
    var obstaclePolys = updates.map(function(update) {
      return this._getTilePoly(update);
    }, this);

    // Offset the obstacle polygons.
    var offsettedObstacles = this._offsetDynamicObs(obstaclePolys);
    var obstacleAreas = NavMesh._geometry.getAreas(offsettedObstacles);

    // Get convex partition of new obstacle areas for finding
    // intersections.
    var obstaclePartition = NavMesh._geometry.partitionAreas(obstacleAreas);

    // Get mesh polys intersected by offsetted obstacles.
    var intersection = this._getIntersectedPolys(obstaclePartition);
    var intersectedMeshPolys = intersection.polys;

    // Create outline with matched mesh polys.
    intersectedMeshPolys = intersectedMeshPolys.map(NavMesh._geometry.convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(intersectedMeshPolys, scale);
    var cpr = NavMesh._geometry.cpr;

    // Merge matched polys
    cpr.Clear();
    cpr.AddPaths(intersectedMeshPolys, ClipperLib.PolyType.ptSubject, true);
    var mergedMeshPolys = new ClipperLib.Paths();
    cpr.Execute(
      ClipperLib.ClipType.ctUnion,
      mergedMeshPolys,
      ClipperLib.PolyFillType.pftNonZero,
      null);

    // Take difference of mesh polys and obstacle polys.
    var paths = new ClipperLib.Paths();
    cpr.Clear();
    cpr.AddPaths(mergedMeshPolys, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPaths(offsettedObstacles, ClipperLib.PolyType.ptClip, true);

    cpr.Execute(ClipperLib.ClipType.ctDifference,
      paths,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero
    );

    var areas = NavMesh._geometry.getAreas(paths, scale);
    // Make polys from new space.
    var polys = NavMesh._geometry.partitionAreas(areas);

    // Add to existing polygons.
    Array.prototype.push.apply(this.polys, polys);

    this._update(this.polys, polys, intersection.indices);
  };

  /**
   * Offsetting function for dynamic obstacles.
   * @private
   * @param {Array.<Poly>} obstacles
   * @param {number} [offset=16]
   * @return {Array.<Poly>}
   */
  NavMesh.prototype._offsetDynamicObs = function(obstacles, offset) {
    if (typeof offset == 'undefined') offset = 16;
    var scale = 100;
    obstacles = obstacles.map(NavMesh._geometry.convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(obstacles, scale);

    var cpr = NavMesh._geometry.cpr;
    var co = NavMesh._geometry.co;

    // Merge obstacles together, so obstacles that share a common edge
    // will be expanded properly.
    cpr.Clear();
    cpr.AddPaths(obstacles, ClipperLib.PolyType.ptSubject, true);
    var merged_obstacles = new ClipperLib.Paths();
    cpr.Execute(
      ClipperLib.ClipType.ctUnion,
      merged_obstacles,
      ClipperLib.PolyFillType.pftNonZero,
      null);

    // Offset obstacles.
    var offsetted_paths = new ClipperLib.Paths();

    merged_obstacles.forEach(function(obstacle) {
      var offsetted_obstacle = new ClipperLib.Paths();
      co.Clear();
      co.AddPath(obstacle, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
      co.Execute(offsetted_obstacle, offset * scale);
      offsetted_paths.push(offsetted_obstacle[0]);
    });

    // Merge any newly-overlapping obstacles.
    cpr.Clear();
    cpr.AddPaths(offsetted_paths, ClipperLib.PolyType.ptSubject, true);
    merged_obstacles = new ClipperLib.Paths();
    cpr.Execute(
      ClipperLib.ClipType.ctUnion,
      merged_obstacles,
      ClipperLib.PolyFillType.pftNonZero,
      null);
    return merged_obstacles;
  };

  /**
   * Get and remove the mesh polygons impacted by the addition of new
   * obstacles. The provided obstacles should already be offsetted.
   * @private
   * @param {Array.<Poly>} obstacles - The offsetted obstacles to get
   *   the intersection of. Must be convex.
   * @return {Array.<Poly>} - The affected polys.
   */
  NavMesh.prototype._getIntersectedPolys = function(obstacles) {
    var intersectedIndices = NavMesh._geometry.getIntersections(obstacles, this.polys);
    return {
      indices: intersectedIndices,
      polys: NavMesh._util.splice(this.polys, intersectedIndices)
    };
  };

  /**
   * Get the impassable tiles bordering updated passable tiles.
   * @private
   * @param {Array.<TileUpdate>} tiles - The updated passable tiles.
   * @return {Array.<ArrayLoc>} - The new array locations.
   */
  NavMesh.prototype._getBorderedTiles = function(tiles) {
    // Track locations already being updated or added.
    var locations = {};
    tiles.forEach(function(tile) {
      locations[Point.toString(tile)] = true;
    });

    var map = this.map;
    var xUpperBound = map.length;
    var yUpperBound = map[0].length;
    // Get the locations adjacent to a given tile in the map.
    var getAdjacent = function(tile) {
      var x = tile.x;
      var y = tile.y;
      var xUp = x + 1 < xUpperBound;
      var xDown = x >= 0;
      var yUp = y + 1 < yUpperBound;
      var yDown = y >= 0;

      var adjacents = [];
      if (xUp) {
        adjacents.push({x: x + 1, y: y});
        if (yUp) {
          adjacents.push({x: x + 1, y: y + 1});
        }
        if (yDown) {
          adjacents.push({x: x + 1, y: y - 1});
        }
      }
      if (xDown) {
        adjacents.push({x: x - 1, y: y});
        if (yUp) {
          adjacents.push({x: x - 1, y: y + 1});
        }
        if (yDown) {
          adjacents.push({x: x - 1, y: y - 1});
        }
      }
      if (yUp) {
        adjacents.push({x: x, y: y + 1});
      }
      if (yDown) {
        adjacents.push({x: x, y: y - 1});
      }
      return adjacents;
    };

    // Store adjacent impassable tiles.
    var adjacent_tiles = [];
    tiles.forEach(function(tile) {
      var adjacents = getAdjacent(tile);
      adjacents.forEach(function(adjacent) {
        var id = Point.toString(adjacent);
        if (!locations[id]) {
          // Record as having been seen.
          locations[id] = true;
          var val = this.map[adjacent.x][adjacent.y];
          if (!this._isPassable(val)) {
            adjacent.v = val;
            adjacent_tiles.push(adjacent);
          }
        }
      }, this);
    }, this);
    return adjacent_tiles;
  };

  /**
   * Represents the outline of a shape along with its holes.
   * @typedef MapArea
   * @type {object}
   * @property {Poly} polygon - The polygon defining the exterior of
   *   the shape.
   * @property {Array.<Poly>} holes - The holes of the shape.
   */

  /**
   * Offset the polygons such that there is a `offset` unit buffer
   * between the sides of the outline and around the obstacles. This
   * buffer makes it so that the mesh truly represents the movable area
   * in the map. Assumes vertices defining interior shapes (like the
   * main outline of an enclosed map) are given in CCW order and
   * obstacles are given in CW order.
   * @private
   * @param {Array.<Poly>} polys - The polygons to offset.
   * @param {number} [offset=16] - The amount to offset the polygons
   *   from the movable areas.
   * @return {Array.<MapArea>} - The shapes defining the polygons after
   *   offsetting and merging.
   */
  NavMesh.prototype._offsetPolys = function(static_objects, offset) {
    // ~= ball radius / 2
    if (typeof offset == 'undefined') offset = 16;

    // Separate interior and exterior walls. The CCW shapes correspond
    // to the interior wall outlines of out map, the CW shapes are walls
    // that were traced on their outside.
    var interior_walls = [];
    var exterior_walls = static_objects.walls.filter(function(poly, index) {
      if (poly.getOrientation() == "CCW") {
        interior_walls.push(poly);
        return false;
      }
      return true;
    });

    var scale = 100;
    
    // Offset the interior walls.
    interior_walls = interior_walls.map(NavMesh._geometry.convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(interior_walls, scale);
    
    var offsetted_interior_walls = [];
    interior_walls.forEach(function(wall) {
      var offsetted_paths = NavMesh._geometry.offsetInterior(wall, offset);
      Array.prototype.push.apply(offsetted_interior_walls, offsetted_paths);
    });

    // Reverse paths since from here on we're going to treat the
    // outlines as the exterior of a shape.
    offsetted_interior_walls.forEach(function(path) {
      path.reverse();
    });
    
    exterior_walls = exterior_walls.map(NavMesh._geometry.convertPolyToClipper);

    ClipperLib.JS.ScaleUpPaths(exterior_walls, scale);

    //var cpr = new ClipperLib.Clipper();
    var cpr = NavMesh._geometry.cpr;
    var co = NavMesh._geometry.co;
    
    var wall_fillType = ClipperLib.PolyFillType.pftEvenOdd;
    var obstacle_fillType = ClipperLib.PolyFillType.pftNonZero;
    
    // Offset exterior walls.
    var offsetted_exterior_walls = [];

    exterior_walls.forEach(function(wall) {
      var offsetted_exterior_wall = new ClipperLib.Paths();
      co.Clear();
      co.AddPath(wall, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
      co.Execute(offsetted_exterior_wall, offset * scale);
      offsetted_exterior_walls.push(offsetted_exterior_wall[0]);
    });
    
    // Offset obstacles.
    // Obstacles are offsetted using miter join type to avoid
    // unnecessary small edges.
    var offsetted_obstacles = new ClipperLib.Paths();

    var obstacles = static_objects.obstacles.map(NavMesh._geometry.convertPolyToClipper);
    ClipperLib.JS.ScaleUpPaths(obstacles, scale);
    co.Clear();
    co.AddPaths(obstacles, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_obstacles, offset * scale);

    // Take difference of polygons defining interior wall and polygons
    // defining exterior walls, limiting to exterior wall polygons whose
    // area is less than the interior wall polygons so the difference
    // operation doesn't remove potentially traversable areas.
    var merged_paths = [];
    offsetted_interior_walls.forEach(function(wall) {
      var area = ClipperLib.JS.AreaOfPolygon(wall, scale);
      var smaller_exterior_walls = offsetted_exterior_walls.filter(function(ext_wall) {
        return ClipperLib.JS.AreaOfPolygon(ext_wall, scale) < area;
      });
      var paths = new ClipperLib.Paths();
      cpr.Clear();
      cpr.AddPath(wall, ClipperLib.PolyType.ptSubject, true);
      cpr.AddPaths(smaller_exterior_walls, ClipperLib.PolyType.ptClip, true);
      // Obstacles are small individual solid objects that aren't at
      // risk of enclosing an interior area.
      cpr.AddPaths(offsetted_obstacles, ClipperLib.PolyType.ptClip, true);
      cpr.Execute(ClipperLib.ClipType.ctDifference,
        paths,
        ClipperLib.PolyFillType.pftNonZero,
        ClipperLib.PolyFillType.pftNonZero
      );
      Array.prototype.push.apply(merged_paths, paths);
    });

    return NavMesh._geometry.getAreas(merged_paths, scale);
  }

  /**
   * Sets up callbacks on the web worker promise object to initialize
   * the web worker interface once loaded.
   * @private
   */
  NavMesh.prototype._setupWorker = function() {
    // Initial state.
    this.worker = false;
    this.workerInitialized = false;

    // Set callbacks for worker promise object.
    workerPromise.then(function(worker) {
      this.logger.log("navmesh:debug", "Worker promise returned.");
      this.worker = worker;
      this.worker.onmessage = this._getWorkerInterface();
      // Check if worker is already initialized.
      this.worker.postMessage(["isInitialized"]);
    }.bind(this), function(Error) {
      this.logger.log("navmesh:warn", "No worker, falling back to in-thread computation.");
      this.logger.log("navmesh:warn", "Worker error:", Error);
      this.worker = false;
    }.bind(this));

    // Set up callback to update worker on navmesh update.
    this.onUpdate(function(disregard, newPolys, removedIndices) {
      if (this.worker && this.workerInitialized) {
        this.worker.postMessage(["polyUpdate", newPolys, removedIndices]);
      } else {
        this.logger.log("navmesh:debug", "Worker not loaded yet.");
      }
    }.bind(this));
  };

  /**
   * Handler for log messages sent by worker.
   * @private
   * @param {Array.<(string|object)>} message - Array of arguments to
   *   pass to `Logger.log`. The first element should be the group to
   *   associate the message with.
   */
  NavMesh.prototype._workerLogger = function(message) {
    this.logger.log.apply(null, message);
  }

  /**
   * Returns the function to be used for the `onmessage` callback for
   * the web worker.
   * @private
   * @return {Function} - The `onmessage` handler for the web worker.
   */
  NavMesh.prototype._getWorkerInterface = function() {
    return function(message) {
      var data = message.data;
      var name = data[0];

      // Output debug message for all messages received except "log"
      // messages.
      if (name !== "log")
        this.logger.log("navmesh:debug", "Message received from worker:", data);

      if (name == "log") {
        this._workerLogger(data.slice(1));
      } else if (name == "result") {
        var path = data[1];
        this.lastCallback(path);
      } else if (name == "initialized") {
        this.workerInitialized = true;
        // Send parsed map polygons to worker when available.
        this.onInit(function() {
          this.worker.postMessage(["polys", this.polys]);
        }.bind(this));
      }
    }.bind(this);
  };

  /**
   * Make utilities in polypartition available without requiring
   * that it be included in external scripts.
   */
  NavMesh.poly = pp;

  /**
   * Hold methods used for generating the navigation mesh.
   * @private
   */
  NavMesh._geometry = {};

  /**
   * Initialized Clipper for operations.
   * @private
   * @type {ClipperLib.Clipper}
   */
  NavMesh._geometry.cpr = new ClipperLib.Clipper();

  /**
   * Initialized ClipperOffset for operations.
   * @private
   * @type {ClipperLib.ClipperOffset}
   */
  NavMesh._geometry.co = new ClipperLib.ClipperOffset();

  // Defaults.
  NavMesh._geometry.co.MiterLimit = 2;
  NavMesh._geometry.scale = 100;

  /**
   * Get a polygonal approximation of a circle of a given radius
   * centered at the provided point. Vertices of polygon are in CW
   * order.
   * @private
   * @param {number} radius - The radius for the polygon.
   * @param {Point} [point] - The point at which to center the polygon.
   *   If a point is not provided then the polygon is centered at the
   *   origin.
   * @return {Poly} - The approximated circle.
   */
  NavMesh._geometry.getApproximateCircle = function(radius, point) {
    var x, y;
    if (point) {
      x = point.x;
      y = point.y;
    } else {
      x = 0;
      y = 0;
    }
    var offset = radius * Math.tan(Math.PI / 8);
    offset = Math.round10(offset, -1);
    var poly = new Poly([
      new Point(x - radius, y - offset),
      new Point(x - radius, y + offset),
      new Point(x - offset, y + radius),
      new Point(x + offset, y + radius),
      new Point(x + radius, y + offset),
      new Point(x + radius, y - offset),
      new Point(x + offset, y - radius),
      new Point(x - offset, y - radius)
    ]);
    return poly;
  };

  /**
   * Returns a square with side length given by double the provided
   * radius, centered at the origin. Vertices of polygon are in CW
   * order.
   * @private
   * @param {number} radius - The length of half of one side.
   * @return {Poly} - The constructed square.
   */
  NavMesh._geometry.getSquare = function(radius) {
    var poly = new Poly([
      new Point(-radius, radius),
      new Point(radius, radius),
      new Point(radius, -radius),
      new Point(-radius, -radius)
    ]);
    return poly;
  };

  /**
   * Get the upper or lower diagonal of a square of the given
   * radius. 
   * @private
   * @param {number} radius - The length of half of one side of the
   *   square to get the diagonal of.
   * @param {string} corner - One of ne, se, nw, sw indicating which
   *   corner should be filled.
   * @return {Poly} - The diagonal shape.
   */
  NavMesh._geometry.getDiagonal = function(radius, corner) {
    var types = {
      "ne": [[radius, -radius], [radius, radius], [-radius, -radius]],
      "se": [[radius, radius], [-radius, radius], [radius, -radius]],
      "sw": [[-radius, radius], [-radius, -radius], [radius, radius]],
      "nw": [[-radius, -radius], [radius, -radius], [-radius, radius]]
    };
    var points = types[corner].map(function(mul) {
      return new Point(mul[0], mul[1]);
    });
    return new Poly(points);
  };

  /**
   * Given two sets of polygons, return indices of the ones in the blue
   * set that are intersected by ones in red.
   * @private
   * @param {Array.<Poly>} red
   * @param {Array.<Poly>} blue
   * @return {Array.<integer>} - The indices of the intersected blue
   *   polys.
   */
  NavMesh._geometry.getIntersections = function(red, blue) {
    var indices = [];
    // Naive solution.
    blue.forEach(function(poly, i) {
      var intersects = red.some(function(polyb) {
        return poly.intersects(polyb);
      });
      if (intersects) {
        indices.push(i);
      }
    });
    return indices;
  };

  /**
   * An Area is an object that holds a polygon representing a space
   * along with its holes. An Area can represent, for example, a
   * traversable region, if we consider the non-hole area of the
   * polygon as being traversable, or the opposite, if we consider
   * the non-hole area as being solid, blocking movement.
   * @typedef Area
   * @type {object}
   * @property {Poly} polygon - The polygon defining the outside of the
   *   area.
   * @property {Array.<Poly>} holes - The holes in the polygon for this
   *   area.
   */
  /**
   * Given a PolyTree, return an array of areas assuming even-odd fill
   * ordering.
   * @private
   * @param {ClipperLib.Paths} paths - The paths output from some
   *   operation. Paths should be non-overlapping, i.e. the edges of
   *   represented polygons should not be overlapping, but polygons
   *   may be fully contained in one another. Paths should already
   *   be scaled up.
   * @param {integer} [scale=100] - The scale to use when bringing the
   *   Clipper paths down to size.
   * @return {Array.<Area>} - The areas represented by the polytree.
   */
  NavMesh._geometry.getAreas = function(paths, scale) {
    if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;
    // We are really only concerned with getting the paths into a
    // polytree structure.
    var cpr = NavMesh._geometry.cpr;
    cpr.Clear();
    cpr.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
    var unioned_shapes_polytree = new ClipperLib.PolyTree();
    cpr.Execute(
      ClipperLib.ClipType.ctUnion,
      unioned_shapes_polytree,
      ClipperLib.PolyFillType.pftEvenOdd,
      null);

    var areas = [];

    var outer_polygons = unioned_shapes_polytree.Childs();

    // Organize shapes into their outer polygons and holes, assuming
    // that the first layer of polygons in the polytree represent the
    // outside edge of the desired areas.
    for (var i = 0; i < outer_polygons.length; i++) {
      var outer_polygon = outer_polygons[i];
      var contour = outer_polygon.Contour();
      ClipperLib.JS.ScaleDownPath(contour, scale);
      var area = {
        polygon: contour,
        holes: []
      }

      outer_polygon.Childs().forEach(function(child) {
        var contour = child.Contour();
        ClipperLib.JS.ScaleDownPath(child.Contour(), scale);
        // Add as a hole.
        area.holes.push(contour);

        // Add children as additional outer polygons to be expanded.
        child.Childs().forEach(function(child_outer) {
          outer_polygons.push(child_outer);
        });
      });
      areas.push(area);
    }
    
    // Convert Clipper Paths to Polys.
    areas.forEach(function(area) {
      area.polygon = NavMesh._geometry.convertClipperToPoly(area.polygon);
      area.holes = area.holes.map(NavMesh._geometry.convertClipperToPoly);
    });

    return areas;
  };

  /**
   * Offset a polygon inwards (as opposed to deflating it). The polygon
   * vertices should be in CCW order and the polygon should already be
   * scaled.
   * @private
   * @param {CLShape} shape - The shape to inflate inwards.
   * @param {number} offset - The amount to offset the shape.
   * @param {integer} [scale=100] - The scale for the operation.
   * @return {ClipperLib.Paths} - The resulting shape from offsetting.
   *   If the process of offsetting resulted in the interior shape
   *   closing completely, then an empty array will be returned. The
   *   returned shape will still be scaled up, for use in other
   *   operations.
   */
  NavMesh._geometry.offsetInterior = function(shape, offset, scale) {
    if (typeof scale == 'undefined') scale = NavMesh._geometry.scale;

    var cpr = NavMesh._geometry.cpr;
    var co = NavMesh._geometry.co;

    // First, create a shape with the outline as the interior.
    var boundingShape = NavMesh._geometry.getBoundingShapeForPaths([shape]);

    cpr.Clear();
    cpr.AddPath(boundingShape, ClipperLib.PolyType.ptSubject, true);
    cpr.AddPath(shape, ClipperLib.PolyType.ptClip, true);

    var solution_paths = new ClipperLib.Paths();
    cpr.Execute(ClipperLib.ClipType.ctDifference,
      solution_paths,
      ClipperLib.PolyFillType.pftNonZero,
      ClipperLib.PolyFillType.pftNonZero);

    // Once we have the shape as created above, inflate it. This gives
    // better results than treating the outline as the exterior of a
    // shape and deflating it.
    var offsetted_paths = new ClipperLib.Paths();

    co.Clear();
    co.AddPaths(solution_paths, ClipperLib.JoinType.jtSquare, ClipperLib.EndType.etClosedPolygon);
    co.Execute(offsetted_paths, offset * scale);

    // If this is not true then the offsetting process shrank the
    // outline into non-existence and only the bounding shape is
    // left.
    // >= 2 in case the offsetting process isolates portions of the
    // outline (see: GamePad).
    if (offsetted_paths.length >= 2) {
      // Get only the paths defining the outlines we were interested
      // in, discarding the exterior bounding shape.
      offsetted_paths.shift();
    } else {
      offsetted_paths = new ClipperLib.Paths();
    }
    return offsetted_paths;
  };

  /**
   * Offset a polygon. The polygon vertices should be in CW order and
   * the polygon should already be scaled up.
   * @private
   * @param {CLShape} shape - The shape to inflate outwards.
   * @param {number} offset - The amount to offset the shape.
   * @param {integer} [scale=100] - The scale for the operation.
   * @return {ClipperLib.Paths} - The resulting shape from offsetting.
   *   If the process of offsetting resulted in the interior shape
   *   closing completely, then an empty array will be returned. The
   *   returned shape will still be scaled up, for use in other
   *   operations.
   */
  NavMesh._geometry.offsetExterior = function(shape, offset, scale) {
    // TODO
  };

  /**
   * Generate a convex partition of the provided polygon, excluding
   * areas given by the holes.
   * @private
   * @param {Poly} outline - The polygon outline of the area to
   *   partition.
   * @param {Array.<Poly>} holes - Holes in the polygon.
   * @return {Array.<Poly>} - Polygons representing the partitioned
   *   space.
   */
  NavMesh._geometry.convexPartition = function(outline, holes) {
    // Ensure proper vertex order for holes and outline.
    outline.setOrientation("CCW");
    holes.forEach(function(e) {
      e.setOrientation("CW");
      e.hole = true;
    });
    
    return PolyUtils.convexPartition(outline, holes);
  }

  /**
   * Partition the provided area.
   * @private
   * @param {Area} area - The Area to partition.
   * @return {Array.<Poly>} - Polygons representing the partitioned
   *   space.
   */
  NavMesh._geometry.partitionArea = function(area) {
    return NavMesh._geometry.convexPartition(area.polygon, area.holes);
  }

  /**
   * Partition the provided areas.
   * @private
   * @param {Array.<Area>} areas - The areas to partition.
   * @return {Array.<Poly>} - Polygons representing the partitioned
   *   space.
   */
  NavMesh._geometry.partitionAreas = function(areas) {
    var polys = areas.map(NavMesh._geometry.partitionArea);
    return NavMesh._util.flatten(polys);
  }

  /**
   * A point in ClipperLib is just an object with properties
   * X and Y corresponding to a point.
   * @typedef CLPoint
   * @type {object}
   * @property {integer} X - The x coordinate of the point.
   * @property {integer} Y - The y coordinate of the point.
   */
  /**
   * A shape in ClipperLib is simply an array of CLPoints.
   * @typedef CLShape
   * @type {Array.<CLPoint>}
   */
  /**
   * Takes a Poly and converts it into a ClipperLib polygon.
   * @private
   * @param {Poly} poly - The Poly to convert.
   * @return {CLShape} - The converted polygon.
   */
  NavMesh._geometry.convertPolyToClipper = function(poly) {
    return poly.points.map(function(p) {
      return {X:p.x, Y:p.y};
    });
  };

  /**
   * Convert a ClipperLib shape into a Poly.
   * @private
   * @param {CLShape} clip - The shape to convert.
   * @return {Poly} - The converted shape.
   */
  NavMesh._geometry.convertClipperToPoly = function(clip) {
    var points = clip.map(function(p) {
      return new Point(p.X, p.Y);
    });
    return new Poly(points);
  };

  /**
   * Generate a bounding shape for paths with a given buffer. If using
   * for an offsetting operation, the returned CLShape does NOT need to
   * be scaled up.
   * @private
   * @param {Array.<CLShape>} paths - The paths to get a bounding shape for.
   * @param {integer} [buffer=5] - How many units to pad the bounding
   *   rectangle.
   * @return {CLShape} - A bounding rectangle for the paths.
   */
  NavMesh._geometry.getBoundingShapeForPaths = function(paths, buffer) {
    if (typeof buffer == "undefined") buffer = 5;
    var bounds = ClipperLib.Clipper.GetBounds(paths);
    bounds.left -= buffer;
    bounds.top -= buffer;
    bounds.right += buffer;
    bounds.bottom += buffer;
    var shape = [];
    shape.push({X: bounds.right, Y: bounds.bottom});
    shape.push({X: bounds.left, Y: bounds.bottom});
    shape.push({X: bounds.left, Y: bounds.top});
    shape.push({X: bounds.right, Y: bounds.top});
    return shape;
  }

  /**
   * Holds utility methods needed by the navmesh.
   * @private
   */
  NavMesh._util = {};

  /**
   * Removes and returns the items at the indices identified in
   * `indices`.
   * @private
   * @param {Array} ary - The array to remove items from.
   * @param {Array.<integer>} indices - The indices from which to
   *   remove the items from in ary. Indices should be unique and
   *   each should be less than the length of `ary` itself.
   * @return {Array} - The items removed from ary.
   */
  NavMesh._util.splice = function(ary, indices) {
    indices = indices.sort(NavMesh._util._numberCompare).reverse();
    var removed = [];
    indices.forEach(function(i) {
      removed.push(ary.splice(i, 1)[0]);
    });
    return removed;
  }

  /**
   * Comparison function for numbers.
   * @private
   */
  NavMesh._util._numberCompare = function(a, b) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Take an array of arrays and flatten it.
   * @private
   * @param  {Array.<Array.<*>>} ary - The array to flatten.
   * @return {Array.<*>} - The flattened array.
   */
  NavMesh._util.flatten = function(ary) {
    return Array.prototype.concat.apply([], ary);
  }

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
  ;(function() {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
      }
      value = +value;
      exp = +exp;
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
      }
      // Shift
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      // Shift back
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
      Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
      };
    }
    // Decimal floor
    if (!Math.floor10) {
      Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp);
      };
    }
    // Decimal ceil
    if (!Math.ceil10) {
      Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp);
      };
    }
  })();

  return NavMesh;
});
