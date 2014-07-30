
define([ "jquery" ], function( $ ) {

    return {
        Init: function() {
            var mode = localStorage["simptab-background-mode"];
            if ( mode != undefined ) {
                $( ".changestate input[value=" + mode + "]" ).attr( "checked", true );
                $( ".changestate input[value!=" + mode + "]" ).attr( "checked", false );
            }
        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
            });
        },

        Get: function () {
            return $( ".changestate input[value=day]" ).attr( "checked" );
        }
    }
});
