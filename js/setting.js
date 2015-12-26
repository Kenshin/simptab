
define([ "jquery" ], function( $ ) {

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

        function getMode( mode, value ) {
            if ( !localStorage[mode] ) localStorage[mode] = value;
            return localStorage[mode];
        }

        function Setting() {

            this.origins = getOrigins();

            this.mode = {
                "changestate" : {
                    value : getMode( "simptab-background-mode",  $( ".changestate" ).find( ".lrselected input" ).val() ),
                    type  : "simptab-background-mode"
                },
                "clockstate" : {
                    value : getMode( "simptab-background-clock", $( ".clockstate"  ).find( ".lrselected input" ).val() ),
                    type  : "simptab-background-clock"
                },
                "tsstate" : {
                    value : getMode( "simptab-topsites",         $( ".tsstate"     ).find( ".lrselected input" ).val() ),
                    type  : "simptab-topsites"
                }
            };

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
        $( "." + selector ).find( "input" ).each( function( idx, item ) {
            if ( $(item).val() == mode ) {
                $(item).attr( "checked", "checked"      );
                $(item).prev().attr( "class", "checked" );
                $(item).parent().addClass( "lrselected" );
            }
            else {
                $(item).attr( "checked", false             );
                $(item).prev().attr( "class", "unchecked"  );
                $(item).parent().removeClass( "lrselected" );
            }
        });
    }

    function addClickEvent( selctor, callback ) {
        $( "." + selctor +  " input" ).click( function( event ) {
            var mode = $(event.currentTarget).attr( "value" );
            callback( selctor, mode );
        });
    }

    function updateCkState( item ) {
        var idx     = item.split(":")[0],
            value   = item.split(":")[1],
            $target = $($(".originstate").children()[idx]),
            cls     = "lineradio",
            checked = "unchecked";

        if ( value === "true" ) {
            cls     = "lineradio lrselected";
            checked = "checked";
        }

        $target.attr("class", cls );
        $target.find("span").attr( "class", checked );
        $target.find("input").val( value );
    }

    return {
        Init: function() {

            // update [ changestate, clockstate, topsites ] radio button
            Object.keys( setting.mode ).forEach( function( item ) {
                updateRdState( item, setting.mode[item].value );
            });

            // update originstate lineradio
            setting.origins.forEach( function( item ) {
                updateCkState( item );
            });

        },

        Listen: function ( callback ) {

            // listen [ changestate, clockstate, topsites ] radio button event
            Object.keys( setting.mode ).forEach( function( item ) {
                addClickEvent( item, function( type, mode ) {

                    updateRdState(      type, mode );
                    setting.UpdateMode( type, mode );

                    // callback only include: tsstate, clockstate
                    callback( type, mode );

                });
            });

            // listen originstate checkbox button event
            $( ".originstate input" ).click( function( event ) {
                var idx     = event.target.name,
                    value   = event.target.value == "true" ? "false" : "true";
                updateCkState( idx + ":" + value );
                setting.UpdateOriginsMode( idx, value );
            });

        },

        Mode: function( type ) {
            return setting.mode[type].value;
        },

        IsRandom: function() {
          return setting.mode["changestate"].value  === "time" ? true : false;
        },

        Verify: function( idx ) {
            var value = setting.origins[idx],
                value = value || idx + ":" + "true";

            return value.split(":")[1];
        }

    };
});
