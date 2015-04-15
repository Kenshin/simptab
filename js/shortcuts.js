
define([ "jquery", "mousetrap", "controlbar" ], function( $, Mousetrap, controlbar ) {

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

    return {
        Init: function () {
            listenControl();
            listenCommand();
        }
    };
});
