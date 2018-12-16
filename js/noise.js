
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps", "message" ], function( $, Mousetrap, _, Notify, i18n, comps, message ) {

    "use strict";

    var noise = {
            "cafe001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/cafe001.mp3",
            "jazz001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/jazz001.mp3",
            "rain001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/rain001.mp3",
            "wind001": "https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/noise/wind001.mp3",
        },  colors = {
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
                        <span class="close"></span>\
                        <div class="action play waves-effect waves-circle"></div>\
                        <div class="volumes">\
                        ' + comps.Slider( 0, 100, 50, "volume" ) + '\
                        </div>\
                        <div class="scene">\
                            <span class="mode cafe001 active">安静的咖啡馆</span>\
                            <span class="mode">露天咖啡馆</span>\
                            <span class="mode">酒吧</span>\
                            <span class="mode">更多场景</span>\
                        </div>\
                        <div class="sfx">\
                            <div class="waves-effect waves-block effect" type="jazz">\
                                <div class="avatar"></div>\
                                <div class="label">JAZZ</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "jazz" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect" type="rain">\
                                <div class="avatar"></div>\
                                <div class="label">RAIN</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "rain" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect" type="wind">\
                                <div class="avatar"></div>\
                                <div class="label">WIND</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "wind" ) + '\
                                </div>\
                            </div>\
                            <span class="exit"></span>\
                        </div>\
                    </div>';
        $( "body" ).append( tmpl );

        model();
    }

    function model() {
        $( ".noise-mode .action" ).on( "click", function( event ) {
            var $target = $( event.target ),
                cls     = $( ".noise-mode .scene" ).find( ".active" ).attr( "class" ),
                key     = cls.replace( "mode", "" ).replace( "active", "" ).trim();
            if ( $target.hasClass( "play" )) {
                $target.removeClass( "play" ).addClass( "pause" ).next().css( "opacity", 1 );
                play( key, $target.next().find( "input" ).val() );
            } else {
                pause( key );
                $target.removeClass( "pause" ).addClass( "play" ).next().css( "opacity", 0 );
            }
        });
        $( ".noise-mode .scene" ).find( ".mode:last" ).on( "click", function( event ) {
            $( ".noise-mode .sfx" ).css({ "opacity": "1", "height": "100%", "pointer-events": "initial" });
        });
        $( ".noise-mode .sfx .exit" ).on( "click", function( event ) {
            $( ".noise-mode .sfx" ).css({ "opacity": "0", "height": "0", "pointer-events": "none" });
        });
        $( ".noise-mode .sfx .effect .avatar" ).on( "click", function( event ) {
            var $parent = $( event.target ).parent(),
                key     = $parent.attr( "type" ) + "001",
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
        $( ".noise-mode .md-slider-root .volume" )[0].addEventListener( "slider", function( event ) {
            sounds[ "cafe001" ] && ( sounds[ "cafe001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .jazz" )[0].addEventListener( "slider", function( event ) {
            sounds[ "jazz001" ] && ( sounds[ "jazz001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .rain" )[0].addEventListener( "slider", function( event ) {
            sounds[ "rain001" ] && ( sounds[ "rain001" ].volume = event.data / 100 );
        });
        $( ".md-slider-root .wind" )[0].addEventListener( "slider", function( event ) {
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