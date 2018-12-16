
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps", "message" ], function( $, Mousetrap, _, Notify, i18n, comps, message ) {

    "use strict";

    var noise = {
            "cafe001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/cafe001.mp3",
            "jazz001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/jazz001.mp3",
            "rain001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/rain001.mp3",
            "wind001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/wind001.mp3",
        },  colors = {
            "cafe001": "#753F40",
            "jazz001": "#3D5AFE",
            "rain001": "#ff932b",
            "wind001": "#f3294d",
        },
        sounds = {};

    function play( key, volume ) {
        var url = noise[ key ];
        sounds[ key ]        = new Audio( url );
        sounds[ key ].loop   = true;
        sounds[ key ].volume = volume / 100;
        sounds[ key ].play();
    }

    function pause( key ) {
       sounds[ key ] && sounds[key].pause();
       delete sounds[key];
    }

    function render() {
        var tmpl = '\
                    <div class="noise-mode">\
                        <div class="sfx">\
                            <div class="waves-effect waves-block effect" type="cafe001">\
                                <div class="avatar"></div>\
                                <div class="label">CAFE</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "cafe001" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect" type="jazz001">\
                                <div class="avatar"></div>\
                                <div class="label">JAZZ</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "jazz001" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect" type="rain001">\
                                <div class="avatar"></div>\
                                <div class="label">RAIN</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "rain001" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect" type="wind001">\
                                <div class="avatar"></div>\
                                <div class="label">WIND</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "wind001" ) + '\
                                </div>\
                            </div>\
                        </div>\
                        <span class="close"></span>\
                    </div>';
        $( "body" ).append( tmpl );

        model();
    }

    function model() {
       $( ".noise-mode .sfx .effect .avatar" ).on( "click", function( event ) {
            var $parent = $( event.target ).parent(),
                key     = $parent.attr( "type" ),
                $volume = $parent.find( ".volum" ),
                volume  = $parent.find( ".md-slider-root input" ).val();
            if ( sounds[key] ) {
                pause( key );
                $volume.css( "opacity", 0 );
                $parent.css({ "background-color": "initial", "opacity": 0.5 });
            } else {
                play( key, volume );
                $volume.css( "opacity", 1 );
                $parent.css({ "background-color": colors[key], "opacity": 1 });
            }
        });
        $( ".md-slider-root .cafe001" )[0].addEventListener( "slider", function( event ) {
            sounds[ "cafe001" ] && ( sounds[ "cafe001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .jazz001" )[0].addEventListener( "slider", function( event ) {
            sounds[ "jazz001" ] && ( sounds[ "jazz001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .rain001" )[0].addEventListener( "slider", function( event ) {
            sounds[ "rain001" ] && ( sounds[ "rain001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .wind001" )[0].addEventListener( "slider", function( event ) {
            sounds[ "wind001" ] && ( sounds[ "wind001" ].volume = event.data / 100 );
        });
    }

    function open() {
        setTimeout( function(){
            $( ".noise-mode" ).css({ "transform": "translateY(0px)", "opacity": 1 });
        }, 10 );
    }

    function close() {
        $( ".noise-mode .close" ).click( function( event ) {
            $( ".noise-mode" ).css({ "transform": "translateY(100px)", "opacity": 0 });
        });
    }

    return {
        Init: function() {
            message.Subscribe( message.TYPE.OPEN_NOISE, function( event ) {
                if ( $( "body" ).find( ".noise-mode" ).length > 0 ) {
                    open();
                } else {
                    render();
                    open();
                    close();
                }
            });
        }
    }

});