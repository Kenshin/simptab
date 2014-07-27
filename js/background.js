
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
            var dataURI = canvas.toDataURL();

            // set chrome local storage
            chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });

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

    return {
        Init: function ( random ) {
            var url = "../assets/images/background.jpg";
            chrome.storage.local.get( "simptab-background", function( result ) {
                console.log(result)
                if ( result && !$.isEmptyObject( result )) {

                    var today = date.Today(),
                        data  = result["simptab-background"],
                        url   = data.background;

                    console.log("today = " + today)
                    console.log("data  = "  + data.date)

                    // download
                    download( data.url, data.name );

                    if ( random != localStorage["simptab-background-random"] ) {
                        // save random
                        localStorage["simptab-background-random"] = random;
                        // get background
                        getBackgroundByAPI( random );
                    }
                }
                else {
                    // get background
                    getBackgroundByAPI( random );

                    // save random
                    localStorage["simptab-background-random"] = random;
                }
                // set background
                $("body").css({ "background-image": "url(" + url + ")" });
                // temp
                //getBackgroundByAPI( random );
            });
        }
    }
});
