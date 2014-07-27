
define([ "jquery" ], function( $ ) {

    return {
        Show: function () {
            var date = new Date();

            $( "#time" ).text( date.getHours() + ":" + date.getMinutes() );
            setInterval(function() {
                date = new Date();
                $( "#time" ).text(date.getHours() + ":" + date.getMinutes() );
            }, 1000 * 30 );
        }
    }
});
