
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "message", "comps" ], function( $, Mousetrap, _, Notify, i18n, message, comps ) {

    "use strict";

    /*********************************************
     * Data Structure
     *********************************************/

    var storage = ( function() {
        var _themes  = [ "19CAAD", "8CC7B5", "A0EEE1", "BEE7E9", "BEEDC7", "D6D5B7", "D1BA74", "E6CEAC", "ECAD9E", "F4606C", "3D5AFE", "363b40", "222222", "ffffff", "random", "custom" ],
            _storage = {
                theme: "#" + _themes[0],
                size: "normal",
                time:    { color: "", display: "true" },
                day:     { color: "", display: "true" },
                devices: { color: "", display: "true" },
                topsites: { display: "true" },
                css: "",
                version: chrome.runtime.getManifest().version.replace( /.\d{2,}/, "" ),
            },
            key     = "simptab-tenmode-option",
            random  = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) + min );
            };

        function Storage() {
            this.db = localStorage[ key ];
            if ( !this.db ) {
                this.db = $.extend( {}, _storage );
                localStorage.setItem( key, JSON.stringify( this.db ));
            } else this.db = JSON.parse( this.db );
            this.themes = _themes;
            this.key    = key;
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

        Storage.prototype.Random = function() {
            var idx = random( 0, this.themes.length - 4 );
            return this.themes[ idx ];
        }

        return new Storage();

    })();

    /*********************************************
     * Common
     *********************************************/

    function readStorage( selector, key ) {
        var color   = storage.db[ key ].color,
            display = storage.db[ key ].display,
            size    = storage.db.size;
        color && $( selector ).css( "color", color );
        size    != "normal" && $( selector ).addClass( key + "-zen-mode-" + size );
        display == "false" && $( selector ).hide();
        key == "time" && correctWinSize();
    }

    function setModuleSize( type ) {
        type = type == "normal" ? type = "" : "-" + type;
        [ "time", "day", "devices" ].forEach( function( item ) {
            $( "." + item + "-zen-mode" )
                .removeClass()
                .addClass( item + "-zen-mode" )
                .addClass( item + "-zen-mode" + type );
        });
        correctWinSize();
    }

    function custom() {
        if ( $( "#zen-mode-style" ).length >= 0 ) $( "#zen-mode-style" ).remove();
        $( "head" ).append( '<style id="zen-mode-style" type="text/css">' + storage.db.css + '</style>' );
    }

    function correctWinSize() {
        navigator.platform.toLowerCase() == "win32" && storage.db.size == "middle" && $( "#time" ).addClass( "time-zen-mode-middle-win" );
        navigator.platform.toLowerCase() == "win32" && storage.db.size == "large"  && $( "#time" ).addClass( "time-zen-mode-large-win" );
    }

    function exit() {
        localStorage["simptab-topsites"] = localStorage["simptab-topsites-backup"];
        localStorage.removeItem( "simptab-topsites-backup" );

        localStorage["simptab-background-clock"] = localStorage["simptab-background-clock-backup"];
        localStorage.removeItem( "simptab-background-clock-backup" );

        localStorage["simptab-zenmode"] = "false";
    }

    /*********************************************
     * Theme
     *********************************************/

    function themeView() {
        var tmpl     = '<div class="theme name-<%- theme %> waves-effect" name="<%- theme %>" style="background-color:#<%- theme %>;"></div>',
            compiled = _.template( '<% jq.each( themes, function( idx, theme ) { %>' + tmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
            html     = compiled({ 'themes': storage.themes });
        return html;
    }

    function themeModel() {
        $( ".setting-zen-mode" ).on( "click", ".theme", function( event ) {
            var color = event.target.attributes.name.value;
            if ( color == "random" ) {
                new Notify().Render( i18n.GetLang( "notify_zen_mode_theme_random" ) );
                customTheme( "remove" );
                changAllTheme( "dark", "random" );
            } else if ( color == "ffffff" ) {
                customTheme( "remove" );
                changAllTheme( "light", "#" + event.target.attributes.name.value );
            } else if ( color == "custom" ) {
                customTheme( "add" );
            } else {
                customTheme( "remove" );
                changAllTheme( "dark", "#" + event.target.attributes.name.value );
            }
        });
        storage.themes.indexOf( storage.db.theme.replace( "#", "" ) ) == -1 && customTheme( "add" );
    }

    function customTheme( type ) {
        var target = ".setting-zen-mode .themes input";
        if ( type == "add" ) {
            if ( $(target).length > 0 ) return;
            $( ".setting-zen-mode .themes .content" ).append( '<input class="md-input" type="text" placeholder="' + i18n.GetLang( "zen_mode_setting_theme_placeholder" ) + '"/>' );
            setTimeout( function() {
                storage.themes.indexOf( storage.db.theme.replace( "#", "" ) ) == -1 &&
                    $(target).val( storage.db.theme );
                $(target)
                    .animate({ "opacity": 1 }).on( "keyup", function( event ) {
                        storage.db.theme = event.target.value;
                        storage.db.theme == "" && ( storage.db.theme = "#" + storage.themes[ 0 ]);
                        changAllTheme( "dark", storage.db.theme );
                });
            }, 10 );
        } else {
            setTimeout( function() {
                $(target).fadeOut( "slow", function() {
                    $(target).remove();
                });
            }, 10 );
        }
    }

    function changAllTheme( type, theme ) {
        var value = type == "light" ? "#555" : "#fff";

        storage.db.theme         = theme;
        storage.db.time.color    = value;
        storage.db.day.color     = value;
        storage.db.devices.color = value;
        storage.Set();

        theme == "random" && ( theme = "#" + storage.Random() );
        $( ".clock-bg-zen-mode" ).css( "background-color", theme );
        readStorage( "#time", "time" );
        readStorage( ".day-zen-mode", "day" );
        readStorage( ".devices-zen-mode", "devices" );
        changeTopsitsTheme( type );
    }

    function changeTopsitsTheme( type ) {
        var value = type == "light" ? "#555" : "#fff";
        $( ".topsites a" ).css( "color", value );
    }

    /*********************************************
     * Module
     *********************************************/

     function moduleView() {
        var items = [{ name: i18n.GetLang( "zen_mode_setting_modules_size_normal" ), value: "normal" }, { name: i18n.GetLang( "zen_mode_setting_modules_size_middle" ), value: "middle" }, { name: i18n.GetLang( "zen_mode_setting_modules_size_large" ), value: "large" }];
        return '<div class="content">\
                    <div class="label">' + i18n.GetLang( "zen_mode_setting_modules_size" ) + '</div>\
                    <div class="group">' + comps.Dropdown( ".setting-zen-mode", "size-dpd", items, storage.db.size ) + '</div>\
                </div>\
                <div class="content">\
                    <div class="label">' + i18n.GetLang( "zen_mode_setting_modules_time" ) + '</div>\
                    <div class="group">' + comps.Switches( "time-cbx" ) + '</div>\
                </div>\
                <div class="content">\
                    <div class="label">' + i18n.GetLang( "zen_mode_setting_modules_day" ) + '</div>\
                    <div class="group">' + comps.Switches( "day-cbx" ) + '</div>\
                </div>\
                <div class="content">\
                    <div class="label">' + i18n.GetLang( "zen_mode_setting_modules_devices" ) + '</div>\
                    <div class="group">' + comps.Switches( "devices-cbx" ) + '</div>\
                </div>\
                <div class="content">\
                    <div class="label">' + i18n.GetLang( "zen_mode_setting_modules_topsizes" ) + '</div>\
                    <div class="group">' + comps.Switches( "topsites-cbx" ) + '</div>\
                </div>';
     }

     function moduleModel() {
        $( ".setting-zen-mode .module" ).find( "input[id=time-cbx]"     ).prop( "checked", storage.db.time.display == "true" ? true : false );
        $( ".setting-zen-mode .module" ).find( "input[id=day-cbx]"      ).prop( "checked", storage.db.day.display == "true" ? true : false );
        $( ".setting-zen-mode .module" ).find( "input[id=devices-cbx]"  ).prop( "checked", storage.db.devices.display == "true" ? true : false );
        $( ".setting-zen-mode .module" ).find( "input[id=topsites-cbx]" ).prop( "checked", storage.db.topsites.display == "true" ? true : false );
        $( ".setting-zen-mode .size-dpd" )[0].addEventListener( "dropdown", function( event ) {
            storage.db.size = event.data.value;
            storage.Set();
            setModuleSize( storage.db.size );
        });
        $( ".setting-zen-mode" ).on( "change", ".module input", function( event ) {
            var $cb = $(this),
                key = $cb[0].id.replace( "-cbx", "" ),
                selector = "."+ key + "-zen-mode";
            $cb.val( $cb.prop( "checked" ));
            storage.db[key].display = $cb.val();
            storage.Set();
            storage.db[key].display == "false" ? $( selector ).fadeOut( 500 ) : $( selector ).fadeIn( 500 );
        });
     }

    /*********************************************
     * CSS
     *********************************************/

    function cssView() {
        return '<div class="content"><textarea class="md-textarea"></textarea></div>';
    }

    function cssModel() {
        $( ".setting-zen-mode .css textarea" ).val( storage.db.css );
        $( ".setting-zen-mode" ).on( "keyup", ".css textarea", function( event ) {
            storage.db.css = event.target.value;
            storage.Set();
            custom();
        });
    }

    /*********************************************
     * Footer
     *********************************************/

    function footerModel() {
        $( ".setting-zen-mode" ).on( "click", ".footer .exit", function( event ) {
            new Notify().Render( i18n.GetLang( "notify_zen_mode_exit" ) );
            exit();
            close();
        });
        $( ".setting-zen-mode" ).on( "click", ".footer .close", function( event ) {
            close();
        });
        $( ".setting-zen-mode" ).on( "click", ".footer .export", function( event ) {
            var data = "data:text/json;charset=utf-8," + encodeURIComponent( localStorage[ storage.key ] ),
                $a   = $( '<a style="display:none" href='+ data + ' download="simptab-zenmode-config.json"></a>' ).appendTo( "body" );
            $a[0].click();
            $a.remove();
        });
        $( ".setting-zen-mode" ).on( "click", ".footer .import", function( event ) {
            var input  = document.createElement( "input" ),
                $input = $(input),
                onload = function( event ) {
                    if ( event && event.target && event.target.result ) {
                        try {
                            storage.db = JSON.parse( event.target.result );
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
    }

    /*********************************************
     * Zen mode Setting
     *********************************************/

    function settingTmpl() {
        var tmpl = '\
                    <div class="setting-zen-mode">\
                        <div class="themes">\
                            <div class="title">' + i18n.GetLang( "zen_mode_setting_theme_title" ) + '</div>\
                            <div class="content">' + themeView() + '</div>\
                        </div>\
                        <div class="module">\
                            <div class="title">' + i18n.GetLang( "zen_mode_setting_modules" ) + '</div>\
                            ' + moduleView() + '\
                        </div>\
                        <div class="css">\
                            <div class="title">' + i18n.GetLang( "zen_mode_setting_css" ) + '</div>\
                            ' + cssView() + '\
                        </div>\
                        <div class="footer">\
                            <div class="waves-effect button import">' + i18n.GetLang( "zen_mode_setting_import" ) + '</div>\
                            <div class="waves-effect button export">' + i18n.GetLang( "zen_mode_setting_export" ) + '</div>\
                            <div class="waves-effect button exit">' + i18n.GetLang( "zen_mode_setting_exit" ) + '</div>\
                            <div class="waves-effect button close">' + i18n.GetLang( "zen_mode_setting_close" ) + '</div>\
                        </div>\
                    </div>';
        $( "body" ).append( tmpl );

        themeModel();
        moduleModel();
        cssModel();
        footerModel();
    }

    function open() {
        setTimeout( function(){
            $( ".setting-zen-mode" ).css({ "transform": "translateY(0px)", "opacity": 1 });
        }, 10 );
    }

    function close() {
        $( document ).off( "click", ".setting-zen-mode .size-dpd" );
        $( document ).off( "click", ".setting-zen-mode .size-dpd .downlist .list-filed" );
        $( ".setting-zen-mode" ).css({ "transform": "translateY(100px)", "opacity": 0 });
        setTimeout( function(){
            $( ".setting-zen-mode" ).remove();
        }, 500 );
    }

    /*********************************************
     * Initialize
     *********************************************/

    function timeMode() {
        $( ".clock" ).css( "background-color", storage.db.theme != "random" ? storage.db.theme : "#" + storage.Random() );
        $( ".clock" ).addClass( "clock-bg-zen-mode" ).css( "z-index", "initial" );
        $( "#time"  ).addClass( "time-zen-mode" );
        readStorage( "#time", "time" );
    }

    function dayMode() {
        var date = new Date(),
            day  = date.toLocaleDateString( i18n.GetShort(), { weekday: 'long', month: 'long', day: 'numeric' });
        $( "#time" ).after( '<div class="day-zen-mode">' + day + '</div>' );
        readStorage( ".day-zen-mode", "day" );
    }

    function devicesMode() {
        navigator.getBattery().then( function( battery ) {
            var network = navigator.onLine ? '≈ ' + navigator.connection.downlink + ' Mbps' : 'Offline',
                charge  = ( battery.level * 100 ).toFixed() + '% ' + ( battery.charging ? 'Charging' : 'Battery' );
            $( ".day-zen-mode" ).after( '<div class="devices-zen-mode">' + network + ' · ' + charge + '</div>' );
            readStorage( ".devices-zen-mode", "devices" );
        });
    }

    function ohtersMode() {
        $( ".controlbar" ).addClass( "controlbar-zen-mode" );
        $( ".progress"   ).addClass( "progress-zen-mode" );
        $( ".clock"      ).append( '<div class="setting-trigger-zen-mode"></div>' );
        custom();
        storage.db.theme == "#ffffff" && $( ".setting-trigger-zen-mode" ).addClass( "setting-trigger-white-zen-mode" );
        $( ".setting-trigger-zen-mode" ).on( "click", function( event ) {
            if ( $( "body" ).find( ".setting-zen-mode" ).length > 0 ) {
                $( ".setting-zen-mode .footer .close" )[0].click();
            } else {
                settingTmpl();
                open();
            }
        });
    }

    function topSitesMode() {
        $( ".bottom" ).addClass( "bottom-zen-mode" );
        $( ".topsites" ).addClass( "topsites-zen-mode" );
        readStorage( ".topsites", "topsites" );
        changeTopsitsTheme( storage.db.theme == "#ffffff" ? "light" : "dark" );
    }

    function shortcuts() {
        var styles = "";
        [ "5", "6", "7", "f", "m", "s", "a", "n", "u" ].forEach( function( value ) {
            styles += ".keycode-" + value + "{text-decoration: line-through!important;}";
            Mousetrap.unbind( value );
        });
        $( "head" ).append( '<style type="text/css">' + styles + '</style>' );
    }

    function subscribe() {
        message.Subscribe( message.TYPE.OPEN_ZENMODE, function( event ) {
            $( ".setting-trigger-zen-mode" )[0].click();
        });
    }

    function notify() {
        localStorage["simptab-zenmode-notify"] != "false" &&
            new Notify().Render({ content: i18n.GetLang( "notify_zen_mode_tips" ), action: i18n.GetLang( "notify_zen_mode_tips_confirm" ), callback:function (){
                localStorage["simptab-zenmode-notify"] = false;
            }});
    }

    return {
        Render: function() {
            timeMode();
            dayMode();
            devicesMode();
            ohtersMode();
            notify();

            setTimeout( function() {
                topSitesMode();
                shortcuts();
                subscribe();
            }, 500 );
        },

        Init: function() {
            localStorage["simptab-topsites-backup"] = localStorage["simptab-topsites"];
            localStorage["simptab-topsites"] = "simple";

            localStorage["simptab-background-clock-backup"] = localStorage["simptab-background-clock"];
            localStorage["simptab-background-clock"] = "show";
        },

        Exit: function() {
            exit();
        }
    }

});