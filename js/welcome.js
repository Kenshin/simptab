
define([ "jquery", "mousetrap", "lodash", "carousel", "i18n" ], function( $, Mousetrap, _, carousel, i18n ) {

    var details = {
            "others": '\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://st.ksria.cn/welcome-mask.png?201810081527">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_feature_1_title" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_feature_1_desc" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://st.ksria.cn/welcome-topsites.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_feature_2_title" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_feature_2_desc" ) +'</div>\
                        </div>\
                    </div>',
            "1.5.2": '\
                    <div class="carousel-item" id="1.5.2">\
                        <img src="http://st.ksria.cn/welcome-manage.png?201810081527">\
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
            "1.5.3": '\
                    <div class="carousel-item" id="1.5.3">\
                        <img src="http://st.ksria.cn/welcome-zenmode.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_153_title_1" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_153_desc_1" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.3">\
                        <img src="http://st.ksria.cn/welcome-quickbar.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_153_title_2" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_153_desc_2" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.3">\
                        <img src="http://st.ksria.cn/welcome-options.png">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_153_title_3" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_153_desc_3" ) +'</div>\
                        </div>\
                    </div>',
            "1.5.4": '\
                    <div class="carousel-item" id="1.5.4">\
                        <img src="http://st.ksria.cn/welcome-earth.png?201812301148">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_154_title_1" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_154_desc_1" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.4">\
                        <img src="http://st.ksria.cn/welcome-noise.png?201812301148">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_154_title_2" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_154_desc_2" ) +'</div>\
                        </div>\
                    </div>\
                    <div class="carousel-item" id="1.5.4">\
                        <img src="http://st.ksria.cn/welcome-explore.png?201812301148">\
                        <div class="content">\
                            <h2 class="title">' + i18n.GetLang( "welcome_154_title_3" ) +'</h2>\
                            <div class="desc">' + i18n.GetLang( "welcome_154_desc_3" ) +'</div>\
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
                    <span class="next"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="next" t="1539314552596" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1043" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25"><defs><style type="text/css"></style></defs><path d="M-0.064 478.464h837.504L435.712 76.672l46.144-44.48 478.144 478.144-481.6 481.472-44.48-44.48 403.648-405.248H-0.064v-63.616z" p-id="1044" fill="#ffffff"></path></svg></span>\
                </a>',
        prev_paging = '\
                <a class="waves-effect waves-circle" href="#">\
                    <span class="prev"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="prev" t="1539314235448" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3570" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25"><defs><style type="text/css"></style></defs><path d="M959.936 545.536H122.432l401.728 401.728-46.08 44.544-478.144-478.144L481.536 32.192l44.544 44.48L122.432 481.92h837.504v63.616z" p-id="3571" fill="#ffffff"></path></svg></span>\
                </a>',
        callback;

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
            callback && callback();
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
            var tag = event.target.tagName.toLowerCase(),
                cls = event.target.parentElement.className;
            tag == "path" && ( cls = event.target.parentElement.parentElement.className );
            $( '.carousel.carousel-slider' ).carousel( cls );
        });
    }

    return {
        Render: function( ver, cb ) {
            var tmpl = '<div class="carousel-item" id="start">\
                            <img src="../assets/images/welcome-start.webp">\
                            <div class="content">\
                                <h2 class="title">' + i18n.GetLang( "welcome_start_title" ) + '</h2>\
                                <div class="desc">' + ( ver.first ? i18n.GetLang( "welcome_start_desc_first" ) : i18n.GetLang( "welcome_start_desc_update" ) ) + '</div>\
                            </div>\
                        </div>\
                       ' + getDetails( ver ) + '\
                        <div class="carousel-item" id="end">\
                            <img src="http://st.ksria.cn/welcome-end.png?201810081527">\
                            <div class="content">\
                                <h2 class="title">' + i18n.GetLang( "welcome_end_title" ) +'</h2>\
                                <div class="desc">' + i18n.GetLang( "welcome_end_desc" ) +'</div>\
                            </div>\
                        </div>';
            var compiled = _.template( welcomeTmpl ),
                html     = compiled({ prev: prev_paging, next: next_paging, welcome: tmpl });
            callback     = cb;
            $( "body" ).append( html );
            setTimeout( function() {
                open();
                carousel();
                listen();
            }, 10 );
        }
    }
});