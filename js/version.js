
define([ "jquery", "notify", "i18n" ], function( $, Notify, i18n ) {

    "use strict";

    var version = (function() {

        var details = {
            "1.0.3" : {
                level   : 0,
                details : '修复了一些错误；'
            },
            "1.4.0" : {
                level   : 1,
                details : '多种背景源，二十四节气、电影海报、特殊节日，上传功能，收藏功能等；'
            },
            "1.4.1" : {
                level   : 2,
                details : '常用网址（高级模式）；'
            },
            "1.4.2" : {
                level   : 3,
                details : '背景源：<a href="http://www.nasa.gov/multimedia/imagegallery/index.html" target="_blank">NASA Image Galleries</a>，特别日（Special day）；'
            },
            "1.4.3" : {
                level   : 4,
                details : '更详尽的版本提升等；'
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

            new Notify().Render( 0,
                                 i18n.GetLang( 'version_title' ),
                                 i18n.GetLang( 'version_content' )
                                    .replace( '#1', newversion )
                                    .replace( '#2', '<a href="https://github.com/kenshin/simptab/blob/master/CHANGELOG.md" target="_blank">' )
                                    .replace( '#3', '</a>' )
                                    .replace( '#4', version.Details( curversion, newversion ))
                                  , true );

            if ( !curversion || newversion !== curversion ) {
                new Notify().Render( 0, i18n.GetLang( 'version_title' ), i18n.GetLang( 'version_content' ).replace( '#1', newversion ).replace( '#2', '<a href="https://github.com/kenshin/simptab/blob/master/CHANGELOG.md" target="_blank">' ).replace( '#3', '</a>' ), true );
                localStorage["simptab-version"] = newversion;
            }
        }
    };

});
