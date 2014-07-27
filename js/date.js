
define([ "jquery" ], function( $ ) {

    formatMinutes = function ( value ) {
        if ( value < 10 ) {
        	return "0" + value;
        }
        return value;
    }

    return {
        Show: function () {
            var date = new Date();

            $( "#time" ).text( date.getHours() + ":" + formatMinutes(date.getMinutes()) );
            setInterval(function() {
                date = new Date();
                $( "#time" ).text(date.getHours() + ":" + formatMinutes(date.getMinutes()) );
            }, 1000 * 30 );
        }
    }
});
