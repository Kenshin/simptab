
define([ "jquery", "date" ], function( $, date ) {

    initLR = function () {
        $( ".lineradio" ).each( function( index, item ) {
            if ( $( item ).hasClass("lrselected") ) {
                $( item ).prepend( '<span class="checked"></span>' );
                $( item ).find( "input" ).attr( "checked", true    );
            }
            else {
                $( item ).prepend( '<span class="unchecked"></span>' );
            }
        });
    }

    updateLR = function( $target ) {
        updateLrIcon( $target );
        updateLrState( $target );
    }

    updateLrIcon = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.find( "span" ).length > 0 ) {
            $prev.find( "span"  ).attr( "class", "unchecked" );
            $prev.find( "input" ).attr( "checked", false );
        }
        else {
            $next.find( "span"  ).attr( "class", "unchecked" );
            $next.find( "input" ).attr( "checked", false );
        }
        $current.find( "span"  ).attr( "class", "checked"    );
        $current.find( "input" ).attr( "checked", true    );
    }

    updateLrState = function( $target ) {
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

            // init line radio
            initLR();

            // update changestate lineradio
            var mode      = localStorage["simptab-background-mode"],
                checked   = $( ".changestate input[value=" +  mode + "]" );
            if ( mode != undefined ) {
                updateLR( checked  );
            }

            // update clockstate lineradio
            mode      = localStorage["simptab-background-clock"];
            checked   = $( ".clockstate input[value=" +  mode + "]" );
            if ( mode != undefined ) {
                updateLR( checked );
            }
        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
                updateLR( $( event.currentTarget ));
            });

            $( ".clockstate input" ).click( function( event ) {

                localStorage["simptab-background-clock"] = $(event.currentTarget).attr( "value" );
                updateLR( $( event.currentTarget ));

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
