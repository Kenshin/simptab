
define([ "jquery" ], function( $ ) {

    "use strict";

    /*
    *
    * `this.cur` and `this.new` data structure
    * when version = undefined ( 1 )
    * property `url` `date` `name` `info`
    * url != hdurl when bing.com
    * `date` is `enddate`
    *
    * when version = 2
    * add new property `hdurl` `enddate` `shortname` `version` `type`
    * change `data` to `endate`
    *
    * type include: `default` `bing.com` `wallhaven.cc` `unsplash.it` `unsplash.com` `flickr.com` `googleartproject.com` `500px.com` `desktoppr.co` `visualhunt.com` `nasa.gov` `special` `upload`
    *
    * when version = 2.1
    * add new property `favorite`
    *
    */
    var VERSION = "2.1";

    function VO() {
        this.cur = {};  //current background data structure
        this.new = {};  //new background data structure
    }

    VO.DEFAULT_BACKGROUND = "../assets/images/background.jpg";
    VO.CURRENT_BACKGROUND = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg";
    VO.BACKGROUND         = "background.jpg";

    VO.prototype.Create = function( url, hdurl, name, info, enddate, shortname, type, favorite ) {

            this.new.url       = url;
            this.new.hdurl     = hdurl;
            this.new.name      = name;
            this.new.info      = info;
            this.new.enddate   = enddate;
            this.new.shortname = shortname;
            this.new.type      = type;
            this.new.version   = VERSION;
            this.new.favorite  = favorite == undefined ? -1 : favorite;

            return this.new;
    };

    VO.prototype.Set = function( result ) {
            chrome.storage.local.set( { "simptab-background" : result });
    };

    VO.prototype.Get = function ( callBack ) {
            return chrome.storage.local.get( "simptab-background", callBack );
    };

    VO.prototype.Verify = function() {
        if ( this.cur.version == undefined ) {
            return false;
        }
        else if ( this.cur.version == "2" ) {
            this.cur.favorite = -1;
            this.cur.version  = VERSION;
            return true;
        }
        else if ( this.cur.version == VERSION ) {
            return true;
        }
        else {
            return false;
        }
    };

    VO.prototype.Clone = function( value ) {
        return $.extend( {}, value );
    };

    return new VO();

});
