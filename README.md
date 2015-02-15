# TagPro NavMesh

This library provides an interface for construction of a navigation mesh and pathfinding on that navigation mesh for bots on the game TagPro. The navigation mesh responds dynamically to map updates and offloads path calculation to a web worker to allow inclusion in in-browser bot userscripts.

## Usage

A NavMesh can be constructed by passing in the `tagpro.map` array directly.

```javascript
var mesh = new NavMesh(tagpro.map);
```

This constructs the navigation mesh representation for the map and carries out initialization of the mesh state required for navigation.

Once you've constructed the navigation mesh, you need to set it up to listen for `mapupdate` socket events. This allows for dynamic update of the navigation mesh as obstacles appear and disappear (bombs, gates). There's a function in your navmesh to facilitate this. Assuming you have access to the global `tagpro` object from within your script, the following will set the listener:

```javascript
mesh.listen(tagpro.socket);
```

You don't need `tagpro.socket` specifically, anything that conforms to the EventListener interface and passes `mapupdate` events through to listeners will work.

Once the NavMesh is constructed, requesting a path is easy.

```javascript
navmesh.calculatePath(start, end, function(path) {
  var nextPoint = path.unshift();
  bot.target(nextPoint);
});
```

Your `start` and `end` arguments can be any object that has `x` and `y` properties corresponding to the location (in world coordinates) that you want to find a path between. Points must be inside the specifically defined traversable map area. The navigation mesh is offset from obstacles by an amount less than half the diameter of the player, so coordinates corresponding to the center of specific tiles would be appropriate.

The returned `path` is an array of objects with `x` and `y` properties defining a path along which an agent can follow to get to the goal. The area defining the navigation mesh is offset from obstacles, but further processing would be wise (at the very least to move away from obstacles). The path starts with the `start` point provided to the `calculatePath` function, and ends with the `target` point. If the path is not found, then `null` is returned to the callback.

For an example of creating and generating a path between two points, see `navmesh-example.html` in the `examples` directory.

## Considerations

### Resource Usage

Where possible, navigation is handled using a web worker. If the web worker cannot be initialized, then the NavMesh will fall back to computing the path synchronously. The pathfinding being done in the same thread as the rest of your code may cause delays and undesireable behavior. To check on the status of the web worker, TODO.

### Updating Impassable Tiles

Not all tiles are bad all the time. Gates are an example; whether a gate tile is dangerous depends on your team. The NavMesh allows adding and removing impassable tiles.

```javascript
var mesh = new NavMesh(tagpro.map);
var self = tagpro.player[tagpro.playerId];

if (self.team == 1) { // Red team
    mesh.setImpassable([9.3, 14]); // Blue gate, red boost.
} else { // Blue team
    mesh.setImpassable([9.2, 15]); // Red gate, blue boost.
}
```

Some of these are already taken care of for you. By default, the navigation mesh considers speedpads, green gates, and active bombs non-traversable (in addition to spikes and walls, of course).

Don't want these defaults?

```javascript
mesh.removeImpassable([5, 9.1, 10]);
```

### Following the Path

You've got a list of locations bringing your agent from its current position to the goal, now what? You can navigate to a point, but how do you know when to go for the next point?

Some of the answers are outside the scope of this project, but here are some advice and patterns that can be used to accomplish this task.

One possible solution would be to check the distance between the agent and the point and, if it is close, set the next point in the path to be the target. Because of the nature of the path returned, this leads to unnatural and inefficient behavior.

A better solution would be to periodically check if a point further along the path is visible. The `checkVisible` method on your NavMesh is here to help. This function takes two points and tells you whether the second point is visible from the first, taking into account the state of the obstacles that could block your path.

Here's an example of use, also incorporating a check to make sure we can see any of the path points:

```javascript
// Assuming we have a path.
// Get player position.
var self = tagpro.players[tagpro.playerId];
var position = {x: self.x, y: self.y};
var noneVisible = true;
var furthestVisible = 0;
for (var i = 0; i < path.length; i++) {
    var point = path[i];
    if (mesh.checkVisible(position, point)) {
        noneVisible = false;
        furthestVisible = i;
    }
}

if (noneVisible) {
    // Recalculate path.
} else if (furthestVisible !== 0) {
    // Update path.
    path = path.slice(i);
}
```

## Updates

Sharing is important. The navigation mesh is equipped to inform you of any changes made right away.

```javascript
// Our callback.
var notify = function(polys, added, removed) {
    console.log("NavMesh updated!");
    // polys is an array of Poly objects defining the state of the mesh
    console.log("The NavMesh has " + polys.length + " polygons!");
    // added is an array of Poly objects that were added to the map
    console.log("There were " + added.length + " polygons added,");
    // removed is an array of indices on the previous state of the
    // navigation mesh identifying removed polygons.
    console.log("and " + removed.length + " removed.");
    // Draw updates to the background DisplayObjectContainer
    // ...
}
// Set callback.
mesh.onUpdate(notify);
```

You won't want to edit any of the incoming parameters. Even if you aren't concerned with the new state of the NavMesh, it's a good opportunity to recalculate the path.

## Logging

If you want logging, you can pass a logger as the second parameter to the constructor:

```javascript
var mesh = new NavMesh(tagpro.map, logger);
```

The logger should expose a `log` function that takes an arbitrary number of arguments, with the first being the identifier for the group the log applies to. For a project that presents such an interface, see [Bragi-Node](https://github.com/enoex/Bragi-Node) or [Bragi-Browser](https://github.com/enoex/Bragi-Browser).

## Directories

* **build**: Output directory for build process, contains latest version.
* **examples**: Examples of usage.
* **navmesh**: Source directory for project.
* **tools**: Tools for building and generating map parsing definitions.
    - **build**: Scripts and instructions for generating built version of navmesh.

## Development

Clone the project and run `npm install` to install the development dependencies. The project can be built using `grunt build`. Keep changes on their own branches.

