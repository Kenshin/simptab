
define([ "jquery" ], function( $ ) {

    const FOLDER_NAME = "favorites";

    var fs      = undefined,
        dataURI = undefined;

    errorHandler = function( error ) {
        console.error( "File Operations error.", error );
    }

    createFavFolder = function() {
        fs.root.getDirectory( FOLDER_NAME , { create: true }, function( dirEntry ) {
          console.log( "You have just created the " + dirEntry.name + " directory." );
        }, errorHandler );
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
        var img = new Image(),
            def = $.Deferred();

        img.onload = function() {

            // set canvas
            var canvas = document.createElement( "canvas" );
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( img, 0, 0 );

            def.resolve( canvas.toDataURL() );

        }

        img.crossOrigin = "*";
        img.src = url;

        return def.promise();
    }

    return {
        Init: function( url ) {
            console.log( "Background url is ", url )

            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem( window.TEMPORARY , 52428800, function( fileEntry ) {
                fs = fileEntry;
                console.log( "File init complete.", fs )
                createFavFolder();
                getDataURI( url ).then( function( result ) {
                    dataURI = result;
                    console.log( "Current background dataURI is ", dataURI )
                });

            }, errorHandler );
        },

        Add: function( file_name, uri ) {

            // file_name include: `background.jpg` `favorites/20150318115513.jpg`
            // uri       is dataURI
            var path;
            if ( file_name == "background.jpg" ) {
                path = file_name;
            }
            else {
                path = FOLDER_NAME + "/" + file_name + ".jpg";
            }

            var def = $.Deferred();

            fs.root.getFile( path, { create : true },
                function( fileEntry ) {
                    fileEntry.createWriter( function( fileWriter ) {

                        console.log("fileEntry.toURL() = " + fileEntry.toURL())

                        fileWriter.onwritestart  = function(e) { def.notify( e ); };
                        fileWriter.onprogress    = function(e) { def.notify( e ); };
                        fileWriter.onwriteend    = function(e) { def.resolve( e ); };
                        fileWriter.onabort       = function(e) { def.reject( e ); };
                        fileWriter.onerror       = function(e) { def.reject( e ); };

                        fileWriter.write( dataURItoBlob( uri ));

                    }, function( error ) {
                        console.log( "Save background fail, error is", error )
                        def.reject( error );
                    });
                },
                function( error ) {
                        console.log( "Get background fail, error is", error )
                        def.reject( error );
                });

            return def.promise();
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
                    if ( file_name + ".jpg" == entry.name ) {
                        entry.remove(function() {
                            console.log( "File successufully removed." );
                        }, errorHandler );
                    }
                  }
                }
              }, errorHandler );
            }, errorHandler );
        },

        List: function( callback ) {
            fs.root.getDirectory( FOLDER_NAME, {}, function( dirEntry ) {
            var dirReader = dirEntry.createReader();
            var name_arry = [];
            dirReader.readEntries(function( entries ) {
                for( var i = 0; i < entries.length; i++ ) {
                  var entry = entries[i];
                  if ( entry.isDirectory ) {
                    console.log("Directory: " + entry.fullPath );
                  }
                  else if ( entry.isFile ) {
                    console.log("File: " + entry.fullPath );
                    name_arry.push( entry.name.replace( ".jpg", "" ) );
                  }
                }
                callback( name_arry );
              }, errorHandler );
            }, errorHandler );
        },

        DataURI: function() {
            return dataURI;
        },

        DataURItoBlob : dataURItoBlob,
        GetDataURI    : getDataURI

    }
});
