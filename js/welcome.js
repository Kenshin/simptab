
define([ "jquery", "mousetrap", "lodash", "carousel", "i18n" ], function( $, Mousetrap, _, carousel, i18n ) {

    var details = {
            "1.5.2": '\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://st.ksria.cn/welcome-manage.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_152_title_1" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_152_desc_1" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://st.ksria.cn/welcome-bookmarks.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_152_title_2" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_152_desc_2" ) +'</div>\
                        </div>\
                    </div>',
        },
        welcomeTmpl = '\
                    <div class="welcome-overlay">\
                        <div class="welcome">\
                            <div class="close"><span class="close"></span></div>\
                            <div class="paging"><%= prev %></div>\
                            <div class="carousel carousel-slider"><%= welcome %></div>\
                            <div class="paging"><%= next %></div>\
                        </div>\
                    </div>',
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
                            <img src="http://st.ksria.cn/welcome-start.png">\
                            <div class="content">\
                                <h2 class="title">' + i18n.GetLang( "welcome_start_title" ) + '</h2>\
                                <div class="desc">' + ( ver.first ? i18n.GetLang( "welcome_start_desc_first" ) : i18n.GetLang( "welcome_start_desc_update" ) ) + '</div>\
                            </div>\
                        </div>\
                       ' + getDetails( ver ) + '\
                        <div class="carousel-item" id="end">\
                            <img src="http://st.ksria.cn/welcome-end.png">\
                            <div class="content">\
                                <h2 class="title">' + i18n.GetLang( "welcome_end_title" ) +'</h2>\
                                <div class="desc">' + i18n.GetLang( "welcome_end_desc" ) +'</div>\
                            </div>\
                        </div>';
            var compiled = _.template( welcomeTmpl ),
                html     = compiled({ prev: prev_paging, next: next_paging, welcome: tmpl });
            $( "body" ).append( html );
            setTimeout( function() {
                open();
                carousel();
                listen();
            }, 10 );
        }
    }
});