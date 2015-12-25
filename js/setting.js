
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

        function getCurrentOrigin() {
            try {
                var origins = JSON.parse(localStorage["simptab-background-origin"] || "[]" );
            }
            catch ( error ) {
                origins = [];
            }
            return origins;
        }

        function getMode( mode, value ) {
            if ( !localStorage[mode] ) localStorage[mode] = value;
            return localStorage[mode];
        }

        function Setting() {

            this.origins = getCurrentOrigin();

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
                    value : getMode( "simptab-topsites",          $( ".tsstate"    ).find( ".lrselected input" ).val() ),
                    type  : "simptab-topsites"
                }
            };

        }

        Setting.prototype.Correction = function() {
            var len     = this.origins.length;
            if ( defaultOrigins.length > len ) {
                for( var i = 0; i < defaultOrigins.length - len; i++ ) {
                    this.origins.splice( this.origins.length, 0, defaultOrigins[this.origins.length] );
                }
                this.Save();
            }
            else if ( defaultOrigins.length < len ) {
                this.origins = this.origins.slice( 0, defaultOrigins.length );
                this.Save();
            }
        }

        Setting.prototype.Save = function() {
            localStorage["simptab-background-origin"] = JSON.stringify( this.origins );
        }

        Setting.prototype.InitRdState = function() {
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

        Setting.prototype.UpdateRdState = function( selector, mode ) {
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

        Setting.prototype.UpdateMode = function( type, mode ) {
            this.mode[type].value = mode;
            localStorage[ this.mode[type].type ] = mode;
        }

        Setting.prototype.AddClickEvent = function( selctor, callback ) {
            $( "." + selctor +  " input" ).click( function( event ) {
                var mode = $(event.currentTarget).attr( "value" );
                callback( selctor, mode );
            });
        }

        Setting.prototype.UpdateCkState = function( item ) {
            var idx     = item.split(":")[0],
                value   = item.split(":")[1],
                $target = $($(".originstate").children()[idx]),
                cls     = "lineradio",
                checked = "unchecked";

            if ( value === "true" ) {
                cls = "lineradio lrselected";
                checked = "checked";
            }

            $target.attr("class", cls );
            $target.find("span").attr( "class", checked );
            $target.find("input").val( value );
        }

        return new Setting();
    })();

    /*
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
    */

    function updateLocalStorge( $target ) {
        var index = $target.attr("name"),
            value = $target.attr("value"),
            item  = setting.origins[index];

        // update arr[index] to new value
        setting.origins.splice( index, 1, index + ":" + value );

        // update local storge
        setting.Save();
    }

    return {
        Init: function() {

            // init line radio
            setting.InitRdState();

            // update [ changestate, clockstate, topsites ] radio button
            Object.keys( setting.mode ).forEach( function( item ) {
                setting.UpdateRdState( item, setting.mode[item].value );
            });

            // update originstate lineradio
            setting.Correction();
            setting.origins.forEach( function( item ) {
                setting.UpdateCkState( item );
            });
            /*
            var mode = setting.origins;
            $(".originstate").find("input").each( function( idx, item ) {
                $(item).attr( "value", mode.length == 0 ? false : mode[idx] && mode[idx].split(":")[1] );
                updateOriginState( $(item), "init" );
            });
            */

        },

        Listen: function ( callback ) {

            // listen [ changestate, clockstate, topsites ] radio button
            Object.keys( setting.mode ).forEach( function( item ) {
                setting.AddClickEvent( item, function( type, mode ) {

                    setting.UpdateRdState( type, mode );
                    setting.UpdateMode(    type, mode );

                    // callback only include: tsstate, clockstate
                    callback( type, mode );

                });
            });

            // background origin state
            $( ".originstate input" ).click( function( event ) {
                updateOriginState( $( event.currentTarget ), "update" );
                updateLocalStorge( $( event.currentTarget ));
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
