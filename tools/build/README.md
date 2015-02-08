# Building NavMesh

Building relies on the RequireJS Optimizer [r.js](https://github.com/jrburke/r.js/). The build takes place in two parts. First, build the navigation web worker using
    
    path/to/r.js -o workers.build.js

Which should output an almond-wrapped and optimized `aStarWorker.js` to the build directory. Then run

    path/to/r.js -o app.build.js

which will optimize and wrap `navmesh.js` so that it's appropriate for use as either an AMD module or included directly, in which case it exposes the global name `NavMesh`.
