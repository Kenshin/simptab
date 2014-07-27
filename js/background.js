
define([ "jquery" ], function( $ ) {

    getDefault = function () {
        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : "http://bing.com",
            success    : function( data ) {
                console.log(data)
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

    getRandom = function () {
        console.log("getRandom")
    }

    getHDurl = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    save = function ( url ) {
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
            chrome.storage.local.set({ background : dataURI });

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
        Init: function ( is_random ) {
            var url = "../assets/images/background.jpg";
            chrome.storage.local.get( "background", function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    //url = result.background;
                } else {
                    // get background
                    if ( is_random ) {
                        getRandom();
                    }
                    else {
                        getDefault();
                    }
                }
                // set background
                $("body").css({ "background-image": "url(" + url + ")" });
                // temp
                getDefault();
            });
        }
    }
});
