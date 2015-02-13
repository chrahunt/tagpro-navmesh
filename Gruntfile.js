module.exports = function(grunt) {
  // RequireJS Build Options
  var build = {
    options: {
      baseUrl: 'navmesh',
      name: '../tools/build/almond'
    },
    // Build configuration for the web worker.
    worker: {
      options: {
        include: ['aStarWorker'],
        out: 'build/aStarWorker.js',
        wrap: true
      }
    },
    // Build configuration for the main NavMesh module.
    app: {
      options: {
        include: ['navmesh'],
        out: 'build/navmesh.min.js',
        wrap: {
          startFile: 'tools/build/start.frag',
          endFile: 'tools/build/end.frag'
        },
        paths: {
          // Location of already-optimized worker file.
          'aStarWorker': '../build/aStarWorker'
        }
      }
    }
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: ['navmesh/**/*.js'],
        options: {
          destination: 'doc',
          configure: 'conf.json'
        }
      }
    },
    requirejs: build
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('build', function() {
    grunt.task.run('requirejs:worker');
    grunt.task.run('requirejs:app');
  });
};
