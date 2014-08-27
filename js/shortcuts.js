
define([ "jquery", "mousetrap" ], function( $, Mousetrap ) {

    var CONTROL_KEY_MAP = [
        "a p p",
        "b o o k",
        "h i s",
        "i n f o",
        "d o w n",
        "s e t"
    ];

    listenControl = function () {

        $.each( CONTROL_KEY_MAP, function( idx, shortcut ) {
            Mousetrap.bind( shortcut, function() {
                console.log("click = " + shortcut.replace( / /g, "" ) );
            });
        });

    }

    return {
        Init: function () {
            listenControl();
        }
    }
});
