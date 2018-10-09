
define([ "jquery", "notify", "i18n" ], function( $, Notify, i18n ) {

    "use strict";

    /*
    * this.cur == undefined, first load or version is 1.0.x
    * this.cur != undefined, version is 1.4.x
    */

    var version = (function() {

        var details = {
            "1.0.3" : {
                level   : 0,
                details : i18n.GetLang( "version_detail_0" ),
                permissions: []
            },
            "1.4.0" : {
                level   : 1,
                details : i18n.GetLang( "version_detail_1" ),
                permissions: []
            },
            "1.4.1" : {
                level   : 2,
                details : i18n.GetLang( "version_detail_2" ),
                permissions: []
            },
            "1.4.2" : {
                level   : 3,
                details : i18n.GetLang( "version_detail_3" ),
                permissions: []
            },
            "1.4.3" : {
                level   : 4,
                details : i18n.GetLang( "version_detail_4" ),
                permissions: [
                    "https://*.unsplash.com/",
                    "https://*.unsplash.it/",
                    "http://*.wallhaven.cc/",
                    "https://*.staticflickr.com/",
                    "http://*.desktopprassets.com/",
                    "https://*.500px.org/",
                    "http://*.vo.msecnd.net/",
                    "http://*.nasa.gov/"
                ]
            },
            "1.4.4" : {
                level   : 5,
                details : "",
                permissions: [
                    "https://*.visualhunt.com/"
                ],
                removePermissions : [
                    "http://*.visualhunt.com/"
                ]
            },
            "1.5.0" : {
                level   : 6,
                details : i18n.GetLang( "version_detail_5" ),
                permissions: [],
                removePermissions : []
            },
            "1.5.1" : {
                level   : 7,
                details : i18n.GetLang( "version_detail_6" ),
                permissions: [],
                removePermissions : []
            },
            "1.5.2" : {
                level   : 8,
                details : i18n.GetLang( "version_detail_7" ),
                permissions: [],
                removePermissions : []
            }
        };

        function objFilter( start, end, obj, conditions ) {
            var arr = [], value;
            Object.keys( obj ).map( function( item, idx ) {
                if ( idx >= start && idx <= end ) {
                    value = obj[item][conditions];
                    Object.prototype.toString.call( value ).slice(8,-1) == "Array" ? Array.prototype.push.apply( arr, value ) : arr.push( value );
                }
            });
            return arr;
        }

        function Version() {
            this.new = chrome.runtime.getManifest().version;
            this.cur = localStorage['simptab-version'];
            this.permissions = [];
        }

        Version.prototype.Details = function() {
            var str  = i18n.GetLang( "version_detail_prefix" ),
                cur  = version.cur,
                news = version.new;

            if ( details[cur] ) {
                var arr = objFilter( details[cur].level + 1, details[news].level, details, "details" );
                arr.map( function( item ) { str += item; });
            }
            else {
                str = i18n.GetLang( "version_detail" );
            }
            return str;
        }

        Version.prototype.Save = function() {
            this.cur = this.new;
            localStorage["simptab-version"] = this.new;
        }

        Version.prototype.isUpdate = function() {
            return !this.cur || this.new !== this.cur ? true : false;
        }

        Version.prototype.isPermissions = function() {
            this.permissions = !this.cur ? objFilter( 0, details[this.new].level, details, "permissions" ) : objFilter( details[this.cur].level, details[this.new].level, details, "permissions" );
            return this.permissions.length == 0 ? false : true;
        }

        Version.prototype.GetPermissions = function() {
            this.permissions = objFilter( 0, details[this.new].level, details, "permissions" );
        }

        Version.prototype.RemovePermissions = function() {
            return objFilter( 0, details[this.new].level, details, "removePermissions" );
        }

        return new Version();

    })();

    function permissionClickHandle( event ) {
        chrome.permissions.request({
            origins : version.permissions
        }, function( result ) {
            new Notify().Render( result ? i18n.GetLang( "permissions_success" ) : i18n.GetLang( "permissions_failed" ) );
            removePermissions();
      });
    }

    function removePermissions() {
        var removePermis = version.RemovePermissions();
        if ( removePermis ) {
            var arr = [];
            arr.push( $.trim(removePermis.join(" ")));
            chrome.permissions.remove({
                origins : arr
            }, function( result ) {
                console.warn( "Rmove useless permissions.", arr )
          });
        }
    }

    function containsPermissions() {
        chrome.permissions.contains({ origins: version.permissions }, function( result ) {
            if ( !result ) {
                new Notify().Render( i18n.GetLang( 'permissions' ), "确认", permissionClickHandle );
            }
        });
    }

    function correction() {
        if ( version.cur && version.cur < "1.5.0" ) {
            localStorage.removeItem( "simptab-special-day-count" );
        }
    }

    return {
        Init: function( callback ) {

            if ( version.isUpdate() ) {
                correction();
                var prefix    = i18n.GetShort() == "cn" ? "" : "." + i18n.GetShort(),
                    details   = version.Details(),
                    changelog = "https://github.com/kenshin/simptab/blob/master/CHANGELOG" + prefix + ".md#" + version.new.replace( /\./ig, "" );
                new Notify().Render( i18n.GetLang( 'version_title' ),
                                     i18n.GetLang( 'version_content' )
                                        .replace( '#1', version.new )
                                        .replace( '#2', '<a href="' + changelog + '" target="_blank">' )
                                        .replace( '#3', '</a>' )
                                        .replace( '#4', details )
                                    );

                version.isPermissions() && containsPermissions();
                version.Save();
                callback({ first: details == "" ? true : false, update: version.cur });
            }
            else {
                version.GetPermissions();
                containsPermissions();
            }
        }
    };

});
