module.exports = function(grunt) {
  grunt.initConfig({
    // Remove unused CSS across multiple files, compressing the final output
    uncss: {
      dist: {
        files: {
          'css/tidy.css': ['en/careers.html', 'fr/careers.html']
        }
      }
    }
  });
  // Load the plugins
  grunt.loadNpmTasks('grunt-uncss');
  // Default tasks.
  grunt.registerTask('default', ['uncss']);
};