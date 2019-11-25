
define([ "jquery", "progressbar", "i18n" ], function( $, ProgressBar, i18n ) {

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

            // state includ: ready, remote(get remote url), loading(set remote url to image), writestart(write start), pending(writting), success(write complete, end), writefailed(write error, end), remotefailed(remote failed, end), pinsuccess( pinned )
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
                    circle.animate( 1, function() {
                        circle.set( 0 );
                    });
                    break;
                case "writefailed":
                case "remotefailed":
                    circle.animate( 1, function() {
                        circle.set( 1 );
                        $( ".progress" )
                            .attr( "data-balloon", i18n.GetLang( "notify_refresh_failed" ) )
                            .attr( "data-balloon-pos", "right" )
                            .html( '<div class="warning"><i class="fas fa-exclamation-circle"></i><span></span></div>' )
                            .find( "i" ).css({ "color": state == "remotefailed" ? "#F39C12" : "#F44336" });
                            //.find( "svg path" ).css({ "stroke": state == "remotefailed" ? "#F39C12" : "#F44336" });
                    });
                    break;
                default:
                    circle.set( 0 );
            }
        }
    };

});
