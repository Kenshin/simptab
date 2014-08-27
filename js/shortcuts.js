
define([ "jquery", "mousetrap", "controlbar" ], function( $, Mousetrap, controlbar ) {

    var CONTROL_KEY_MAP = [
        "b o o k",
        "h i s",
        "a p p",
        "i n f o",
        "d o w n",
        "s e t"
    ];

    listenControl = function () {

        $.each( CONTROL_KEY_MAP, function( idx, shortcut ) {
            Mousetrap.bind( shortcut, function() {
                console.log("click = " + shortcut.replace( / /g, "" ) );
                controlbar.AutoClick( idx );
            });
        });

    }

    return {
        Init: function () {
            listenControl();
        }
    }
});
