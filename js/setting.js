
define([ "jquery", "date" ], function( $, date ) {

    changeRadioIcon = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.find( "span" ).length > 0 ) {
            $prev.find( "span" ).attr( "class", "unchecked" );
        }
        else {
            $next.find( "span" ).attr( "class", "unchecked" );
        }
        $current.find( "span" ).attr( "class", "checked"    );
    }

    changeRadioState = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.length > 0 ) {
            $prev.attr( "class", "lineradio" );
        }
        else {
            $next.attr( "class", "lineradio" );
        }
        $current.attr( "class", "lineradio lrselected" );
    }

    return {
        Init: function() {

            var mode = localStorage["simptab-background-mode"];
            if ( mode != undefined ) {
                $( ".changestate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".changestate input[value!=" + mode + "]" ).attr( "checked", false );
                changeRadioIcon( $( ".changestate input[value=" + mode + "]" ) );
                changeRadioState( $( ".changestate input[value=" + mode + "]" ) );
            }

            mode = localStorage["simptab-background-clock"];
            if ( mode != undefined ) {
                $( ".clockstate input[value=" +  mode + "]" ).attr( "checked", true );
                $( ".clockstate input[value!=" + mode + "]" ).attr( "checked", false );
                changeRadioIcon( $( ".clockstate input[value=" + mode + "]" ) );
                changeRadioState( $( ".clockstate input[value=" + mode + "]" ) );
            }
        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
                changeRadioIcon( $( event.currentTarget ));
                changeRadioState( $( event.currentTarget ));
            });

            $( ".clockstate input" ).click( function( event ) {

                localStorage["simptab-background-clock"] = $(event.currentTarget).attr( "value" );
                changeRadioIcon( $( event.currentTarget ));
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
