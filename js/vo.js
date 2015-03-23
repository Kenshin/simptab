
define([ "jquery" ], function( $ ) {

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
    * type include: `default` `bing.com` `wallhaven.cc` `unsplash.it` `unsplash.com` `flickr.com` `googleartproject.com`
    *
    * when version = 2.1
    * add new property `favorite`
    *
    */
    const VERSION = "2.1";

    function VO() {
        this.cur = {};  //current background data structure
        this.new = {};  //new background data structure
    }

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
    }

    VO.prototype.Set = function( result ) {
            chrome.storage.local.set( { "simptab-background" : result });
    }

    VO.prototype.Get = function ( callBack ) {
            return chrome.storage.local.get( "simptab-background", callBack );
    }

    VO.prototype.Verify = function( version ) {
        if ( version == undefined || version != VERSION ) {
            return false;
        }
        else {
            return true;
        }
    }

    return new VO();

});
