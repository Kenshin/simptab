
define([ "jquery", "date" ], function( $, date ) {

    /*
    getDefault = function () {
        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : "http://bing.com",
            success    : function( data ) {
                var begin   = data.indexOf( "g_img=" ),
                    newdata = data.substr( begin ),
                    end     = newdata.indexOf( ".jpg" ),
                    url     = newdata.substring( 12, end ) + ".jpg",
                    hdurl   = getHDurl( url );

                console.log("url = "   + hdurl);
                console.log("end = "   + end);
                console.log("begin = " + begin);

                // set background image
                $("body").css({ "background-image": "url(" + hdurl + ")" });

                // transfor to datauri
                save( hdurl );

                // get background name
                begin    = data.indexOf( 'id="sh_cp" title="' );
                newdata  = data.substr( begin + 18 );
                end      = newdata.indexOf( '"' );
                var name = newdata.substring( 0, end ) + ".jpg";

                // download
                download( hdurl, name );
            }
        });
    }
    */

    getBackgroundByAPI = function ( random ) {
        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : "http://bing.com/HPImageArchive.aspx?format=js&idx=" + random + "&n=1",
            dataType   : "json",
            success    : function( result ) {
                if ( result && !$.isEmptyObject( result ) && !$.isEmptyObject( result.images[0] )) {
                    var data = result.images[0],
                        url  = data.url,
                        hdurl= getHDurl( url ),
                        name = data.copyright,
                        enddate = data.enddate;

                    // set background image
                    $("body").css({ "background-image": "url(" + hdurl + ")" });

                    // transfor to datauri
                    save( hdurl, enddate, name );

                    // download
                    download( hdurl, name );

                }
            }
        });
    }

    getHDurl = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    save = function ( url, enddate, name ) {
        var img = new Image();
        img.onload = function() {

            // set canvas
            var canvas = document.createElement( "canvas" );
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( img, 0, 0 );

            // get datauri
            var dataURI = canvas.toDataURL( "image/jpg" );

            // set chrome local storage
            chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });

            // save image to local
            //saveImage( canvas );

        }
        img.src = url;
    }

    download = function( url, name ) {
        // set download href
        $( ".controlink[url='download']" ).attr({
            'href'      : url,
            'download'  : name + '.jpg'
        });
    }

    saveImage = function ( myCanvas ) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem( window.PERSISTENT, 52428800, function( fs ) {

            var fileName = Math.round(+new Date()) + ".jpg";

            fs.root.getFile( fileName, { create:true, exclusive: true }, function( fileEntry ) {
                fileEntry.createWriter(function(fileWriter) {

                    console.log("fileEntry.toURL() = " + fileEntry.toURL())

                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };

                    fileWriter.write( dataURItoBlob( myCanvas.toDataURL( "image/jpg" )));

                }, errorHandler);
            }, errorHandler);

            /*
            fs.root.getFile('log222.txt', {create: true, exclusive: true}, function(fileEntry) {

                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {

                  fileWriter.onwriteend = function(e) {
                    console.log('Write completed.');
                  };

                  fileWriter.onerror = function(e) {
                    console.log('Write failed: ' + e.toString());
                  };

                  // Create a new Blob and write it to log.txt.
                  var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

                  fileWriter.write(blob);

                }, errorHandler);

            }, errorHandler);
            */

        }, errorHandler);
    }

    errorHandler = function (e) {
        console.log(e)
    }

    dataURItoBlob = function (dataURI, callback) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        //var bb = new window.WebKitBlobBuilder(); // or just BlobBuilder() if not using Chrome
        //bb.append(ab);
        //return bb.getBlob(mimeString);
        var blob = new Blob(ia, { type: "image/jpg" });
        return blob;
    };

    return {
        Get: function ( is_random ) {

            var random = 0,
                url    = "../assets/images/background.jpg";

            // get simptab-background
            chrome.storage.local.get( "simptab-background", function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    // reset-background
                    var today  = date.Today(),
                        data   = result["simptab-background"];
                    url    = data.background;

                    // random = true
                    if ( is_random ) {
                        if ( localStorage["simptab-background-random"] != undefined ) {
                            random = parseInt(localStorage["simptab-background-random"]) + 1;
                            if ( random > 19 ) {
                                random = 4;
                            }
                        }
                        // save random
                        localStorage["simptab-background-random"] = random;
                        // get background
                        getBackgroundByAPI( random );
                    }
                    // random = false
                    else {

                        console.log("today = " + today)
                        console.log("data  = "  + data.date)

                        if ( today != data.date ) {
                            // get background
                            getBackgroundByAPI( random );
                        }
                        else {
                            // download
                            download( data.url, data.name );
                            // set background
                            $("body").css({ "background-image": "url(" + url + ")" });
                        }
                    }

                }
                else {
                    // get background
                    getBackgroundByAPI( random );
                    // save random
                    localStorage["simptab-background-random"] = random;
                    // set background
                    $("body").css({ "background-image": "url(" + url + ")" });
                }
            });
        }
    }
});
