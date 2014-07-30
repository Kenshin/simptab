
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

    createRandom = function() {
    	var random = Math.floor( Math.random() * 20 );
    	if ( random > 19 ) {
    		random = 19 - random;
    	}
        if ( localStorage["simptab-background-random"] == random ) {
            createRandom();
        }
    	return random;
    }

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

                    if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {
	                    // set background image
	                    setBackground( hdurl );

	                    // set download url
	                    setDownloadURL( hdurl, name );
                    }

                    // transfor to datauri
                    image2URI( hdurl, enddate, name );

                }
            }
        });
    }

    getHDurl = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    image2URI = function ( url, enddate, name ) {
        var img = new Image();
        img.onload = function() {

            // set canvas
            var canvas = document.createElement( "canvas" );
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( img, 0, 0 );

            // get datauri
            var dataURI = canvas.toDataURL();

            // save image to local
            saveImg2Local( dataURI );

            // set chrome local storage
            // no use cache mode
            //chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });
            // use local mode
            chrome.storage.local.set({ "simptab-background" : { "url" : url, "date" : enddate, "name" : name } });

        }
        img.src = url;
    }

    setDownloadURL = function( url, name ) {
        $( ".controlink[url='download']" ).attr({
            "title"    : name,
            "href"     : url,
            "download" : name + ".jpg"
        });
    }

    setBackground = function( url ) {
    	$("body").css({ "background-image": "url(" + url + ")" });
    }

    saveImg2Local = function ( dataURI ) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem( window.TEMPORARY , 52428800, function( fs ) {

            fs.root.getFile( "background.jpg", { create:true }, function( fileEntry ) {
                fileEntry.createWriter(function(fileWriter) {

                    console.log("fileEntry.toURL() = " + fileEntry.toURL())

                    fileWriter.onwriteend = function(e) {
                        console.log('Write completed.');
                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                    };

                    fileWriter.write( dataURItoBlob( dataURI ));

                }, errorHandler );
            }, errorHandler );

        }, errorHandler );
    }

    errorHandler = function (e) {
        console.log(e)
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
    };

    return {
        Get: function ( is_random ) {

            var random = 0,
                url    = "../assets/images/background.jpg";

            // set background refresh
            localStorage["simptab-background-refresh"] = "false";

            // get simptab-background
            chrome.storage.local.get( "simptab-background", function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    // reset-background
                    var today  = date.Today(),
                        data   = result["simptab-background"];

                    // no use cache
                    //url    = data.background;

                    // random = true
                    if ( is_random ) {
                    	// set random
                        if ( localStorage["simptab-background-random"] != undefined ) {
                        	random = createRandom();
                        }
                        console.log("random = " + random )
                        // save random
                        localStorage["simptab-background-random"] = random;

                        // set background image
                        setBackground( "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg" );
	                    // set download url
	                    setDownloadURL( data.url, data.name );

                        // get background
                        getBackgroundByAPI( random );
                    }
                    // random = false
                    else {

                        console.log("today = " + today)
                        console.log("data  = " + data.date)

                        if ( today != data.date ) {
		                    // set background refresh
		                    localStorage["simptab-background-refresh"] = "true";
                            // get background
                            getBackgroundByAPI( random );
                        }
                        else {
                            // set background image
                            setBackground( "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg" );
                            // set download url
                            setDownloadURL( data.url, data.name );
                        }
                    }

                }
                else {
                    // save random
                    localStorage["simptab-background-random"] = random;

                    // set background image
                    setBackground( url );
                    // set download url
                    setDownloadURL( url, "background" );

                    // get background
                    getBackgroundByAPI( random );
                }
            });
        }
    }
});
