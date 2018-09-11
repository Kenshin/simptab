
define([ "jquery", "waves" ], function( $, Waves ) {

    "use strict";

    var setting = (function () {

        // private
        // [ "0:false", "1:false", "2:false", "3:false", "4:false", "5:false", "6:false", "7:false", "8:false" ]
        var defaultOrigins = (function() {
            var origins = [];
            $( ".originstate" ).children().each( function( idx ) {
                origins.push( idx + ":false" );
            });
            return origins;
        })();

        var origins = ( function() {
            try {
                var origins = JSON.parse(localStorage["simptab-background-origin"] || "[]" );
            }
            catch ( error ) {
                origins = defaultOrigins;
            }
            return origins;
        })();

        function getOrigins() {
            var len = origins.length;
            if ( defaultOrigins.length > len ) {
                for( var i = 0; i < defaultOrigins.length - len; i++ ) {
                    origins.splice( origins.length, 0, defaultOrigins[origins.length] );
                }
            }
            else if ( defaultOrigins.length < len ) {
                origins = origins.slice( 0, defaultOrigins.length );
            }

            if ( localStorage["simptab-background-origin"] != JSON.stringify( origins )) localStorage["simptab-background-origin"] = JSON.stringify( origins );

            return origins;
        }

        function getLS( mode ) {
            if ( !localStorage[mode] ) localStorage[mode] = "";
            return localStorage[mode];
        }

        function getModes( modes ) {
            var mode;
            Object.keys( modes ).forEach( function( item ) {
                mode = modes[item];
                if ( !mode.value ||
                     mode.vals.filter( function(element) { return mode.value == element ? true : false; }).length == 0
                   ) {
                    mode.value = mode.vals[mode.default];
                    localStorage[mode.type] = mode.value;
                }
            });
            return modes;
        }

        function Setting() {

            this.origins = getOrigins();

            this.mode = getModes({
                "changestate" : {
                    value  : getLS( "simptab-background-mode" ),
                    type   : "simptab-background-mode",
                    vals   : [ "day", "time", "none" ],
                    default: 1
                },
                "positionstate" : {
                    value  : getLS( "simptab-background-position" ),
                    type   : "simptab-background-position",
                    vals   : [ "center", "corner", "mask" ],
                    default: 1
                },
                "clockstate" : {
                    value  : getLS( "simptab-background-clock" ),
                    type   : "simptab-background-clock",
                    vals   : [ "show", "hide" ],
                    default: 0
                },
                "tsstate"  : {
                    value  : getLS( "simptab-topsites" ),
                    type   : "simptab-topsites",
                    vals   : [ "normal", "simple", "senior" ],
                    default: 1
                },
                "pinstate"  : {
                    value  : getLS( "simptab-pin" ),
                    type   : "simptab-pin",
                    vals   : [ "30", "60", "120", "240", "480" ],
                    default: 0
                }
            });

        }

        Setting.prototype.UpdateMode = function( type, mode ) {
            this.mode[type].value = mode;
            localStorage[ this.mode[type].type ] = mode;
        }

        Setting.prototype.UpdateOriginsMode = function( idx, value ) {
            this.origins.splice( idx, 1, idx + ":" + value );
            localStorage["simptab-background-origin"] = JSON.stringify( this.origins );
        }

        return new Setting();
    })();

    function updateRdState( selector, mode ) {
        var $item, $parent, $span, cls;
        $( "." + selector ).find( "input" ).each( function( idx, item ) {
            $item   = $(item);
            $parent = $item.parent();
            $span   = $parent.find("span");
            cls     = selector != "pinstate" ? "lineradio" : "boxradio";

            if ( $item.val() == mode ) {
                $item.attr( "checked", true     );
                $item.prev().attr( "class", "checked" );
                $parent.attr( "class", cls + " lrselected" );
                $span.length ? $($span).attr( "class", "checked" ) : $parent.prepend( '<span class="checked"></span>' );
            }
            else {
                $item.attr( "checked", false             );
                $item.prev().attr( "class", "unchecked"  );
                $parent.attr( "class", cls );
                $span.length ? $($span).attr( "class", "unchecked" ) : $parent.prepend( '<span class="unchecked"></span>' );
            }
        });
    }

    function updateCkState( item ) {
        var idx     = item.split(":")[0],
            value   = item.split(":")[1],
            $target = $($(".originstate").children()[idx]),
            cls     = "lineradio",
            checked = "unchecked",
            span    = '<span class="unchecked"></span>';

        if ( value === "true" ) {
            cls     = "lineradio lrselected";
            checked = "checked";
            span    = '<span class="checked"></span>'
        }

        $target.attr("class", cls );
        $target.find("input").val( value );
        $target.find("span").remove();
        $target.prepend( span );
    }

    function updateOriginsVisible() {
        localStorage["simptab-background-mode"] == "day" ? $(".originstate").fadeOut() : $(".originstate").fadeIn();
    }

    return {
        Init: function() {

            // update [ changestate, clockstate, positionstate, topsites, pinstate ] radio button
            Object.keys( setting.mode ).forEach( function( item ) {
                updateRdState( item, setting.mode[item].value );
            });

            // update originstate lineradio
            setting.origins.forEach( function( item ) {
                updateCkState( item );
            });

            // update originsstate visible
            updateOriginsVisible();

        },

        Listen: function ( callback ) {

            // listen [ changestate, clockstate, topsites, pinstate ] radio button event
            var selectors = Object.keys( setting.mode ).map( function( item ) { return "." + item + " input"; } );
            $( selectors.join( "," ) ).click( function( event ) {
                var type = event.target.name,
                    mode = event.target.value;

                updateRdState(      type, mode );
                setting.UpdateMode( type, mode );
                updateOriginsVisible();

                // callback only include: tsstate, clockstate
                callback( type, mode );
            });

            // listen originstate checkbox button event
            $( ".originstate input" ).click( function( event ) {
                var idx     = event.target.name,
                    value   = event.target.value == "true" ? "false" : "true";
                updateCkState( idx + ":" + value );
                setting.UpdateOriginsMode( idx, value );
            });

            $( ".lineradio" ).on( "click", function( event ) { Waves.attach( '.lineradio', ['waves-block'] );; });
            // listen span click event
            $( ".lineradio" ).on( "click", "span", function( event ) { $(this).next().click(); });
            // hack code by label(maskralig)
            $( ".lineradio" ).find( "label[for=maskralig]" ) .on( "click", function( event ) { $(this).prev().click(); });
        },

        Mode: function( type ) {
            return setting.mode[type].value;
        },

        IsRandom: function() {
            return setting.mode["changestate"].value === "time" ? true : false;
        },

        Verify: function( idx ) {
            var value = setting.origins[idx],
                value = value || idx + ":" + "true";

            return value.split(":")[1];
        },

        Only: function() {
            console.log( setting.origins )
            var idx = 0, code = -1;
            setting.origins.forEach( function( origin ) {
                if ( origin.endsWith( "true" )) {
                    idx++;
                    code = origin.split(":")[0];
                }
            })
            return { result: idx == 1 ? true : false, code: code };
       },

        TogglePinState: function( state ) {
            state ? $( ".pinstate" ).fadeIn() : $( ".pinstate" ).fadeOut();
        }

    };
});
