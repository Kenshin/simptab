
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

        function Version() {}

        Version.prototype.Details = function( cur, news ) {
            var str = "";
            if ( details[cur] ) {
                var i = details[cur].level + 1,
                    j = details[news].level;
                for( i; i <= j; i++) {
                    $.each( details, function( idx, item ) {
                        console.log("asdfasfdasdf", idx, item)
                        if ( item.level == i ) {
                            str += item.details;
                        }
                    });
                }
            }
            else {
                str = details[news].details;
            }
            return str;
        }

        return new Version();

    })();

    return {
        Init: function() {
            var manifest   = chrome.runtime.getManifest(),
                newversion = manifest.version,
                curversion = localStorage['simptab-version'];


            if ( !curversion || newversion !== curversion ) {
                new Notify().Render( 0,
                                     i18n.GetLang( 'version_title' ),
                                     i18n.GetLang( 'version_content' )
                                        .replace( '#1', newversion )
                                        .replace( '#2', '<a href="https://github.com/kenshin/simptab/blob/master/CHANGELOG.md" target="_blank">' )
                                        .replace( '#3', '</a>' )
                                        .replace( '#4', version.Details( curversion, newversion ))
                                      , true );
                localStorage["simptab-version"] = newversion;
            }
        }
    };

});
