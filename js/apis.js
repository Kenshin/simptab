
define([ "jquery", "i18n" ], function( $, i18n ) {

    bing = function ( random, errorBack, callBack ) {

       console.log( "=== Bing.com call ===")

        var local = "",
            url   = "";

        // set local
        if ( i18n.GetLocale() == "zh_CN" ) {
            local = "cn.";
        }

        // set url
        url = "http://" + local + "bing.com/HPImageArchive.aspx?format=js&idx=" + random + "&n=1";

        console.log("url = " + url );

        $.ajax({
            type       : "GET",
            timeout    : 2000,
            url        : url,
            dataType   : "json",
            error      : function( jqXHR, textStatus, errorThrown ) {
                errorBack( jqXHR, textStatus, errorThrown );
            },
            success    : function( result ) {
                callBack( result );
            }
        });

    }

    unsplash = function( random, errorBack, callBack ) {

        console.log( "=== Unsplash.it call ===" )

        var obj       = {};
        obj.url       = "https://unsplash.it/1920/1080/?random";
        obj.copyright = "Unsplash-Image";
        obj.copyrightlink = "#";
        obj.enddate   = new Date();

        var result    = {};
        result.images = [];
        result.images.push( obj );

        callBack( result );

    }

    return {

        Init: function ( random, errorBack, callBack ) {
          var odevity = Math.floor( Math.round(+new Date()) % 2 );
          if ( odevity == 0 ) {
            bing( random, errorBack, callBack );
          }
          else {
            odevity = Math.floor( random % 2 );
            if ( odevity == 1 ) {
              unsplash( random, errorBack, callBack );
            }
            else {
              // TO DO
            }
          }
        }
    }
});
