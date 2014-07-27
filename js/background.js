
define([ "jquery" ], function( $ ) {

    getDefault = function () {
        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : "http://bing.com",
            success    : function( data ) {
                //console.log(data);
                var begin = data.indexOf( "g_img=" ),
                       newdata = data.substr(begin),
                       end   = newdata.indexOf( ".jpg" ),
                       url   = newdata.substring( 12, end ) + ".jpg";

                console.log("url = " + url);
                console.log("end = " + end);
                console.log("begin = " + begin);

                // set background image
                $("body").css({ "background-image": "url(" + get1080p( url ) + ")" });

                // save
                save( url );
            }
        });
    }

    getRandom = function () {
        console.log("getRandom")
    }

    get1080p = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    save = function ( url ) {
        var img = new Image();
        img.onload = function() {
            var canvas = document.createElement( "canvas" );
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext( "2d" );
            ctx.drawImage( img, 0, 0 );
            var dataURI = canvas.toDataURL();
            chrome.storage.local.set({ background : dataURI });
        }
        img.src = url;
    }

    return {
        Init: function ( is_random ) {
            var url = "../assets/images/background.jpg";
            chrome.storage.local.get( "background", function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    url = result.background;
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
            });
        }
    }
});
