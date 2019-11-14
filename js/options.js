
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    /*********************************************
     * Data Structure
     *********************************************/

    var storage = ( function () {
            var key      = "simptab-options",
                _storage = {
                    version: chrome.runtime.getManifest().version.replace( /.\d{2,}/, "" ),
                    topsites: {
                        enable: false,
                        custom: "",
                    },
                    css: "",
                    title: "",
                    search: [
                        '{"key":"g",  "color": "#4285F4", "title":"谷歌搜索",    "query": "https://www.google.com/search?q={query}"}',
                        '{"key":"b",  "color": "#0C8484", "title":"必应搜索",    "query": "https://bing.com/search?q={query}"}',
                        '{"key":"dj", "color": "#AC525C", "title":"多吉翻译",    "query": "https://www.dogedoge.com/results?q={query}"}',
                        '{"key":"d",  "color": "#DE5833", "title":"DuckDuckGo", "query": "https://duckduckgo.com/?q={query}"}',
                        '{"key":"mg", "color": "#26262A", "title":"Magi",       "query": "https://magi.com/search?q={query}"}',
                        '{"key":"bd", "color": "#2319DC", "title":"百度搜索",    "query": "https://www.baidu.com/s?wd={query}"}',
                        '{"key":"wx", "color": "#1AAD19", "title":"微信搜索",    "query": "https://weixin.sogou.com/weixin?type=2&s_from=input&query={query}"}',
                        '{"key":"z",  "color": "#0084FF", "title":"知乎搜索",    "query": "http://zhihu.sogou.com/zhihu?query={query}"}',
                        '{"key":"bk", "color": "#459DF5", "title":"百科搜索",    "query": "http://www.baike.com/wiki/{query}"}',
                        '{"key":"wk", "color": "#1177BB", "title":"维基百科",    "query": "https://zh.wikipedia.org/wiki/{query}"}',
                        '{"key":"jd", "color": "#C81522", "title":"京东",       "query": "https://search.jd.com/Search?keyword={query}&enc=utf-8"}',
                        '{"key":"tb", "color": "#FF692F", "title":"淘宝",       "query": "https://s.taobao.com/search?q={query}"}',
                        '{"key":"v2", "color": "#333344", "title":"V2EX",      "query": "https://www.sov2ex.com/?q={query}"}',
                        '{"key":"db", "color": "#55711C", "title":"豆瓣搜索",    "query": "https://www.douban.com/search?source=suggest&q={query}"}',
                    ],
                    unsplash: [ "collection/3593484", "collection/3593482", "collection/2463312", "collection/614656", "collection/1111575", "collection/1717137", "collection/445266", "collection/610876", "collection/1457745", "collection/782142", "collection/1136512", "collection/869152", "collection/782123", "collection/595970", "collection/641379", "collection/488182", "collection/142376" ],
                    unsplash_screen: "",
                    subscribe: {
                        sequence: false,
                        index: 0
                    },
                    mobile_host: "",
                    carousel: "-1",
                    hour12: false,
                    history: false,
                };

            function Storage() {
                this.db = localStorage[ key ];
                if ( !this.db ) {
                    this.db = $.extend( {}, _storage );
                } else this.db = this.Verify( JSON.parse( this.db ));
                this.key = key;
                localStorage.setItem( key, JSON.stringify( this.db ));
            }

            Storage.prototype.Set = function() {
                localStorage.setItem( key, JSON.stringify( this.db ));
            }

            Storage.prototype.Get = function() {
                return this.db;
            }

            Storage.prototype.Clear = function() {
                localStorage.removeItem( key );
            }

            Storage.prototype.Verify = function( target ) {
                if ( target.version == "1.5.3" ) {
                    target.mobile_host = "";
                    target.carousel    = "-1";
                    target.history     = false;
                    target.version     = "1.5.4";
                }
                return target;
            }

            return new Storage();

        })();

    /*********************************************
     * Custom unsplash
     *********************************************/

    function unsplashView() {
        var items = [{name: i18n.GetLang( "options_carousel_value_1" ), value: "-1" },{name: i18n.GetLang( "options_carousel_value_5" ), value: "5" },{name:i18n.GetLang( "options_carousel_value_10" ) , value: "10" },{name: i18n.GetLang( "options_carousel_value_30" ), value: "30" },{name:i18n.GetLang( "options_carousel_value_60" ), value: "60" }];
        var tmpl = '<div>\
                        <div class="switche">\
                            <div class="label">' + i18n.GetLang( "options_custom_unsplash_cbx" ) + '</div>\
                            ' + comps.Switches( "custom-unsplash-cbx" ) + '\
                        </div>\
                        <div class="division"></div>\
                        <div class="label">' + i18n.GetLang( "options_custom_unsplash_label" ) + '</div>\
                        <textarea class="md-textarea custom-unsplash"></textarea>\
                        <div class="notice">' + i18n.GetLang( "options_custom_unsplash_notice" ) + '</div>\
                        <div class="division"></div>\
                        <div class="label" style="margin-top:10px;">' + i18n.GetLang( "options_custom_unsplash_screen_label" ) + '</div>\
                        <input class="md-input custom-unsplash-screen" type="text" placeholder="' + i18n.GetLang( "options_custom_unsplash_screen_placeholder" ) + '"/>\
                        <div class="notice">' + i18n.GetLang( "options_custom_unsplash_screen_notice" ) + '</div>\
                        <div class="division"></div>\
                        <div class="label" style="margin-top:10px;">' + i18n.GetLang( "options_custom_mobile_lable" ) + '</div>\
                        <input class="md-input custom-mobile" type="text" placeholder="' + i18n.GetLang( "options_custom_mobile_placeholder" ) + '"/>\
                        <div class="notice">' + i18n.GetLang( "options_custom_mobile_notice" ) + '</div>\
                        <div class="division"></div>\
                        <div class="switche" style="margin-bottom:0;">\
                            <div class="label">' + i18n.GetLang( "options_carousel_label" ) + '</div>\
                            ' + comps.Dropdown( ".options", "carousel-dpd", items, !storage.db.carousel ? "-1" : storage.db.carousel ) + '\
                        </div>\
                        <div class="notice">' + i18n.GetLang( "options_carousel_notice" ) + '</div>\
                        <div class="division"></div>\
                        <div class="switche">\
                            <div class="label">' + i18n.GetLang( "options_history_label" ) + '</div>\
                            ' + comps.Switches( "history-cbx" ) + '\
                        </div>\
                        <div class="notice">' + i18n.GetLang( "options_history_notice" ) + '</div>\
                        <div class="division"></div>\
                    </div>\
                   ';
        return tmpl;
    }

    function unsplashModel() {
        $( ".options .custom-unsplash" ).find( "textarea" ).text( storage.db.unsplash );
        $( ".options" ).on( "keyup", ".custom-unsplash textarea", function( event ) {
            storage.db.unsplash = event.target.value.split( "," );
            storage.Set();
        });
        $( ".options .custom-unsplash .custom-unsplash-cbx" ).find( "input" ).prop( "checked", storage.db.subscribe.sequence );
        $( ".options .custom-unsplash .custom-mobile"          ).val( storage.db.mobile_host );
        $( ".options .custom-unsplash .custom-unsplash-screen" ).val( storage.db.unsplash_screen );
        $( ".options .custom-unsplash .history-cbx" ).find( "input" ).prop( "checked", storage.db.history );
        $( ".options" ).on( "change", ".custom-unsplash .custom-unsplash-cbx input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            storage.db.subscribe.sequence = value;
            storage.Set();
        });
        $( ".options" ).on( "keyup", ".custom-unsplash .custom-unsplash-screen", function( event ) {
            storage.db.unsplash_screen = event.target.value;
            storage.Set();
        });
        $( ".options" ).on( "keyup", ".custom-unsplash .custom-mobile", function( event ) {
            storage.db.mobile_host = event.target.value;
            storage.Set();
        });
        $( ".options .carousel-dpd" )[0].addEventListener( "dropdown", function( event ) {
            storage.db.carousel = event.data.value;
            storage.Set();
            new Notify().Render( i18n.GetLang( "notify_carousel" ) );
        });
        $( ".options" ).on( "change", ".history-cbx input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            storage.db.history = value;
            storage.Set();
        });
    }

    /*********************************************
     * Custom style
     *********************************************/

    function customStyleView() {
        var tmpl = '<textarea class="md-textarea"></textarea>\
                    <div class="notice">' + i18n.GetLang( "options_custom_style_notice" ) + '</div>';
        return tmpl;
    }

    function customStyleModel() {
        $( ".options .custom-style" ).find( "textarea" ).text( storage.db.css );
        $( ".options" ).on( "keyup", ".custom-style textarea", function( event ) {
            storage.db.css = event.target.value;
            storage.Set();
            custom();
        });
    }

    function custom() {
        if ( $( "#simptab-options" ).length >= 0 ) $( "#simptab-options" ).remove();
        $( "head" ).append( '<style id="simptab-options" type="text/css">' + storage.db.css + '</style>' );
    }

    /*********************************************
     * Custom topsites
     *********************************************/

    function customTpView() {
        var tmpl = '<div class="switche">\
                        <div class="label">' + i18n.GetLang( "options_custom_tp_cbx" ) + '</div>\
                        ' + comps.Switches( "custom-tp-cbx" ) + '\
                   </div>\
                   <div class="custom-tp-fields">\
                        <textarea class="md-textarea"></textarea>\
                        <div class="notice">' + i18n.GetLang( "options_custom_tp_notice" ) + '</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function customTpModel() {
        var textareaState = function( state ) {
            state ? $( ".options .custom-tp-fields" ).removeClass( "hide" ).addClass( "show" ) : $( ".options .custom-tp-fields" ).removeClass( "show" ).addClass( "hide" );
        };
        $( ".options .custom-tp" ).find( "input[id=custom-tp-cbx]" ).prop( "checked", storage.db.topsites.enable );
        $( ".options .custom-tp" ).find( "textarea" ).text( storage.db.topsites.custom );
        textareaState( storage.db.topsites.enable );
        $( ".options" ).on( "change", ".custom-tp input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            textareaState( value );
            storage.db.topsites.enable = value;
            storage.Set();
        });
        $( ".options" ).on( "keyup", ".custom-tp textarea", function( event ) {
            storage.db.topsites.custom = event.target.value;
            storage.Set();
        });
    }

    /*********************************************
     * Custom Search
     *********************************************/

    function customSearchView() {
        var tmpl = '<textarea class="md-textarea"></textarea>\
                    <div class="notice">' + i18n.GetLang( "options_custom_search_notice" ) + '</div>';
        return tmpl;
    }

    function customSearchModel() {
        $( ".options .custom-search" ).find( "textarea" ).text( storage.db.search.join( "\n" ) );
        $( ".options" ).on( "keyup", ".custom-search textarea", function( event ) {
            storage.db.search = event.target.value.split( "\n" );
            storage.Set();
        });
    }

    /*********************************************
     * Custom Title
     *********************************************/

    function customTitleView() {
        var tmpl = '<input class="md-input" type="text" placeholder=""/>\
                    <div class="notice">' + i18n.GetLang( "options_custom_title_notice" ) + '</div>';
        return tmpl;
    }

    function customTitleModel() {
        $( ".options .custom-title" ).find( "input" ).val( storage.db.title );
        $( ".options" ).on( "keyup", ".custom-title input", function( event ) {
            storage.db.title = event.target.value;
            storage.Set();
        });
    }

    /*********************************************
     * Custom hour
     *********************************************/

    function customHourView() {
        var tmpl = '<div class="switche">\
                        <div class="label">' + i18n.GetLang( "options_custom_hour_notice" ) + '</div>\
                        ' + comps.Switches( "custom-hour-cbx" ) + '\
                   </div>\
                   ';
        return tmpl;
    }

    function customHourModel() {
        $( ".options .custom-hour" ).find( "input[id=custom-hour-cbx]" ).prop( "checked", storage.db.hour12 );
        $( ".options" ).on( "change", ".custom-hour input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            storage.db.hour12 = value;
            storage.Set();
        });
    }

    /*********************************************
     * Footer
     *********************************************/

    function footerView() {
        var tmpl = '<div class="footer">\
                        <div class="waves-effect button import">' + i18n.GetLang( "zen_mode_setting_import" ) + '</div>\
                        <div class="waves-effect button export">' + i18n.GetLang( "zen_mode_setting_export" ) + '</div>\
                        <div class="waves-effect button clear">'  + i18n.GetLang( "options_footer_clear" )    + '</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function footerModel() {
        $( ".options" ).on( "click", ".footer .import", function( event ) {
            var input  = document.createElement( "input" ),
                $input = $(input),
                onload = function( event ) {
                    if ( event && event.target && event.target.result ) {
                        try {
                            storage.db = storage.Verify( JSON.parse( event.target.result ) );
                            storage.Set();
                            new Notify().Render( i18n.GetLang( "notify_zen_mode_import_success" ));
                        } catch ( error ) {
                            new Notify().Render( 2, i18n.GetLang( "notify_zen_mode_import_failed" ));
                        }
                    }
                };
            $input.attr({ type : "file", multiple : "false" })
                .one( "change", function( event ) {
                    var reader = new FileReader();
                    reader.onload = onload;
                    reader.readAsText( event.target.files[0] );
            });
            $input.trigger( "click" );
        });
        $( ".options" ).on( "click", ".footer .export", function( event ) {
            var data = "data:text/json;charset=utf-8," + encodeURIComponent( localStorage[ storage.key ] ),
                $a   = $( '<a style="display:none" href='+ data + ' download="simptab-config.json"></a>' ).appendTo( "body" );
            $a[0].click();
            $a.remove();
        });
        $( ".options" ).on( "click", ".footer .clear", function( event ) {
            new Notify().Render( "snackbar", i18n.GetLang( "notify_options_clear" ), i18n.GetLang( "notify_options_agree" ), function() {
                storage.Clear();
                new Notify().Render( i18n.GetLang( "notify_options_clear_success" ));
            });
        });
    }

    /*********************************************
     * Dialog
     *********************************************/

    function render() {
        var tmpl = '\
                    <div class="close"><span class="waves-effect close"><i class="fas fa-times-circle"></i></span></div>\
                    <div class="options">\
                        <div class="head">' + i18n.GetLang( "options_head" ) + '</div>\
                        <div class="content">\
                            <div class="title">' + i18n.GetLang( "options_custom_unsplash" ) + '</div>\
                            <div class="group custom-unsplash">' + unsplashView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_title" ) + '</div>\
                            <div class="group custom-title">' + customTitleView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_hour" ) + '</div>\
                            <div class="group custom-hour">' + customHourView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_style" ) + '</div>\
                            <div class="group custom-style">' + customStyleView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_search" ) + '</div>\
                            <div class="group custom-search">' + customSearchView() + '</div>\
                            <div class="title">' + i18n.GetLang( "options_custom_tp" ) + '</div>\
                            <div class="group custom-tp">' + customTpView() + '</div>\
                        </div>\
                        ' + footerView() + '\
                    </div>\
                    ';
        $( ".dialog" ).html( tmpl );
        unsplashModel();
        customTpModel();
        customStyleModel();
        customSearchModel();
        customTitleModel();
        customHourModel();
        footerModel();
    }

    function close() {
        $( ".dialog .close" ).click( function( event ) {
            $( document ).off( "click", ".options .carousel-dpd" );
            $( document ).off( "click", ".options .carousel-dpd .downlist .list-filed" );
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Init: function() {
            storage.db.css != "" && custom();
        },

        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                render();
                close();
            }, 450 );
        },

        Storage: storage,
    }

});