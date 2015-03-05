
define([ "jquery", "date", "i18n", "apis" ], function( $, date, i18n, apis ) {

    var defaultBackground = "../assets/images/background.jpg",
        background_obj    = {};

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

        apis.Init(
            random,
            function( jqXHR, textStatus, errorThrown ) {
                console.log(jqXHR)
                console.log(textStatus)
                console.log(errorThrown)
                if ( $("body").css( "background-image" ) == "none" ) {
                    setDefaultBackground();
                }
            },
            function( result) {
                if ( result && !$.isEmptyObject( result ) && !$.isEmptyObject( result.images[0] )) {
                    var data = result.images[0],
                        url  = data.url,
                        hdurl= getHDurl( getTrueUrl( url )),
                        name = data.copyright,
                        info = getInfo( data.copyrightlink ),
                        enddate   = data.enddate;

                    if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {
                        // set background image
                        setBackground( hdurl );
                        // set download url
                        setDownloadURL( hdurl, name, getShortName( info ));
                        // set info url
                        setInfoURL( info, name );
                    }

                    // transfor to datauri
                    // save background to chrome
                    image2URI( hdurl );

                    // set chrome local storage
                    // no use cache mode
                    //chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });
                    // use local mode
                    //chrome.storage.local.set({ "simptab-background" : { "url" : hdurl, "date" : enddate, "name" : name, "info" : info } });

                    // set cache background object
                    background_obj = { "simptab-background" : { "url" : hdurl, "date" : enddate, "name" : name, "info" : info }};

            }
        });

    }

    getTrueUrl = function ( url ) {
        if ( url.indexOf( "/" ) == 0 ) {
            return "http://www.bing.com" + url;
        }
        return url;
    }

    getHDurl = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    getInfo = function ( url ) {
        var reg = /http:\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{3}/;
        if( !reg.test( url )) {
            return "#";
        }

        return url.replace( "&mkt=zh-cn", "" ).replace( "&form=hpcapt", "" ).replace( "www.bing.com", "www.bing.com/knows" );
    }

    getShortName = function( shortname ) {

        shortname = shortname.replace( "www.bing.com/knows", "" )
                             .replace( "http://", "" )
                             .replace( "https://", "" )
                             .replace( "/search?q=", "" );
        shortname = shortname.split( "+" )[0];
        shortname = shortname.split( "&" )[0];

        return decodeURIComponent( shortname );
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

        }
        img.src = url;
    }

    setDefaultBackground = function() {
        // set background image
        setBackground( defaultBackground );
        // set download url
        setDownloadURL( defaultBackground, null, "Wallpaper" );
        // set info url
        setInfoURL( "#", null );
    }

    setDownloadURL = function( url, name, shortname ) {
        if ( isDefaultbackground() ) {
            url  = defaultBackground;
            name = null;
            shortname = "Wallpaper";
        }

        if ( shortname == "#" ) {
            shortname = name;
        }

        $( ".controlink[url='download']" ).attr({
            "title"    : name,
            "href"     : url,
            "download" : "SimpTab-" + date.Now() + "-" + shortname + ".jpg"
        });

        if ( url == null ) {
            $( ".controlink[url='download']" ).removAttr( "title" );
        }
    }

    setInfoURL = function( url, name ) {
        if ( isDefaultbackground() ) {
            url  = "#";
            name = null;
        }
        if ( i18n.GetLocale() != "zh_CN" ) {
            url = url.replace( "/knows/", "/" );
        }
        $( ".controlink[url='info']" ).attr({
            "title"    : name,
            "href"     : url
        });
        if ( url == null ) {
            $( ".controlink[url='info']" ).removAttr( "title" );
        }
    }

    setBackground = function( url ) {
        if ( isDefaultbackground() ) {
            url = defaultBackground;
        }
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    isDefaultbackground = function() {
        console.log("simptab-background-state = " + localStorage["simptab-background-state"]);
        return localStorage["simptab-background-state"] != undefined && localStorage["simptab-background-state"] != "success"
    }

    saveImg2Local = function ( dataURI ) {
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem( window.TEMPORARY , 52428800, function( fs ) {

            fs.root.getFile( "background.jpg", { create:true }, function( fileEntry ) {
                fileEntry.createWriter(function(fileWriter) {

                    console.log("fileEntry.toURL() = " + fileEntry.toURL())

                    fileWriter.onwritestart  = function(e) {
                        console.log( "Write start: ", e );
                        localStorage["simptab-background-state"] = "staring";
                    };

                    fileWriter.onprogress  = function(e) {
                        console.log( "Write process: ", e );
                        localStorage["simptab-background-state"] = "pending";
                    };

                    fileWriter.onwriteend = function(e) {
                        console.log( "Write completed: ", e );
                        // set background state
                        localStorage["simptab-background-state"] = "success";
                        // save background to storge
                        saveBackgroundStorge()
                    };

                    fileWriter.onabort  = function(e) {
                        console.log( "Write abort: ", e );
                        localStorage["simptab-background-state"] = "failed";
                    };

                    fileWriter.onerror = function(e) {
                        console.log( "Write failed: ", e );
                        localStorage["simptab-background-state"] = "failed";
                    };

                    fileWriter.write( dataURItoBlob( dataURI ));

                }, errorHandler );
            }, errorHandler );

        }, errorHandler );
    }

    errorHandler = function (e) {
        console.log(e)
        localStorage["simptab-background-state"] = "failed";
    }

    saveBackgroundStorge = function() {
      chrome.storage.local.set( background_obj );
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
                url    = defaultBackground;

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
                        setDownloadURL( data.url, data.name, getShortName( data.info ));
                        // set info url
                        setInfoURL( data.info, data.name );

                        // get new background
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
                            setDownloadURL( data.url, data.name, getShortName( data.info ));
                            // set info url
                            setInfoURL( data.info, data.name );
                        }
                    }

                }
                else {
                    // save random
                    localStorage["simptab-background-random"] = random;
                    // set default background
                    setDefaultBackground();
                    // get background
                    getBackgroundByAPI( random );
                }
            });
        },

        SetLang: function( lang ) {

            // check locales
            if ( lang != "en" && lang != "zh_CN" && lang != "zh_TW" ) {
                lang = "en";
            }

            // set font-family
            $( "body" ).css({ "font-family" : lang });
        },

        Valid: function() {
            setTimeout( function() {
                if ( $("body").css( "background-image" ) == "none" ) {
                    setDefaultBackground();
                }
            }, 8 * 1000 );
        }
    }
});
