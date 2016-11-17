'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
		  dev: {
		    options: {
		      style: 'expanded',
		      compass: true
		    },
		    files: {
		      'css/careers.css': 'scss/main.scss'
		    }
		  }
		},
		watch: {
		  sass: {
		    files: 'scss/*.scss',
		    tasks: ['sass:dev']
		  }
		},
		pkg: grunt.file.readJSON('package.json')
	});
	module.exports = function(grunt) {

	};
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.registerTask('default', [
	  'watch'
	]);
};