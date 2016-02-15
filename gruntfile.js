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
          port: 8888,
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
      publish: [ "dest-www" ]
    },

    copy: {
      publish: {
        files: [{
            expand: true,
            src: [ "assets/**","!assets/**/*.styl", "locales/**", "js/**", "favicon.ico" ],
            dest: "dest-www"
          }]
      }
    },

    htmlmin: {
      publish: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          "dest-www/index.html": "index.html"
        }
      }
    },

    uglify: {
      options: {
          compress     : {
            drop_console : true
          }
      },
      publish: {
        files: {
          "./dest-www/js/main.js": [ "./js/main.js" ]
        }
      }
    }

  });

  /*  load npm tasks
    use matchdep each grunt-* with grunt.loadNpmTasks method */
  require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

  grunt.registerTask( "default", [ "jshint", "stylus", "connect", "watch" ]);

  grunt.registerTask( "publish", [ "clean", "copy", "htmlmin", "uglify", "connect", "watch" ]);

};