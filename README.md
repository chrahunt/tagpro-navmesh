# TagPro NavMesh

For an example of creating and generating a path between two points, see `navmesh-example.html` in the `examples` directory.

A NavMesh can be constructed by passing in the `tagpro.map` array directly.

```javascript
var mesh = new NavMesh(tagpro.map);
```

This constructs the navigation mesh representation for the map and carries out initialization of the mesh state required for navigation.

Where possible, navigation is handled using a web worker. If the web worker cannot be initialized, then the NavMesh will fall back to computing the path synchronously.

Regardless of where the execution takes place, the interface to requesting and using a path is the same. Assuming a NavMesh has been constructed as above,

```javascript
navmesh.calculatePath(start, end, function(path) {
  var nextPoint = path.unshift();
});
```

Where `start` and `end` are `Point` objects (as defined in `polypartition`) specifying the start and end of the path. The callback function will be passed the path. If found, the path is an Array of `Point`s, or if no path is found, `null`.

This project is in development.
