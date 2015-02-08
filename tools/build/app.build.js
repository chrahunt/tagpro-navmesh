({
  baseUrl: "../../navmesh",
  name: "../tools/build/almond",
  include: ['navmesh'],
  out: "../../build/navmesh.js",
  wrap: {
    startFile: "./start.frag",
    endFile: "./end.frag"
  },
  paths: {
    // Location of already-optimized worker file.
    'aStarWorker': '../build/aStarWorker'
  }
})
