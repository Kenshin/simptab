
define([ "jquery", "mousetrap", "carousel", "i18n" ], function( $, Mousetrap, carousel, i18n ) {

    var details = {
        "1.5.1": '\
                <div class="carousel-item" id="1.5.1">\
                    <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-adapter.png">\
                </div>',
        "1.5.2": '\
                <div class="carousel-item" id="1.5.2">\
                    <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-plugins.png">\
                </div>',
    }

    function getDetails( ver ) {
        var detail = "";
        if ( ver.first ) {
            Object.keys( details ).forEach( function( item ) {
                detail += details[item];
            });
        } else detail = details[ ver.update ];
        return detail;
    }

    function open() {
        $( ".welcome" ).css({ "transform": "translateY(0px)", "opacity": 1 });
    }

    function close() {
        $( ".welcome" ).css({ "transform": "translateY(100px)", "opacity": 0 });
        setTimeout( function() {
            $( ".welcome-overlay" ).remove();
        }, 500 );
    }

    function carousel() {
        $('.carousel.carousel-slider').carousel({
            fullWidth: true,
            indicators: true
        });
    }

    function listen() {
        $( ".welcome .close" ).on( "click", function() {
            close();
        });
    }

    return {
        Render: function( ver ) {
            var tmpl = '<div class="carousel-item" id="start">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-service-v2.png">\
                        </div>\
                       ' + getDetails( ver ) + '\
                        <div class="carousel-item" id="end">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-sites.png">\
                        </div>';
            $( "body" ).append( '<div class="welcome-overlay"><div class="welcome carousel carousel-slider"><div class="close"><span class="close"></span></div>' + tmpl + '</div></div>' )
            setTimeout( function() {
                open();
                carousel();
                listen();
            }, 10 );
        }
    }
});