
define([ "jquery", "mousetrap", "carousel", "i18n" ], function( $, Mousetrap, carousel, i18n ) {

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
            $( "body" ).append( '<div class="welcome-overlay"><div class="welcome carousel carousel-slider">' + tmpl + '</div></div>' )
            setTimeout( function() {
                $('.carousel.carousel-slider').carousel({
                    fullWidth: true,
                    indicators: true
                  });
            });
        }
    }
});