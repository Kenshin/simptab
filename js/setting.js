
define([ "jquery", "date" ], function( $, date ) {

    "use strict";

    var setting = (function () {

            // [ "0:false", "1:false", "2:false", "3:false", "4:false", "5:false", "6:false", "7:false", "8:false" ]
            var origins   = [],
                lsorigins = JSON.parse(localStorage["simptab-background-origin"] || "[]" );

            function Setting() {
                $( ".originstate" ).children().each( function( idx ) {
                    origins.push( idx + ":false" );
                });
            }

            Setting.prototype.Origins    = origins;
            Setting.prototype.LsOrigins  = lsorigins;

            Setting.prototype.Correction = function() {
                var len = lsorigins.length;
                if ( origins.length != len ) {
                    for( var i = 0; i < origins.length - len; i++ ) {
                        lsorigins.splice( lsorigins.length, 0, origins[lsorigins.length] );
                    }
                    this.Save();
                }
            }

            Setting.prototype.Save = function() {
                localStorage["simptab-background-origin"] = JSON.stringify( lsorigins );
            }

            return new Setting();
    })();

    function initLR() {
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

    function updateLR( $target ) {
        updateLrIcon( $target );
        updateLrState( $target );
    }

    function updateLrIcon( $target ) {
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

    function updateLrState( $target ) {
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

    function updateOriginState( $target, type ) {
        var $prev   = $($target.prev()),
            $parent = $($target.parent()),
            value   = $target.attr("value"),
            checked = "checked",
            inputel = "true",
            divel   = "lineradio lrselected";

        if ( type == "init" ) {
            value = value == "true" ? "false" : "true";
        }

        if ( value == "true" ) {
            checked = "unchecked";
            inputel = "false";
            divel   = "lineradio";
        }

        $target.attr( "value", inputel  );
        $prev.attr(   "class", checked  );
        $parent.attr( "class", divel    );
    }

    function updateTsState( mode, $target ) {
        if ( $target.val() == mode ) {
            $target.attr( "checked", "checked"      );
            $target.prev().attr( "class", "checked" );
            $target.parent().addClass( "lrselected" );
        }
        else {
            $target.attr( "checked", false             );
            $target.prev().attr( "class", "unchecked"  );
            $target.parent().removeClass( "lrselected" );
        }
    }

    function updateLocalStorge( $target ) {
        var index = $target.attr("name"),
            value = $target.attr("value"),
            item  = setting.LsOrigins[index];
            //arr   = localStorage["simptab-background-origin"] && JSON.parse( localStorage["simptab-background-origin"] ),

        // update arr[index] to new value
        setting.LsOrigins.splice( index, 1, index + ":" + value );

        // update local storge
        //localStorage["simptab-background-origin"] = JSON.stringify( arr );
        setting.Save();

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

            // update originstate lineradio
            //mode      = JSON.parse( localStorage["simptab-background-origin"] || "[]" );
            setting.Correction();
            mode        = setting.LsOrigins;
            $(".originstate").find("input").each( function( idx, item ) {
                $(item).attr( "value", mode.length == 0 ? false : mode[idx] && mode[idx].split(":")[1] );
                updateOriginState( $(item), "init" );
            });

            // set simptab-background-origin defalut value
            //if ( mode.length == 0 ) {
            //   localStorage["simptab-background-origin"] = JSON.stringify([ "0:false", "1:false", "2:false", "3:false", "4:false", "5:false", "6:false", "7:false", "8:false" ]);
            //}

            // update topsites lineradio
            mode      = !localStorage["simptab-topsites"] ? "simple" : localStorage["simptab-topsites"];
            $(".tsstate").find("input").each( function( idx, item ) {
                updateTsState( mode, $(item) );
            });

        },

        Listen: function ( callback ) {

            // background state
            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
                updateLR( $( event.currentTarget ));
            });

            // clock state
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

            // background origin state
            $( ".originstate input" ).click( function( event ) {
                updateOriginState( $( event.currentTarget ), "update" );
                updateLocalStorge( $( event.currentTarget ));
            });

            // topsites state
            $( ".tsstate input" ).click( function( event ) {
                var mode    = $(event.currentTarget).attr( "value" );
                callback( "topsites", mode );
                $(".tsstate").find("input").each( function( idx, item ) {
                    updateTsState( mode, $(item) );
                });
            });

        },

        Get: function ( state ) {

            if ( state == "changestate" ) {
                return $( ".changestate input[value=day]" ).attr( "checked" );
            }
            else if ( state == "clockstate" ) {
                return $( ".clockstate input[value=show]" ).attr( "checked" );
            }

        },

        IsRandom: function() {
          var mode = localStorage["simptab-background-mode"];
          // when undefined same as time
          if ( mode == undefined || mode == "time" ) {
            return true;
          }
          else {
            return false;
          }
        },

        Verify: function( idx ) {
            //var arr   = JSON.parse( localStorage["simptab-background-origin"] || "[]" ),
            //    value = arr && arr.length && arr[idx],
            //    value = value || idx + ":" + "true";
            var value = setting.LsOrigins[idx],
                value = value || idx + ":" + "true";

            return value.split(":")[1];
        }

    };
});
