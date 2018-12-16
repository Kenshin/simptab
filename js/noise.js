
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps", "message" ], function( $, Mousetrap, _, Notify, i18n, comps, message ) {

    "use strict";

    var noise = {
        "cafe001": "http://st.ksria.cn/noise/cafe001.mp3",
        "jazz001": "http://st.ksria.cn/noise/jazz001.mp3",
        "rain001": "http://st.ksria.cn/noise/rain001.mp3",
    }, sounds = {};

    /*
    function sound() {
        var cafe = new Audio( "http://st.ksria.cn/noise/cafe001.mp3" );
        var jazz = new Audio( "http://st.ksria.cn/noise/jazz001.mp3" );
        var rain = new Audio( "http://st.ksria.cn/noise/rain001.mp3" );
        cafe.play();
        cafe.loop = true;
        jazz.play();
        jazz.loop = true;
        jazz.volume = 0.5;
        rain.play();
        rain.volume = 0.5;
        rain.loop = true;
    }
    */

    function play( volume ) {
        var cls = $( ".noise-mode .scene" ).find( ".active" ).attr( "class" ),
            key = cls.replace( "mode", "" ).replace( "active", "" ).trim(),
            url = noise[ key ];
        sounds[ key ]        = new Audio( url );
        sounds[ key ].loop   = true;
        sounds[ key ].volume = volume / 100;
        sounds[ key ].play();
    }

    function pause() {
        Object.keys( sounds ).forEach( function( key ) {
            sounds[key].pause();
            delete sounds[key];
        });
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
                            <div class="waves-effect waves-block effect jazz">\
                                <div class="avatar"></div>\
                                <div class="label">JAZZ</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "jazz" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect rain">\
                                <div class="avatar"></div>\
                                <div class="label">RAIN</div>\
                                <div class="volum">\
                                    ' + comps.Slider( 0, 100, 50, "rain" ) + '\
                                </div>\
                            </div>\
                            <div class="waves-effect waves-block effect wind">\
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
            var $target = $( event.target );
            if ( $target.hasClass( "play" )) {
                $target.removeClass( "play" ).addClass( "pause" ).next().css( "opacity", 1 );
                play( $target.next().find( "input" ).val() );
            } else {
                pause();
                $target.removeClass( "pause" ).addClass( "play" ).next().css( "opacity", 0 );
            }
        });
        $( ".noise-mode .md-slider-root .volume" )[0].addEventListener( "slider", function( event ) {
            sounds[ "cafe001" ] && ( sounds[ "cafe001" ].volume = event.data / 100 );
        });
        $( ".noise-mode .scene" ).find( ".mode:last" ).on( "click", function( event ) {
            $( ".noise-mode .sfx" ).css({ "opacity": "1", "height": "100%", "pointer-events": "initial" });
        });
        $( ".noise-mode .sfx .exit" ).on( "click", function( event ) {
            $( ".noise-mode .sfx" ).css({ "opacity": "0", "height": "0", "pointer-events": "none" });
        });
        $( ".md-slider-root .jazz" )[0].addEventListener( "slider", function( event ) {
            // TO-DO
        });
        $( ".md-slider-root .rain" )[0].addEventListener( "slider", function( event ) {
            // TO-DO
        });
        $( ".md-slider-root .wind" )[0].addEventListener( "slider", function( event ) {
            // TO-DO
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