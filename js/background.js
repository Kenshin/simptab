
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
            }
        });
    }

    getRandom = function () {
        console.log("getRandom")
    }

    get1080p = function ( url ) {
        return url.replace( "1366x768", "1920x1080" );
    }

    return {
        Get: function ( is_random ) {
            if ( is_random ) {
                getRandom();
            }
            else {
                getDefault();
            }
        }
    }
});
