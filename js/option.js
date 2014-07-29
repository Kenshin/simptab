
define([ "jquery" ], function( $ ) {

    return {
        Init: function() {
            var mode = localStorage["simptab-background-mode"];
            if ( mode != undefined ) {
                $( ".radio input[value=" + mode + "]" ).attr( "checked", true );
                $( ".radio input[value!=" + mode + "]" ).attr( "checked", false );
            }
        },

        Listen: function () {

            $( ".radio input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
            });
        },

        Get: function () {
            return $( ".radio input[value=day]" ).attr( "checked" );
        }
    }
});
