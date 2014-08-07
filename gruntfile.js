"use strict";

module.exports = function( grunt ) {

  grunt.initConfig({

    pkg        : grunt.file.readJSON( "package.json" ),

    clean: {
      publish: [ "dest" ]
    },

    copy: {
      publish: {
        files: [{
            expand: true,
            src: [ "_locales/**", "assets/**", "vender/require.js", "main.html", "manifest.json" ],
            dest: "dest"
          }]
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl        : ".",
          mainConfigFile : "./js/main.js",
          optimizeCss    : "standard.keepLines",
          name           : "main",
          include        : [ "jquery", "background", "date" , "controlbar", "setting", "i18n" ],
          out            : "./dest/js/main.js",
          keepBuildDir   : true,
          optimize       : "uglify2",
          uglify2        : {
            compress     : {
              drop_console : true
            }
          }
        }
      }
    }

  });

  /*  load npm tasks
    use matchdep each grunt-* with grunt.loadNpmTasks method */
  require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

  grunt.registerTask( "default", [ "clean", "copy", "requirejs" ]);

};