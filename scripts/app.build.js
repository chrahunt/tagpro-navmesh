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
    // Map to optimized worker file.
    'aStarWorker': '../map-build/aStarWorker'
  },
  optimize: "none"
})
