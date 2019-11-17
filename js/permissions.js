
define([ "jquery", "notify", "i18n" ], function( $, Notify, i18n ) {

    "use strict";

    function request( rules, callback ) {
        chrome.permissions.request({ permissions: rules }, function( result ) {
            new Notify().Render( result ? i18n.GetLang( "permissions_success" ) : i18n.GetLang( "permissions_failed" ) );
            callback && callback( result );
        });
    }

    function remove( rules, callback ) {
        chrome.permissions.remove({ permissions: rules }, function( result ) {
            new Notify().Render( result ? i18n.GetLang( "permissions_disable" ) : i18n.GetLang( "permissions_failed" ) );
            callback && callback( result );
        });
    }

    function verify( rules, callback ) {
        chrome.permissions.contains({ permissions: rules }, function( result ) {
            callback && callback( result );
        });
    }

    return {
        Request: request,
        Remove: remove,
        Verify: verify,
    }

});