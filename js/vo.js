
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
    * type include: `default` `today` `bing.com` `wallhaven.cc` `unsplash.it` `unsplash.com` `flickr.com` `googleart.com` `500px.com` `desktoppr.co` `visualhunt.com` `nasa.gov` `special` `holiday` `upload`
    *
    * when version = 2.1
    * add new property `favorite`
    *
    * when version = 2.2
    * add new property `apis_vo` `pin` `dislike`
    *
    */
    var VERSION = "2.2";

    function VO() {
        this.cur = {};  //current background data structure
        this.new = {};  //new background data structure
    }

    VO.DEFAULT_BACKGROUND = "../assets/images/background.webp";
    VO.CURRENT_BACKGROUND = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg";
    VO.BACKGROUND         = "background.jpg";
    VO.FAVORITE           ="filesystem:" + chrome.extension.getURL( "/" ) + "temporary/favorites/";

    VO.prototype.Create = function( url, hdurl, name, info, enddate, shortname, type, apis_vo, favorite ) {

            Object.defineProperty( this.new, "hdurl", {
                enumerable  : true,
                configurable: true,
                set: function( value ) {
                    var re  = /^https?:\/\/(w{3}\.)?(\w+\.)+([a-zA-Z]{2,})(:\d{1,4})?\/?($)?|filesystem:/ig;
                    hdurl   = re.test( value ) ? value : VO.DEFAULT_BACKGROUND;
                },
                get: function() { return hdurl; }
            });

            this.new.url       = url;
            this.new.hdurl     = hdurl;
            this.new.name      = name;
            this.new.info      = info;
            this.new.enddate   = enddate;
            this.new.shortname = shortname;
            this.new.type      = type;
            this.new.apis_vo   = apis_vo;
            this.new.version   = VERSION;
            this.new.favorite  = typeof favorite == "undefined" ? -1 : favorite;
            this.new.pin       = -1;
            this.new.dislike   = -1;

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
        switch ( this.version ) {
            case "2":
                this.favorite = -1;
                this.version  = VERSION;
            case "2.1":
                if ( this.type == "googleartproject.com" ) this.type = "googleart.com";
                if ( this.enddate.length == 8 && this.type == "bing.com" ) this.type = "today";
                this.apis_vo  = {};
                this.pin      = -1;
                this.dislike  = -1;
                this.version  = VERSION;
            case VERSION:
                result            = true;
                break;
        }
        return result;
    };

    VO.prototype.Clone = function( value ) {
        return $.extend( {}, value );
    };

    VO.prototype.isDislike = function( url ) {
        try {
            var result,
                arr = JSON.parse( localStorage["simptab-dislike"] || "[]" ),
                uid = btoa( url );
            arr     = arr.filter( function( item ) { return item == uid; });
            result  = arr && arr.length > 0 ? false : true;
        }
        catch ( error ) {
            console.error( "vo.isDislike(), Parse 'simptab-dislike' error.", error )
            result = false;
        }
        return result;
    };

    return new VO();

});
