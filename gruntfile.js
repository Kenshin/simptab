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
        livereload: 35729,
      },

      css: {
        files: [ "assets/css/*.styl" ],
        tasks: [ "stylus" ],
      },

      js: {
        files: [ "gruntfile.js", "./js/main.js" ],
        tasks: [ "jshint" ]
      },

      html: {
        files: [ "index.html" ]
      }

    },

    connect: {
      server: {
        options: {
          port: 80,
          hostname: "localhost",
          open: true,
          middleware: function( connect, options ) {
            var lrSnippet = require( "grunt-contrib-livereload/lib/utils" ).livereloadSnippet,
                base      = options.base;
            return [
              lrSnippet,
              connect.static( base.toString() )
            ];
          }
        }
      }
    },

    jshint: {
      options: {
        browser: true,
        jquery : true,
        node   : true,
        nonstandard: true,
        globals: {
          i18n : false
        }
      },
      all: [ "gruntfile.js", "js/*.js" ]
    },

    clean: {
      publish: [ "dest" ]
    },

    copy: {
      publish: {
        files: [{
            expand: true,
            src: [ "assets/**", "locales/**", "js/**", "vender/**", "index.html", "favicon.ico" ],
            dest: "dest-www"
          }]
      }
    },

    requirejs: {
      js: {
        options: {
          baseUrl        : ".",
          name           : "js/main.js",
          include        : [ "js/main.js" ],
          out            : "./dest-www/js/main.js",
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
          out            : "./dest-www/assets/css/main.css"
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