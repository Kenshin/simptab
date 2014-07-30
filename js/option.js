
define([ "jquery", "date" ], function( $, date ) {

    return {
        Init: function() {

            var mode = localStorage["simptab-background-mode"];
            if ( mode != undefined ) {
                $( ".changestate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".changestate input[value!=" + mode + "]" ).attr( "checked", false );
            }

            mode = localStorage["simptab-background-clock"];
            if ( mode != undefined ) {
                $( ".clockstate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".clockstate input[value!=" + mode + "]" ).attr( "checked", false );
            }
        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
            });

            $( ".clockstate input" ).click( function( event ) {
                localStorage["simptab-background-clock"] = $(event.currentTarget).attr( "value" );
                if ( localStorage["simptab-background-clock"] == "show") {
                    date.Show();
                }
                else {
                    date.Hide();
                }
            });
        },

        Get: function ( state ) {

            if ( state == "changestate" ) {
                return $( ".changestate input[value=day]" ).attr( "checked" );
            }
            else if ( state == "clockstate" ) {
                return $( ".clockstate input[value=show]" ).attr( "checked" );
            }

        }
    }
});
