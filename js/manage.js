
define([ "jquery", "lodash", "i18n", "vo", "date", "error" ], function( $, _, i18n, vo, date, SimpError ) {

    "use strict";

    return {
        Render: function () {
            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
            }, 10 );
        }
    };
});