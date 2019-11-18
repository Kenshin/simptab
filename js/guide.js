
define([ "jquery", "mousetrap", "lodash", "notify", "i18n" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    var intros,
        steps = [
            {
                intro: '首次安装（或升级） 简悦会 <b>自动弹出</b> 设置界面，本节只针对设置界面最基本的操作。'
            },
            {
                element: $( '.controlbar' )[0],
                intro: '控制栏'
            },
            {
                element: $( ".controlbar" ).find( "li" )[0],
                intro: '控制栏 系统信息'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=fullscreen]" ).parent()[0],
                intro: '控制栏 全屏'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=info]" ).parent()[0],
                intro: '控制栏 背景源信息'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=info]" ).parent()[0],
                intro: '控制栏 背景源信息'
            }
        ];

    function init( introJs ) {
        intros = introJs();
        $( ".controlbar" ).attr( "data-hits", "controlbar" );
        $( $( ".controlbar" ).find( "li" )[0] ).attr( "data-hits", "controlbar-system" );
        $( $( ".controlbar" ).find( "li" )[1] ).attr( "data-hits", "controlbar-info" );
    }

    function render() {
        intros.setOptions({
            hintButtonLabel: "确认",
            nextLabel: "下一条 →",
            prevLabel: "← 上一条",
            skipLabel: "",
            doneLabel: "完成",
            hidePrev: true,
            hideNext: true,
            tooltipPosition: "auto",
            steps: steps,
        });
        intros.onbeforechange( function( target ) {
            const id = $( target ).data().hits;
            if ( id == "controlbar" ) {
                $(target).css({ "opacity": 1, width: "initial" });
            } else if ( id == "controlbar-system" ) {
                $( $( ".controlbar" ).find( "a" )[3] ).trigger( "mouseenter" );
            } else if ( id == "controlbar-info" ) {
                //$( $( ".controlbar" ).find( "a" )[3] ).trigger( "mouseenter" );
            }
        });
        /*
        intros.onchange( function( target ) {
            const id = $( target ).data().hits;
            if ( id == "controlbar" ) {
                $(target).css( "opacity", 1 );
            } else {
                $( '.controlbar[data-hits="controlbar"]' ).removeAttr( "style" );
            }
        });
        */
        intros.start();
    }

    return {
        Init: init,
        Render: render,
    }

});