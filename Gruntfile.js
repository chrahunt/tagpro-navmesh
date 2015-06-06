module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: ['navmesh/**/*.js', 'README.md'],
        options: {
          destination: 'doc',
          configure: 'conf.json',
          private: false//,
          //template: 'node_modules/grunt-jsdoc/node_modules/'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
};
