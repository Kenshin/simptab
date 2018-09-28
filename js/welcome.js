
define([ "jquery", "mousetrap", "carousel", "i18n" ], function( $, Mousetrap, carousel, i18n ) {

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
        Render: function() {
            var tmpl = '<div class="carousel-item">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-service-v2.png">\
                        </div>\
                        <div class="carousel-item">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-adapter.png">\
                        </div>\
                        <div class="carousel-item">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-plugins.png">\
                        </div>\
                        <div class="carousel-item">\
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