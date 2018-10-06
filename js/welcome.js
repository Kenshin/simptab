
define([ "jquery", "mousetrap", "lodash", "carousel", "i18n" ], function( $, Mousetrap, _, carousel, i18n ) {

    var details = {
            "1.5.1": '\
                    <div class="carousel-item" id="1.5.1">\
                        <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-adapter.png">\
                        <div class="content">\
                            <h2 class="title"></h2>\
                            <div class="desc"></div>\
                        </div>\
                    </div>',
            "1.5.2": '\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-plugins.png">\
                        <div class="content">\
                            <h2 class="title"></h2>\
                            <div class="desc"></div>\
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
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-service-v2.png">\
                            <div class="content">\
                                <h2 class="title">欢迎使用</h2>\
                                <div class="desc">' + ( ver.first ? "嗨，很高兴认识你，望你每次打开 New Tab 都有好心情。" : "您的 简 Tab 已焕然一新" ) + '</div>\
                            </div>\
                        </div>\
                       ' + getDetails( ver ) + '\
                        <div class="carousel-item" id="end">\
                            <img src="http://ojec5ddd5.bkt.clouddn.com/welcome-sites.png">\
                            <div class="content">\
                                <h2 class="title"></h2>\
                                <div class="desc">极简的 Chrome 新标签页扩展，望你每次打开都有好心情。</div>\
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