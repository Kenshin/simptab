
define([ "jquery" ], function( $ ) {

    "use strict";

    function format( value ) {
        if ( value < 10 ) {
            return "0" + value;
        }
        return value;
    }

    return {
        Show: function () {
            $( "#time" ).fadeIn( 500 );
            var date = new Date();

            // set date
            $($( "#time" ).prev()).text( date.getFullYear() + "-" + ( date.getUTCMonth() + 1 ) + "-" + date.getDate() );

            // set time
            $( "#time" ).text( date.getHours() + ":" + format(date.getMinutes()) );
            setInterval(function() {
                date = new Date();
                $( "#time" ).text( date.getHours() + ":" + format(date.getMinutes()) );
            }, 1000 * 30 );
        },

        Hide: function () {
            $( "#time" ).fadeOut( 500 );
        },

        Today: function () {
            var date = new Date();
            return date.getFullYear() + format( date.getUTCMonth() + 1 ) + format( date.getUTCDate());
        },

        Now: function () {
            var date = new Date();
            return date.getFullYear() + format( date.getUTCMonth() + 1 ) + format( date.getUTCDate()) + format( date.getHours()) + format( date.getMinutes()) + format( date.getSeconds());
        }
    }
});
