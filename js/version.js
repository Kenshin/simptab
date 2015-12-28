
define([ "jquery", "notify", "i18n" ], function( $, Notify, i18n ) {

    "use strict";

    var version = (function() {

        var details = {
            "1.0.3" : {
                level   : 0,
                details : i18n.GetLang( "version_detail_0" )
            },
            "1.4.0" : {
                level   : 1,
                details : i18n.GetLang( "version_detail_1" )
            },
            "1.4.1" : {
                level   : 2,
                details : i18n.GetLang( "version_detail_2" )
            },
            "1.4.2" : {
                level   : 3,
                details : i18n.GetLang( "version_detail_3" )
            },
            "1.4.3" : {
                level   : 4,
                details : i18n.GetLang( "version_detail_4" )
            }
        };

        function Version() {
            this.new = chrome.runtime.getManifest().version;
            this.cur = localStorage['simptab-version'];
        }

        Version.prototype.Details = function() {
            var str  = i18n.GetLang( "version_detail_prefix" ),
                cur  = version.cur,
                news = version.new;
            if ( details[cur] ) {
                var i = details[cur].level + 1,
                    j = details[news].level;
                for( i; i <= j; i++) {
                    $.each( details, function( idx, item ) {
                        if ( item.level == i ) {
                            str += item.details;
                        }
                    });
                }
            }
            else {
                str = i18n.GetLang( "version_detail" );
            }
            return str;
        }

        Version.prototype.Save = function() {
            localStorage["simptab-version"] = "1.0.3";
        }

        Version.prototype.Permission = function() {
            return true;
        }

        return new Version();

    })();

    function permissionClickHandle( event ) {
        var $target = $( this ).parent().parent().find( ".close" );
        chrome.permissions.request({
            origins: [ "http://*.vo.msecnd.net/", "http://*.nasa.gov/" ]
        }, function( result ) {
            new Notify().Render( result ? i18n.GetLang( "permissions_success" ) : i18n.GetLang( "permissions_failed" ) );
            $( ".notifygp" ).undelegate( ".permissions", "click", permissionClickHandle );
            $target.click();
      });
    }

    return {
        Init: function() {

            if ( !version.cur || version.new !== version.cur ) {
                new Notify().Render( 0,
                                     i18n.GetLang( 'version_title' ),
                                     i18n.GetLang( 'version_content' )
                                        .replace( '#1', version.new )
                                        .replace( '#2', '<a href="https://github.com/kenshin/simptab/blob/master/CHANGELOG.md" target="_blank">' )
                                        .replace( '#3', '</a>' )
                                        .replace( '#4', version.Details())
                                      , true );

                if ( version.Permission() ) {
                    new Notify().Render( 0, "", i18n.GetLang( 'permissions' ).replace( '#1', version.new ), true );
                    $( ".notifygp" ).delegate( ".permissions", "click", permissionClickHandle );
                }

                version.Save();
            }
        }
    };

});
