
define([ "jquery", "mousetrap", "controlbar", "i18n" ], function( $, Mousetrap, controlbar, i18n ) {

    "use strict";

    var keys = (function() {

        function Keys(){}

        Keys.prototype.CONTROL_KEY_MAP = [
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
            return Keys.prototype.CONTROL_KEY_MAP.map( function( item, idx ) {
                return type == "short" ? item.short : item.long;
            });
        }

        Keys.prototype.short = getKey( "short" );
        Keys.prototype.long  = getKey( "long"  );

        return new Keys();

    })();

    /*
    var keys = {
        CONTROL_KEY_MAP : [
            { short: "book", long: "bookmarks"},
            { short: "his",  long: "history"  },
            { short: "app",  long: "apps"     },
            { short: "info", long: "info"     },
            { short: "down", long: "download" },
            { short: "up",   long: "upload"   },
            { short: "set",  long: "setting"  },
            { short: "fav",  long: "favorite" }
        ],
        getKey : function( type ) {
            return keys.CONTROL_KEY_MAP.map( function( item, idx ) {
                return type == "short" ? item.short : item.long;
            });
        }
    }

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
    */

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
            var idx = keys.long.indexOf( command );
            controlbar.AutoClick( idx );
        });
    }

    function listenOminbox() {

        chrome.omnibox.setDefaultSuggestion({ description : "输入空格显示全部的命令列表，目前支持的关键字仅包括：" + keys.short.join(", ") });

        chrome.omnibox.onInputChanged.addListener( function( command, suggest ) {
            console.log( "SimpTab command is " + command );

            var suggestResult = [];
            if ( command.trim() === "" ) {
                for( var i = 0, len = keys.CONTROL_KEY_MAP.length; i < len; i++ ) {
                    suggestResult.push({ content : keys.short[i], description : i18n.GetControlbarLang( keys.long[i] ) });
                }
                suggest( suggestResult );
            }
          });

        chrome.omnibox.onInputEntered.addListener( function( command ) {
            console.log( "SimpTab command is " + command );
            var idx = keys.short.indexOf( command );
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
