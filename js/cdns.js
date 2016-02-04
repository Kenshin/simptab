
define([ "jquery" ], function( $ ) {

    "use strict";

    var VERSION = "1";

    function CDNs() {}

    function random( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) + min );
    }

    function createCloudinary( url, cdns, webp, exclude, type ) {
        var max  = cdns.length - 1,
            ran  = random( 0, max ),
            cdn  = "simptab" + cdns[ ran ],
            api  = url == "" ? "http://res.cloudinary.com/#1/image/fetch/#2" : url;
        api      = api.replace( "#1", cdn ).replace( "#2", webp );
        cdn      = exclude.indexOf( type ) != -1  ? "" : api;
        return cdn;
    }

    CDNs.prototype.Create = function( url, type ) {

        var cdn = "",
            ls  = localStorage[ "simptab-cdns" ],
            obj = JSON.parse( ls || "{}" ),
            new_cdn;

        $.getJSON( "http://simptab.qiniudn.com/cdns.json" + "?random=" + Math.round(+new Date()), function( result ) {
            if ( result && !$.isEmptyObject( result ) && result.version != obj.version ) {
                localStorage[ "simptab-cdns" ] = JSON.stringify( result );
            }
        });

        if ( ls ) {
            try {
                cdn = obj.cdns[ random( 0, obj.cdns.length - 1 ) ];
                switch( cdn ) {
                    case "cloudinary":
                        new_cdn = obj[ cdn ];
                        cdn     = createCloudinary( new_cdn.url, new_cdn.hosts, new_cdn.webp, new_cdn.exclude, type );
                        break;
                    default:
                        cdn     = "";
                        break;
                }
            }
            catch ( error ) {
                cdn = "";
                console.error( "CDNs parse error.", error )
            }
        }
        return cdn + url;
    }

    return new CDNs();

});
