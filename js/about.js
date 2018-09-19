define([ "jquery", "lodash", "notify", "i18n" ], function( $, _, Notify, i18n ) {

    var rTmpl  = '\
                <div class="close"><span class="close"></span></div>\
                    <div class="about">About</div>\
                </div>';

    function closeListenEvent() {
        $( ".manage .close" ).click( function( event ) {
            $( ".manage-bg" ).removeClass( "manage-bg-show" );
            setTimeout( function() {
                $( ".manage-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Render: function() {
            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( rTmpl );
                closeListenEvent();
            }, 10 );
        }
    }
});