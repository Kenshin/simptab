
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps", "message" ], function( $, Mousetrap, _, Notify, i18n, comps, message ) {

    "use strict";

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

    function render() {
        var tmpl = '\
                    <div class="noise-mode">\
                        White Noise\
                    </div>';
        $( "body" ).append( tmpl );
    }

    function open() {
        setTimeout( function(){
            $( ".noise-mode" ).css({ "transform": "translateY(0px)", "opacity": 1 });
            sound();
        }, 10 );
    }

    function close() {
        // TO-DO
    }

    return {
        Init: function() {
            message.Subscribe( message.TYPE.OPEN_NOISE, function( event ) {
                render();
                open();
            });
        }
    }

});