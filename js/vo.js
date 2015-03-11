
define([ "jquery" ], function( $ ) {
    /*
    * when version = undefined ( 1 )
    * property `url` `date` `name` `info`
    * url != hdurl when bing.com
    * `date` is `enddate`
    *
    * when version = 2
    * add new property `hdurl` `enddate` `shortname` `version` `type`
    * change `data` to `endate`
    *
    * type include: `bing.com` `wallhaven.cc` `unsplash.it` `unsplash.com` `flickr.com`
    *
    */
    var result = {};
    const VERSION = "2";

    return {
        Create: function( url, hdurl, name, info, enddate, shortname, type ) {

            result.url       = url;
            result.hdurl     = hdurl;
            result.name      = name;
            result.info      = info;
            result.enddate   = enddate;
            result.shortname = shortname;
            result.type      = type;
            result.version   = VERSION;

            return result;
        },

        Value: function() {
            return result;
        },

        Set: function( result ) {
            chrome.storage.local.set( { "simptab-background" : result });
        },

        Get: function ( callBack ) {
            return chrome.storage.local.get( "simptab-background", callBack );
        },

        Verify: function( version ) {
            if ( version == undefined || version != VERSION ) {
                return false;
            }
            else {
                return true;
            }
        }
    }
});
