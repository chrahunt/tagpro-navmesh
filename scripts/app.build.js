({
  baseUrl: "../",
  name: "./scripts/almond",
  include: ['navmesh'],
  out: "../../map-build/navmesh.js",
  wrap: {
    startFile: "./start.frag",
    endFile: "./end.frag"
  },
  paths: {
    // Location of already-optimized worker file.
    'aStarWorker': '../map-build/aStarWorker'
  }
})
