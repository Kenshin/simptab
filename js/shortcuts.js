
define([ "jquery", "mousetrap", "controlbar", "i18n" ], function( $, Mousetrap, controlbar, i18n ) {

    "use strict";

    var CONTROL_KEY_MAP = [
        { short: "book", long: "bookmarks"},
        { short: "his",  long: "history"  },
        { short: "app",  long: "apps"     },
        { short: "info", long: "info"     },
        { short: "down", long: "download" },
        { short: "up",   long: "upload"   },
        { short: "set",  long: "setting"  },
        { short: "fav",  long: "favorite" }
    ];

    function getKey( type ) {
        return CONTROL_KEY_MAP.map( function( item, idx ) {
            return type == "short" ? item.short : item.long;
        });
    }

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

    function listenControl() {

        $.each( CONTROL_KEY_MAP, function( idx, shortcut ) {
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
            var idx = -1;
            switch ( command ) {
                case "info":     idx = 3; break;
                case "download": idx = 4; break;
                case "upload":   idx = 5; break;
                case "favorite": idx = 7; break;
            }
            controlbar.AutoClick( idx );
        });
    }

    function listenOminbox() {

        chrome.omnibox.setDefaultSuggestion({ description : "输入空格显示全部的命令列表，目前支持的关键字仅包括：" + getKey("short").join(", ") });

        chrome.omnibox.onInputChanged.addListener( function( command, suggest ) {
            console.log( "SimpTab command is " + command );

            var suggestResult = [],
                shorts        = getKey( "short" ),
                longs         = getKey( "long" );
            if ( command.trim() === "" ) {
                for( var i = 0, len = CONTROL_KEY_MAP.length; i < len; i++ ) {
                    suggestResult.push({ content : shorts[i], description : i18n.GetControlbarLang( longs[i] ) });
                }
                suggest( suggestResult );
            }
          });

        chrome.omnibox.onInputEntered.addListener( function( command ) {
            console.log( "SimpTab command is " + command );
            var short = getKey( "short" ),
                idx   = short.indexOf( command );
            if ( idx > -1 ) {
                controlbar.AutoClick( idx );
            }
            else {
                // TO DO
            }
        });
    }

    return {
        Init: function () {
            listenControl();
            listenCommand();
            listenOminbox();
        }
    };
});
