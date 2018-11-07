
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "vo", "date" ], function( $, Mousetrap, _, Notify, i18n, vo, date ) {

    "use strict";

    function settingTmpl() {
        var tmpl = '\
                    <div class="setting-zen-mode">\
                    </div>';
        $( "body" ).append( tmpl );
    }

    function open() {
        setTimeout( function(){
            $( ".setting-zen-mode" ).css({ "transform": "translateY(0px)", "opacity": 1 });
        }, 10 );
    }

    function close() {
        $( ".setting-zen-mode" ).css({ "transform": "translateY(100px)", "opacity": 0 });
        setTimeout( function(){
            $( ".setting-zen-mode" ).remove();
        }, 500 );
    }

    function shortcuts() {
        var styles = "";
        [ "5", "6", "7", "f", "m", "s", "a", "n", "u" ].forEach( function( value ) {
            styles += ".keycode-" + value + "{text-decoration: line-through!important;}";
            Mousetrap.unbind( value );
        });
        $( "head" ).append( '<style type="text/css">' + styles + '</style>' );
    }

    function timeMode() {
        $( ".clock" ).addClass( "clock-bg-zen-mode" ).addClass( "zen-mode-bg" ).css( "z-index", "initial" );
        $( "#time" ).addClass( "time-zen-mode" );
    }

    function dayMode() {
        var date = new Date(),
            day  = date.toLocaleDateString( navigator.language, { weekday: 'long', month: 'long', day: 'numeric' });
        $( "#time" ).after( '<div class="day-zen-mode">' + day + '</div>' );
    }

    function devicesMode() {
        navigator.getBattery().then( function( battery ) {
            var network = navigator.onLine ? '≈ ' + navigator.connection.downlink + ' Mbps' : 'Offline',
                charge  = ( battery.level * 100 ).toFixed() + '% ' + ( battery.charging ? 'Charging' : 'Battery' );
            $( ".day-zen-mode" ).after( '<div class="devices-zen-mode">' + network + ' · ' + charge + '</div>' );
        });
    }

    function topSitesMode() {
        $( ".bottom" ).addClass( "bottom-zen-mode" );
        $( ".topsites" ).addClass( "topsites-zen-mode" );
        $( ".topsites a" ).addClass( "topsites-a-zen-mode" );
    }

    function settingMode() {
        $( ".controlbar" ).addClass( "controlbar-zen-mode" );
        $( ".progress"   ).addClass( "progress-zen-mode" );
        $( ".clock"      ).append( '<div class="setting-trigger-zen-mode"></div>' )
        $( ".setting-trigger-zen-mode" ).on( "click", function( event ) {
            settingTmpl();
            open();
        });
    }

    return {
        Render: function() {
            timeMode();
            dayMode();
            devicesMode();
            settingMode();

            setTimeout( function() {
                topSitesMode();
                shortcuts();
            }, 500 );
        },

        Init: function() {
            localStorage["simptab-topsites-backup"] = localStorage["simptab-topsites"];
            localStorage["simptab-topsites"] = "simple";

            localStorage["simptab-background-clock-backup"] = localStorage["simptab-background-clock"];
            localStorage["simptab-background-clock"] = "show";
        },

        Exit: function() {
            localStorage["simptab-topsites"] = localStorage["simptab-topsites-backup"];
            localStorage.removeItem( "simptab-topsites-backup" );

            localStorage["simptab-background-clock"] = localStorage["simptab-background-clock-backup"];
            localStorage.removeItem( "simptab-background-clock-backup" );
        }
    }

});