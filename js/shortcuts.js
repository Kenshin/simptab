
define([ "jquery", "mousetrap", "controlbar", "i18n", "topsites" ], function( $, Mousetrap, controlbar, i18n, topsites ) {

    "use strict";

    var curtab,
        keys = (function() {

        var CONTROL_KEY_MAP, getKey;

        CONTROL_KEY_MAP = [
            { short: "book", long: "bookmarks"},
            { short: "his",  long: "history"  },
            { short: "app",  long: "apps"     },
            { short: "info", long: "info"     },
            { short: "down", long: "download" },
            { short: "up",   long: "upload"   },
            { short: "set",  long: "setting"  },
            { short: "fav",  long: "favorite" }
        ];

        getKey = function( type ) {
            return CONTROL_KEY_MAP.map( function( item, idx ) {
                return type == "short" ? item.short : item.long;
            });
        };

        function Keys(){}

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

        chrome.omnibox.setDefaultSuggestion({ description : i18n.GetLang( "shortcuts_default" ) + keys.short.join(", ") + ", site" });

        chrome.omnibox.onInputChanged.addListener( function( command, suggest ) {
            var suggestResult = [],
                command       = command.toLowerCase();
            if ( command.trim() === "" ) {
                for( var i = 0, len = keys.CONTROL_KEY_MAP.length; i < len; i++ ) {
                    suggestResult.push({ content : keys.short[i], description : i18n.GetControlbarLang( keys.long[i] ) });
                }
            }
            else if ( command.trim() === "site" ) {
                var sites = topsites.sites(),
                    site;
                for( var i = 0, len = sites.length; i < len; i++ ) {
                    site = sites[i];
                    suggestResult.push({ content : prefix + site.url, description : site.title });
                }
            }
            else if ( keys.short.indexOf( command ) !== -1 ) {
                var idx = keys.short.indexOf( command );
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
                else if ( command.indexOf( prefix ) != -1 && command.trim().toLowerCase() === "site" ) {
                    chrome.tabs.update( curtab.id, { url : command.replace( prefix, "" ) } );
                }
            });
        });
    }

    return {
        Init: function () {
            listenCurrentTab();
            listenControl();
            listenCommand();
            listenOminbox();
        }
    };
});
