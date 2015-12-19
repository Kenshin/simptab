
define([ "jquery", "progressbar" ], function( $, ProgressBar ) {

    "use strict";
    var circle;

    function verify( perc ) {
      while ( perc <= 0.4 || perc >= 0.9 ) {
        perc = Math.random();
      }
      console.log( "exact perc is " + perc )
      return perc;
    }

    return {
        Init: function() {
            circle = new ProgressBar.Circle( ".progress", {
                color       : "#fff",
                strokeWidth : 50,
                duration    : 2500,
                easing      : "easeInOut"
            });
        },
        Set: function( state, perc ) {

            console.log( "localStorage[simptab-background-state] = ", state )

            // state includ: ready, remote(get remote url), loading(set remote url to image), writestart(write start), pending(writting), success(write complete, end), writefailed(write error, end), remotefailed(remote failed, end)
            localStorage["simptab-background-state"] = state;

            switch ( state ) {
                case "ready":
                    circle.animate( 0 );
                    break;
                case "remote":
                    circle.animate( 0.2 );
                    break;
                case "loading":
                    circle.animate( 0.3 );
                    break;
                case "writestart":
                    circle.animate( 0.4 );
                    break;
                case "pending":
                    circle.animate( verify( perc ) );
                    break;
                case "success":
                case "writefailed":
                    circle.animate( 1, function() {
                        circle.set( 0 );
                    });
                    break;
                default:
                    circle.set( 0 );
            }
        }
    };

});
