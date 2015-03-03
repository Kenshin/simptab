
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

    unsplash = function( errorBack, callBack ) {

        console.log( "=== Unsplash.it call ===" );

        var url       = "https://unsplash.it/1920/1080/?random",
            result    = createObj( url, "Unsplash-Image" );

        callBack( result );

    }

    wallhaven = function( errBack, callBack ) {

      console.log( "=== Wallhaven.cc call ===" );

      var random = Math.round(+new Date()).toString().substr(8);

      // when random is 6xxx recall
      if ( random.substr( 0, 1 ) == 6 || random.substr( 0, 1 ) == 0 ) {
        wallhaven( errBack, callBack );
        return;
      }

      var url    = "http://alpha.wallhaven.cc/wallpapers/full/wallhaven-" + random + ".jpg",
          result = createObj( url, "Wallhaven-Image" );

      console.log( "Wall haven random: " + random );

      callBack( result );

    }

    createObj = function( url, copyright ) {
      var obj       = {};
      obj.url       = url;
      obj.copyright = copyright;
      obj.copyrightlink = "#";
      obj.enddate   = new Date();

      var result    = {};
      result.images = [];
      result.images.push( obj );

      return result;
    }

    return {

        Init: function ( random, errorBack, callBack ) {

          // add test code
          wallhaven( errorBack, callBack );

          /*
          var odevity = Math.floor( Math.round(+new Date()) % 2 );
          if ( odevity == 0 ) {
            bing( random, errorBack, callBack );
          }
          else {
            odevity = Math.floor( random % 2 );
            if ( odevity == 1 ) {
              unsplash( errorBack, callBack );
            }
            else {
              wallhaven( errorBack, callBack );
            }
          }
          */
        }
    }
});
