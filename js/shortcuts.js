
define([ "jquery", "mousetrap", "controlbar", "i18n", "topsites", "message" ], function( $, Mousetrap, controlbar, i18n, topsites, message ) {

    "use strict";

    var curtab,
        keys = (function() {

        var CONTROL_KEY_MAP, getKey;

        CONTROL_KEY_MAP = [
            { short: "1", long: "bookmarks"},
            { short: "2", long: "history"  },
            { short: "3", long: "apps"     },
            { short: "4", long: "newtab"   },
            { short: "5", long: "info"     },
            { short: "6", long: "download" },
            { short: "7", long: "upload", hiden: true },
            { short: "f", long: "refresh"  },
            { short: "m", long: "manage"   },
            { short: "o", long: "options"  },
            { short: "t", long: "about"    },
            { short: "s", long: "setting"  },
            { short: "a", long: "favorite" },
            { short: "n", long: "pin"      },
            { short: "u", long: "dislike"  },
        ];

        getKey = function( type ) {
            return CONTROL_KEY_MAP.map( function( item, idx ) {
                if ( !item.hiden ) return type == "short" ? item.short : item.long;
            });
        };

        function Keys(){}

        Keys.prototype.GLOBALS_KEY_MAP = [
            { short: "esc", long: "esc"  },
            { short: "?",   long: "help" },
        ];

        Keys.prototype.OTHERS_KEY_MAP = [
            { short: "b", long: "bookmarks"},
            { short: "q", long: "quickbar" },
            { short: "z", long: "topsites" },
            { short: "c", long: "zenmode" },
        ];

        Object.defineProperties( Keys.prototype, {
            "CONTROL_KEY_MAP" : {
                value        : CONTROL_KEY_MAP,
                enumerable   : true,
                configurable : true,
                writable     : false
            },
            "short" : {
                value        : getKey( "short" ),
                enumerable   : true,
                configurable : true,
                writable     : false
            },
            "long" : {
                value        : getKey( "long" ),
                enumerable   : true,
                configurable : true,
                writable     : false
            }
        });

        return new Keys();

    })();

    function formatShortcut( key ) {
        var formatter = "",
            arr       = new Array( key.length );
        $.each( arr, function ( idx, value ) {
            if ( idx < key.length - 1 ) {
                formatter += key[idx] + " ";
            }
            else {
                formatter += key[idx];
            }
        });
        return formatter;
    }

    function verifyCurrentTab( callback ) {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, function( tabs ) {
            if ( tabs && tabs.length && curtab.id === tabs[0].id ) {
                callback();
            }
        });
    }

    function listenCurrentTab() {
        chrome.tabs.getCurrent( function( tab ) {
            curtab = tab;
        });
    }

    function listenControl() {
        $.each( keys.CONTROL_KEY_MAP, function( idx, shortcut ) {
            var new_key = formatShortcut( shortcut.short );
            Mousetrap.bind( new_key , function() {
                console.log("click = " + shortcut.short.replace( / /g, "" ) );
                controlbar.AutoClick( idx );
            });
        });
    }

    function listenOthers() {
        var binds = [];
        keys.OTHERS_KEY_MAP.forEach( function( item ) { binds.push( item.short ) });
        Mousetrap.bind( binds, function( event, combo ) {
            switch ( combo ) {
                case "b":
                    message.Publish( message.TYPE.OPEN_BOOKMARKS );
                    break;
                case "q":
                    message.Publish( message.TYPE.OPEN_QUICKBAR );
                case "c":
                    message.Publish( message.TYPE.OPEN_ZENMODE  );
                    break;
            }
        });
    }

    function listenCommand() {
        chrome.commands.onCommand.addListener( function( command ) {
            console.log( 'Command:', command );
            verifyCurrentTab( function() {
                var idx = keys.long.indexOf( command );
                controlbar.AutoClick( idx );
            });
        });
    }

    function listenOminbox() {
        var prefix = "site:";
        chrome.omnibox.setDefaultSuggestion({ description : i18n.GetLang( "shortcuts_default" ) + keys.short.join(", ").replace( ", ,", "," ) + ", site" });
        chrome.omnibox.onInputChanged.addListener( function( command, suggest ) {
            var suggestResult = [],
                command       = command.toLowerCase();
            if ( command.trim() === "" ) {
                for( var i = 0, len = keys.short.length; i < len; i++ ) {
                    if ( keys.short[i] ) suggestResult.push({ content : keys.short[i], description : i18n.GetControlbarLang( keys.long[i] ) });
                }
            }
            else if ( command.trim() === "site" ) {
                var sites = topsites.sites(),
                    site;
                for( var i = 0, len = sites.length; i < len; i++ ) {
                    site       = sites[i];
                    site.title = site.url == site.title ? "No Title" : site.title;
                    suggestResult.push({ content : prefix + site.url, description : site.title });
                }
            }
            else if ( keys.short.indexOf( command ) !== -1 || keys.long.indexOf( command ) !== -1 ) {
                var idx = keys.short.indexOf( command );
                if ( idx == -1 ) {
                    idx     = keys.long.indexOf( command );
                    command = keys.short[idx];
                }
                suggestResult.push({ content : " " + command, description : i18n.GetControlbarLang( keys.long[idx] ) });
            }
            else if ( keys.short.indexOf( command ) === -1 ) {
                suggestResult.push({ content : " " + command, description : i18n.GetLang( "shortcuts_fail_key" ) + command });
            }
            suggest( suggestResult );
        });
        chrome.omnibox.onInputEntered.addListener( function( command ) {
            console.log( "SimpTab command is " + command );
            verifyCurrentTab( function() {
                var idx = keys.short.indexOf( command.trim().toLowerCase() );
                if ( idx > -1 ) {
                    controlbar.AutoClick( idx );
                }
                else if ( command.indexOf( prefix ) != -1 ) {
                    chrome.tabs.update( curtab.id, { url : command.replace( prefix, "" ) } );
                }
            });
        });
    }

    function createKeymapTmpl( title, map, prefix ) {
        var html = "";
        $.each( map, function( idx, shortcut ) {
            var key  = shortcut.short,
                desc = i18n.GetLang( prefix + shortcut.long ),
                tmpl = '<div class="keymap"><div class="map"><div class="key">' + key + '</div></div><div class="desc keycode-' + key + '">' + desc + '</div></div>';
            html += tmpl;
        });
        return '<div style="width: 250px;"><div class="subtitle">' + title + '</div>' + html + '</div>';
    }

    function open() {
        setTimeout( function(){
            $( ".shortcuts" ).css({ "transform": "translateY(0px)", "opacity": 1 });
        }, 10 );
    }

    function close() {
        $( ".shortcuts" ).css({ "transform": "translateY(100px)", "opacity": 0 });
        setTimeout( function(){
            $( ".shortcuts" ).remove();
        }, 500 );
    }

    function listenHelp() {
        Mousetrap.bind( "?", function() {
            if ( $( ".shortcuts" ).children().length > 0 ) {
                close();
            } else {
                var html = createKeymapTmpl( i18n.GetLang( "shortcuts_key_global_title" ),  keys.GLOBALS_KEY_MAP, "shortcuts_key_" );
                html    += createKeymapTmpl( i18n.GetLang( "shortcuts_key_others_title" ),  keys.OTHERS_KEY_MAP,  "shortcuts_key_" );
                html    += createKeymapTmpl( i18n.GetLang( "shortcuts_key_control_title" ), keys.CONTROL_KEY_MAP,  "controlbar_"   );
                $( "body" ).append( '<div class="shortcuts"><div class="title">' + i18n.GetLang( "shortcuts_title" ) + '</div><div class="keymaps">' + html + '</div></div>' );
                open();
            }
        });
    }

    function listenESC() {
        Mousetrap.bind( "esc", function() {
            var cls = $("body").children().last()[0].className.toLowerCase();
            // hack code
            switch ( cls ) {
                case "quickbar-overlay":
                    $( ".quickbar-overlay" )[0].click();
                    break;
                case "dialog-overlay":
                    $( ".dialog .close" )[0].click();
                    break;
                case "shortcuts":
                    close();
                    break;
                case "bm-overlay":
                    if ( $( ".bm" ).hasClass( "open" ) ) {
                        $( ".bm" ).css({ "transform": "translateX(-300px)", "opacity": 0 }).removeClass( "open" );
                    } else {
                        $( ".setting" ).hasClass( "open" ) &&
                            $( ".controlink .settingicon" ).trigger( "click" );
                    }
                    break;
                case "setting-zen-mode":
                    $( ".setting-zen-mode" ).find( ".footer .close" )[0].click();
                    break;
            }
        });
    }

    function listenTopsites() {
        [ 1,2,3,4,5,6,7,8,9 ].forEach( function( item ) {
            Mousetrap.bind( "z " + item, function( event, combo ) {
                var idx = combo.replace( "z ", "" ) - 1;
                $( ".topsites" ).length > 0 ?
                    $( ".topsites" ).find( "a" )[idx].click()
                    : $( ".senior" ).find( "a" )[idx].click();
            });
        });
    }

    return {
        Init: function () {
            listenCurrentTab();
            listenOthers();
            listenControl();
            listenCommand();
            listenOminbox();
            listenHelp();
            listenESC();
            listenTopsites();
        }
    };
});
