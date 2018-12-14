
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
                        <div class="action play waves-effect waves-circle"></div>\
                        <div class="volume"></div>\
                        <div class="scene">\
                            <span class="mode active">安静的咖啡馆</span>\
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
            } else {
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