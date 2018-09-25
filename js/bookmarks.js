define([ "jquery", "waves", "i18n" ], function( $, Waves, i18n ) {

    function bmListen() {
        $( ".bm-overlay" ).mouseenter( function() {
            $( ".bm" ).css({ "transform": "translateX(0px)", "opacity": 1 });
        });
        $( ".bm" ).mouseleave( function() {
            $( ".bm" ).css({ "transform": "translateX(-300px)", "opacity": 0 });
        });
    }

    return {
        Render() {
            $( "body" ).append( '<div class="bm-overlay"><div class="bm"></div></div>' );
            setTimeout( function() {
                bmListen();
            }, 10 );
        }
    }
});