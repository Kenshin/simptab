
define([ "jquery", "mousetrap", "lodash", "notify", "i18n" ], function( $, Mousetrap, _, Notify, i18n ) {

    var rTmpl = '\
                <div class="close"><span class="close"></span></div>\
                <div class="options"></div>\
                ';

    function close() {
        $( ".dialog .close" ).click( function( event ) {
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                $( ".dialog" ).html( rTmpl );
                close();
            }, 10 );
        }
    }

});