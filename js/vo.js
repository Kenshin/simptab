
define([ "jquery" ], function( $ ) {

    "use strict";

    /*
    *
    * `this.cur` and `this.new` data structure
    *
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
    * when version = 2.2 ( test version 138-simptab-update-vo )
    * add new property `apis_vo`
    *
    */
    var VERSION = "2.2";

    function VO() {
        this.cur = {};  //current background data structure
        this.new = {};  //new background data structure
    }

    VO.DEFAULT_BACKGROUND = "../assets/images/background.jpg";
    VO.CURRENT_BACKGROUND = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg";
    VO.BACKGROUND         = "background.jpg";

    VO.prototype.Create = function( url, hdurl, name, info, enddate, shortname, type, apis_vo, favorite ) {

            this.new.url       = url;
            this.new.hdurl     = hdurl.indexOf( "filesystem:" ) == -1 ? "http://res.cloudinary.com/simptab/image/fetch/" + hdurl : hdurl;   // 138-simptab-update-vo
            this.new.name      = name;
            this.new.info      = info;
            this.new.enddate   = enddate;
            this.new.shortname = shortname;
            this.new.type      = type;
            this.new.apis_vo   = apis_vo;   // 138-simptab-update-vo
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
        var result = false;
        switch ( this.cur.version ) {
            case "2":
                this.cur.favorite = -1;
                this.cur.version  = VERSION;
            case "2.1":
                this.cur.apis_vo  = {};
                this.cur.version  = VERSION;
            case VERSION:
                result            = true;
                break;
        }
        return result;
    };

    VO.prototype.Clone = function( value ) {
        return $.extend( {}, value );
    };

    return new VO();

});
