
define([ "jquery", "vo" ], function( $, vo ) {

    "use strict";

    var FOLDER_NAME = "favorites",
        fs, curURI, count = 0;

    function errorHandler( error ) {
        console.error( "File Operations error.", error );
    }

    function createFavFolder( errorBack ) {
        fs.root.getDirectory( FOLDER_NAME , { create: true }, function( dirEntry ) {
            console.log( "You have just created the " + dirEntry.name + " directory." );
        }, errorBack );
    }

    function dataURItoBlob( dataURI ) {
        // convert base64 to raw binary data held in a string
        var byteString = atob( dataURI.split(',')[1] );

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer( byteString.length );
        var ia = new Uint8Array( ab );
        for ( var i = 0; i < byteString.length; i++ ) {
            ia[i] = byteString.charCodeAt(i);
        }

        var blob = new Blob( [ia], { type: "image/jpg" });
        return blob;
    }

    function getDataURI( url , def ) {
        var img = new Image();

        img.onload      = onload;
        img.onerror     = errored;
        img.onabort     = errored;
        img.crossOrigin = "*";
        img.src         = url;

        function onload() {
            unbindEvent();

            var canvas    = document.createElement( "canvas" );
            canvas.width  = img.width;
            canvas.height = img.height;
            canvas.getContext( "2d" ).drawImage( img, 0, 0 );

            def.resolve( canvas.toDataURL( "image/jpeg" ));
            canvas = null;
            img    = null;
        }

        function errored ( error ) {
            unbindEvent();
            def.reject( error );
        }

        function unbindEvent() {
            img.onload  = null;
            img.onerror = null;
            img.onabort = null;
        }

        return def.promise();
    }

    function readAsDataURL( file, arr, i, len, def ) {
        arr.push( new FileReader() );
        arr[i].onloadend = function( result ) {
            arr[i].onloadend = null;
            if ( count == len - 1 ) {
                arr   = [];
                count = 0;
            } else { count++; }
            result.type == "loadend" ? def.resolve( result.currentTarget.result ) : def.reject( result );
        };
        arr[i].readAsDataURL( file );
        return def.promise();
    }

    return {
        Init: function( errorBack ) {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem( window.TEMPORARY , 52428800, function( fileEntry ) {
                fs = fileEntry;
                console.log( "File init complete.", fs );
                createFavFolder( errorBack );
            }, errorBack );
        },

        Add: function( file_name, uri ) {

            var path = file_name == vo.constructor.BACKGROUND ? file_name : FOLDER_NAME + "/" + file_name + ".jpg";
            var def  = $.Deferred();

            fs.root.getFile( path, { create : true }, function( fileEntry ) {
                    fileEntry.createWriter( function( fileWriter ) {
                        function unbindEvent() {
                            fileWriter.onwritestart = null;
                            fileWriter.onprogress   = null;
                            fileWriter.onwriteend   = null;
                            fileWriter.onabort      = null;
                            fileWriter.onerror      = null;
                            fileWriter              = null;
                        };
                        function writeabortHandler(e) {
                            def.reject( e );
                            unbindEvent();
                        };
                        function sucessHandler(e) {
                            def.resolve( e, fileEntry.toURL() );
                            unbindEvent();
                        };
                        console.log("fileEntry.toURL() = " + fileEntry.toURL());

                        fileWriter.onwritestart  = function(e) { def.notify( e ); };
                        fileWriter.onprogress    = function(e) { def.notify( e ); };
                        fileWriter.onwriteend    = sucessHandler;
                        fileWriter.onabort       = writeabortHandler;
                        fileWriter.onerror       = writeabortHandler;
                        fileWriter.write( dataURItoBlob( uri ));
                    }, function( error ) {
                        console.log( "Save background fail, error is", error );
                        def.reject( error );
                    });
                },
                function( error ) {
                        console.log( "Get background fail, error is", error );
                        def.reject( error );
                });

            return def.promise();
        },

        Delete: function( file_name, callback, errorBack ) {

            fs.root.getDirectory( FOLDER_NAME, {}, function( dirEntry ) {
                var dirReader = dirEntry.createReader(),
                    is_del    = false,
                    del_entry;
                dirReader.readEntries(function( entries ) {
                    for( var i = 0, len = entries.length; i < len; i++ ) {
                      var entry = entries[i];
                      if ( entry.isDirectory ) {
                        console.log("Directory: " + entry.fullPath );
                      }
                      else if ( entry.isFile ) {
                        console.log("File: " + entry.fullPath );
                        if ( file_name + ".jpg" == entry.name ) {
                            is_del    = true;
                            del_entry = entry;
                            break;
                        }
                      }
                    }
                    if ( is_del ) {
                        del_entry.remove(function() {
                            console.log( "File successufully removed." );
                            callback( file_name );
                        }, errorBack );
                    }
                    else {
                        console.error( "Not found delete favorite background in filesystem, id is " + file_name );
                        callback( file_name );
                    }
                 }, errorBack );
            }, errorBack );
        },

        List: function( callback ) {
            fs.root.getDirectory( FOLDER_NAME, {}, function( dirEntry ) {
            var dirReader = dirEntry.createReader();
            var name_arry = [];
            dirReader.readEntries(function( entries ) {
                for( var i = 0, len = entries.length; i < len; i++ ) {
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

        GetDataURI: function() {
            var def = $.Deferred();

            arguments.constructor.prototype.push = Array.prototype.push;
            arguments.push( def );

            if ( arguments && arguments.length == 2 && typeof arguments[0] === "string" ) {
                getDataURI.apply( this, arguments );
            }
            else if ( arguments && arguments.length == 5 && typeof arguments[0] === "object" ) {
                readAsDataURL.apply( this, arguments );
            }
            delete arguments.constructor.prototype.push;

            return def.promise();
        },

        DataURI: function( result ) {
            return curURI = curURI || result;
        },

        VerifyUploadFile: function( arr ) {
            if ( !arr.filter ) arr.constructor.prototype.filter = Array.prototype.filter;
            return arr.filter(function( item ) {
                return item.type.split("/")[0] === "image";
            });
        },

        FavoriteVO: function() {
            return JSON.parse( localStorage["simptab-favorites"] || "[]" );
        },

        AddFavorite: function( favorite_vo, file_name, result ) {
            var obj = { "file_name" : file_name, "result" : JSON.stringify( result ) };
            favorite_vo.push( JSON.stringify( obj ));
            localStorage[ "simptab-favorites" ] = JSON.stringify( favorite_vo );
        },

        DeleteFavorite: function( favorite_vo, file_name ) {
            var obj = {};
            for( var idx = 0, len = favorite_vo.length; idx < len; idx++ ) {
                obj = JSON.parse( favorite_vo[idx] );
                if ( obj.file_name == file_name ) {
                    favorite_vo.splice( idx, 1 );
                    localStorage[ "simptab-favorites" ] = JSON.stringify( favorite_vo );
                    break;
                }
            }
        },

        FavBingVO: function() {
            return JSON.parse( localStorage[ "simptab-bing-fav" ] || "[]" );
        },

        AddFavBing: function( fav_bing, result ) {
            fav_bing.push( result );
            localStorage[ "simptab-bing-fav" ] = JSON.stringify( fav_bing );
        },

        DeleteFavBing: function( fav_bing, result ) {
            var val = {};
            for( var idx = 0, len = fav_bing.length; idx < len; idx++ ) {
                val = fav_bing[idx];
                if ( val.split(":")[1] == result ) {
                    fav_bing.splice( idx, 1 );
                    localStorage[ "simptab-bing-fav" ] = JSON.stringify( fav_bing );
                    break;
                }
            }
        },

        FindFavBing: function( fav_bing, result ) {
            var val = {};
            for( var idx = 0, len = fav_bing.length; idx < len; idx++ ) {
                val = fav_bing[idx];
                if ( val.split(":")[0] == result ) {
                    return val.split(":")[1];
                }
            }
            return -1;
        }
    };
});
