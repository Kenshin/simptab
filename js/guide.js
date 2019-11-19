
define([ "jquery", "mousetrap", "lodash", "notify", "i18n" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    var intros,
        steps = [
            {
                intro: '简 Tab 是一个纯粹、极简的新标签页扩展。<br>它的设计哲学: <b>只呈现美图，无任何干扰</b>，但这并以意味它仅代表简单，它的功能包含：<br><br>- <a href="" target="_blank">多种背景源</a>；<br>- <a href="" target="_blank">常用网址</a>；<br>- <a href="" target="_blank">书签栏</a>；<br>- <a href="" target="_blank">快捷搜索栏</a>；<br>- <a href="" target="_blank">白噪音</a>；<br>- <a href="" target="_blank">禅模式</a>；'
            },
            {
                element: $( '.controlbar' )[0],
                intro: '控制栏：包含了对背景图的大部分操作，如：上传、下载、更换背景源、更改背景模式等等；'
            },
            {
                element: $( ".controlbar" ).find( "li" )[0],
                intro: '控制栏 - 系统信息，包含了：打开默认便签页、历史记录、下载地址、应用三个子项；'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=fullscreen]" ).parent()[0],
                intro: '控制栏 - 全屏：可将新标签页全屏、配合 <a href="" target="_blank">自动更换背景</a> 与 <a href="" target="_blank">白噪音</a>，可获得如同音乐相册的体验；'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=info]" ).parent()[0],
                intro: '控制栏 - 背景源信息：某些背景源具有源地址，如： Google Art / SimpTab 订阅源等，可查看这个美图背后的故事。'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=download]" ).parent()[0],
                intro: '控制栏 - 下载：可将背景下载，并可 <a href="" target="_blank">指定位置</a>。'
            },
            {
                element: $( ".controlbar" ).find( "li > a[url=download]" ).parent()[0],
                intro: '控制栏 - 下载：可将背景下载，并可 <a href="" target="_blank">指定位置</a>。'
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
        intros.onexit( function() {
            $( ".controlbar" ).removeAttr( "style" );
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