
define([ "jquery", "notify", "i18n" ], function( $, Notify, i18n ) {

    "use strict";

    return {
        Init: function() {
            var manifest   = chrome.runtime.getManifest(),
                version    = manifest.version,
                curversion = localStorage['simptab-version'];

            if ( !curversion || version !== curversion ) {
                new Notify().Render( 0, i18n.GetLang( 'version_title' ), i18n.GetLang( 'version_content' ).replace( '#1', version ).replace( '#2', '<a href="http://ksria.com/simptab/CHANGELOG.md">' ).replace( '#3', '</a>' ), true );
                //localStorage["simptab-version"] = version;
            }
        }
    };

});
