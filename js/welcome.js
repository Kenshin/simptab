
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
        },
        next_paging = '\
                <a class="waves-effect waves-circle" href="#">\
                    <span class="next">→</span>\
                </a>',
        prev_paging = '\
                <a class="waves-effect waves-circle" href="#">\
                    <span class="prev">←</span>\
                </a>';

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
        $( ".welcome .paging a span" ).on( "click", function( event ) {
            $( '.carousel.carousel-slider' ).carousel( event.target.className );
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
            $( "body" ).append( '<div class="welcome-overlay"><div class="welcome"><div class="close"><span class="close"></span></div><div class="paging prev">' + prev_paging + '</div><div class="carousel carousel-slider">' + tmpl + '</div><div class="paging prev">' + next_paging + '</div></div></div>' )
            setTimeout( function() {
                open();
                carousel();
                listen();
            }, 10 );
        }
    }
});