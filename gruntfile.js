"use strict";

module.exports = function( grunt ) {

  grunt.initConfig({

    pkg        : grunt.file.readJSON( "package.json" ),

    stylus: {
      compile: {
        files: {
          "assets/css/main.css": "assets/css/main.styl"
        }
      }
    },

    watch: {

      options: {
        livereload: true,
      },

      css: {
        files: [ "assets/css/*.styl" ],
        tasks: [ "stylus", "connect" ],
      },

      js: {
        files: [ "gruntfile.js" ],
        tasks: [ "jshint", "connect" ]
      },

      html: {
        files: [ "index.html" ],
        tasks: [ "connect" ],
      }

    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: "localhost"
        }
      }
    },

    jshint: {
      all: [ "gruntfile.js", "js/*.js" ]
    },

    clean: {
      publish: [ "dest" ]
    },

    copy: {
      publish: {
        files: [{
            expand: true,
            src: [ "assets/**", "index.html", "js/**" ],
            dest: "dest"
          }]
      }
    },

    requirejs: {
      js: {
        options: {
          baseUrl        : ".",
          name           : ".js/main.js",
          include        : [ ".js/main.js" ],
          out            : "./dest/js/main.js",
          keepBuildDir   : true,
          optimize       : "uglify2",
          uglify2        : {
            compress     : {
              drop_console : true
            }
          }
        }
      },

      css: {
        options: {
          baseUrl        : ".",
          optimizeCss    : "standard",
          cssIn          : "./assets/css/main.css",
          out            : "./dest/assets/css/main.css"
        }
      }
    }

  });

  /*  load npm tasks
    use matchdep each grunt-* with grunt.loadNpmTasks method */
  require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

  grunt.registerTask( "default", [ "connect", "watch" ]);

  grunt.registerTask( "publish", [ "clean", "copy", "requirejs" ]);

};