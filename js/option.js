
define([ "jquery", "date" ], function( $, date ) {

    changeRadioState = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.find( "span" ).length > 0 ) {
            $prev.find( "span" ).removeClass( "checked" );
            $prev.find( "span" ).addClass( "unchecked" );
            $current.find( "span" ).removeClass( "unchecked" );
            $current.find( "span" ).addClass( "checked" );
        }
        else {
            $next.find( "span" ).removeClass( "checked" );
            $next.find( "span" ).addClass( "unchecked" );
            $current.find( "span" ).removeClass( "unchecked" );
            $current.find( "span" ).addClass( "checked" );
        }
    }

    return {
        Init: function() {

            var mode = localStorage["simptab-background-mode"];
            if ( mode != undefined ) {
                $( ".changestate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".changestate input[value!=" + mode + "]" ).attr( "checked", false );
                changeRadioState( $( ".changestate input[value=" + mode + "]" ) );
            }

            mode = localStorage["simptab-background-clock"];
            if ( mode != undefined ) {
                $( ".clockstate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".clockstate input[value!=" + mode + "]" ).attr( "checked", false );
                changeRadioState( $( ".clockstate input[value=" + mode + "]" ) );
            }
        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
                changeRadioState( $( event.currentTarget ));
            });

            $( ".clockstate input" ).click( function( event ) {
                localStorage["simptab-background-clock"] = $(event.currentTarget).attr( "value" );
                changeRadioState( $( event.currentTarget ));
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
