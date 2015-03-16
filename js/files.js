
define([ "jquery" ], function( $ ) {

    const FOLDER_NAME = "favoites";

    var fs = undefined;

    errorHandler = function( error ) {
        console.error( "File Operations error.", error );
    }

    createFolder = function() {
        fs.root.getDirectory( FOLDER_NAME , { create: true }, function( dirEntry ) {
          console.log("You have just created the " + dirEntry.name + " directory.");
        }, errorHandler);
    }

    return {
        Init: function() {

            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem( window.TEMPORARY , 52428800, function( fileEntry ) {
                fs = fileEntry;
                createFolder();
                console.log( "file init complete.", fs)
            }, errorHandler );
        },

        Add: function( srcEntry, destDir ) {

            fs.root.getFile( srcEntry, {}, function( fileEntry ) {
                fs.root.getDirectory( destDir, {}, function( dirEntry ) {
                    fileEntry.copyTo( dirEntry );
                }, errorHandler );
            }, errorHandler );

        },

        Delete: function( file_name ) {

            fs.root.getDirectory( FOLDER_NAME, {}, function( dirEntry ) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function( entries ) {
                for( var i = 0; i < entries.length; i++ ) {
                  var entry = entries[i];
                  if ( entry.isDirectory ) {
                    console.log("Directory: " + entry.fullPath );
                  }
                  else if ( entry.isFile ) {
                    console.log("File: " + entry.fullPath );
                    entry.remove(function() {
                        console.log( "File successufully removed." );
                    }, errorHandler );
                  }
                }
              }, errorHandler );
            }, errorHandler );
        },

        Get: function() {
            fs.root.getDirectory( FOLDER_NAME, {}, function( dirEntry ) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function( entries ) {
                for( var i = 0; i < entries.length; i++ ) {
                  var entry = entries[i];
                  if ( entry.isDirectory ) {
                    console.log("Directory: " + entry.fullPath );
                  }
                  else if ( entry.isFile ) {
                    console.log("File: " + entry.fullPath );
                  }
                }
              }, errorHandler );
            }, errorHandler );
        }
    }
});
