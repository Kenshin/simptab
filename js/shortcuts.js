
define([ "jquery", "mousetrap", "controlbar", "i18n" ], function( $, Mousetrap, controlbar, i18n ) {

    "use strict";

    var CONTROL_KEY_MAP = [
        "book",
        "his",
        "app",
        "info",
        "down",
        "up",
        "set",
        "fav"
    ];

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
            var new_key = formatShortcut( shortcut );
            Mousetrap.bind( new_key , function() {
                console.log("click = " + shortcut.replace( / /g, "" ) );
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

        chrome.omnibox.setDefaultSuggestion({ description : "输入空格显示全部的命令列表，目前支持的关键字包括：book, his, app, info, down, up, set, fav" });

        chrome.omnibox.onInputChanged.addListener( function( command, suggest ) {
            console.log( "SimpTab command is " + command );

            var suggestResult =[];
            if ( command.trim() === "" ) {
                for( var i = 0, len = CONTROL_KEY_MAP.length; i < len; i++ ) {
                    suggestResult.push( { content : CONTROL_KEY_MAP[i], description : CONTROL_KEY_MAP[i] } );
                }
                suggest( suggestResult );
            }
          });

        chrome.omnibox.onInputEntered.addListener( function( command ) {
            console.log( "SimpTab command is " + command );
            var idx = CONTROL_KEY_MAP.indexOf( command );
            if ( idx > -1 ) {
                controlbar.AutoClick( idx );
            }
            else {

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
