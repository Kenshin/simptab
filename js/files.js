
define([ "jquery" ], function( $ ) {

    const FOLDER_NAME = "favorites";

    var fs      = undefined,
        dataURI = undefined;

    errorHandler = function( error ) {
        console.error( "File Operations error.", error );
    }

    createFolder = function() {
        fs.root.getDirectory( FOLDER_NAME , { create: true }, function( dirEntry ) {
          console.log("You have just created the " + dirEntry.name + " directory.");
        }, errorHandler);
    }

    dataURItoBlob = function ( dataURI ) {
        // convert base64 to raw binary data held in a string
        var byteString = atob( dataURI.split(',')[1] );

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer( byteString.length );
        var ia = new Uint8Array( ab );
        for ( var i = 0; i < byteString.length; i++ ) {
            ia[i] = byteString.charCodeAt(i);
        }

        var blob = new Blob( [ia], { type: "image/jpg" });
        return blob;
    }

    getDataURI = function( url ) {
        var img = new Image();
        img.onload = function() {

            // set canvas
            var canvas = document.createElement( "canvas" );
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( img, 0, 0 );

            // get datauri
            dataURI = canvas.toDataURL();

            console.log( "Current background dataURI is ", dataURI )

        }
        img.crossOrigin = "*";
        img.src = url;
    }

    return {
        Init: function( url ) {
            console.log( "Background url is ", url )

            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem( window.TEMPORARY , 52428800, function( fileEntry ) {
                fs = fileEntry;
                console.log( "File init complete.", fs )
                createFolder();
                getDataURI( url );

            }, errorHandler );
        },

        Add: function() {

            fs.root.getFile( FOLDER_NAME + "/background.jpg" , { create:true }, function( fileEntry ) {
                fileEntry.createWriter(function(fileWriter) {

                    console.log("fileEntry.toURL() = " + fileEntry.toURL())

                    fileWriter.onwritestart  = function(e) {
                        console.log( "Write start: ", e );
                    };

                    fileWriter.onprogress  = function(e) {
                        console.log( "Write process: ", e );
                    };

                    fileWriter.onwriteend = function(e) {
                        console.log( "Write completed: ", e );
                    };

                    fileWriter.onabort  = function(e) {
                        console.log( "Write abort: ", e );
                    };

                    fileWriter.onerror = function(e) {
                        console.log( "Write failed: ", e );
                    };

                    fileWriter.write( dataURItoBlob( dataURI ));

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
        },

        DataURI: function() {
            return dataURI;
        },

        DataURItoBlob: dataURItoBlob

    }
});
