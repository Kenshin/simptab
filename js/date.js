
define([ "jquery" ], function( $ ) {

    format = function ( value ) {
        if ( value < 10 ) {
            return "0" + value;
        }
        return value;
    }

    return {
        Show: function () {
            var date = new Date();

            $( "#time" ).text( date.getHours() + ":" + format(date.getMinutes()) );
            setInterval(function() {
                date = new Date();
                $( "#time" ).text(date.getHours() + ":" + format(date.getMinutes()) );
            }, 1000 * 30 );
        },
        Today: function () {
            var date = new Date();
            return date.getFullYear() + format( date.getUTCMonth() + 1 ) + date.getUTCDate()
        }
    }
});
