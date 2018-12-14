
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

    function play() {
        var cls = $( ".noise-mode .scene" ).find( ".active" ).attr( "class" ),
            key = cls.replace( "mode", "" ).replace( "active", "" ).trim(),
            url = noise[ key ];
        sounds[ key ]      = new Audio( url );
        sounds[ key ].loop = true;
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
                        <div class="volume"></div>\
                        <div class="scene">\
                            <span class="mode cafe001 active">安静的咖啡馆</span>\
                            <span class="mode">露天咖啡馆</span>\
                            <span class="mode">酒吧</span>\
                            <span class="mode">嘈杂的咖啡馆</span>\
                        </div>\
                    </div>';
        $( "body" ).append( tmpl );

        model();
    }

    function model() {
        $( ".noise-mode .action" ).on( "click", function( event ) {
            var $target = $( event.target );
            if ( $target.hasClass( "play" )) {
                $target.removeClass( "play" ).addClass( "pause" );
                play();
            } else {
                pause();
                $target.removeClass( "pause" ).addClass( "play" );
            }
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
            setTimeout( function(){
                $( ".noise-mode" ).remove();
            }, 500 );
        });
    }

    return {
        Init: function() {
            message.Subscribe( message.TYPE.OPEN_NOISE, function( event ) {
                if ( $( "body" ).find( ".noise-mode" ).length > 0 ) {
                    $( ".noise-mode .close" )[0].click();
                } else {
                    render();
                    open();
                    close();
                }
            });
        }
    }

});