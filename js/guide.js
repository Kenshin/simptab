
define([ "jquery", "mousetrap", "lodash", "notify", "i18n" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    var intros,
        steps = [
            {
                intro: '<a href="" target="_blank">简 Tab</a> 是一个纯粹、极简的 新标签页扩展。<br>它的设计哲学：<b>只呈现美图，无任何干扰</b>，但这并不意味它仅代表简单，它的功能包含：<br><br>- <a href="" target="_blank">多种背景源</a><br>- 丰富的定制化选项<br>- <a href="" target="_blank">常用网址</a><br>- <a href="" target="_blank">书签栏</a><br>- <a href="" target="_blank">快捷搜索栏</a><br>- <a href="" target="_blank">白噪音</a><br>- <a href="" target="_blank">禅模式</a>'
            },
            {
                intro: '同样主打极简体验，与其它同类产品不同，简 Tab 隐藏了绝大多数 <b>干扰元素</b>，但这些功能均可通过快捷键呼出。<br><br>请记住快捷键 <kbd>?</kbd>'
            },
            {
                intro: '接下来介绍几个经常需要使用的功能，包括：<br><br>- 控制栏<br>- 时钟<br>- 设置栏<br>- 常用网址<br>- 书签栏<br>- 快捷搜索栏<br>- 白噪音<br>- 选项页'
            },
            {
                element: $( '.controlbar' )[0],
                intro: '<a href="" target="_blank">控制栏</a> 默认只能通过鼠标右移显示，它集成了绝大多数与背景有关的操作，如：上传、下载、固定、不喜欢等。<br><br>这里的操作均支持 <a href="" target="_blank">快捷键</a>。'
            },
            {
                element: $( ".clock" )[0],
                intro: '界面上唯一可一直显示的元素，可选择隐藏且可修改 12/24 小时制。'
            },
            {
                intro: '<a href="" target="_blank">设置栏</a> 主要针对背景源的一些常规设置，包括：<br><br>- <a href="" target="_blank">地球每刻模式</a><br>- <a href="" target="_blank">随机更换背景源</a><br>- <a href="" target="_blank">相册模式</a><br>- <a href="" target="_blank">禅模式</a><br>- 开启/禁用 <a href="" target="_blank">多种背景源</a><br><br>请使用快捷键 <kbd>s</kbd> 开启/关闭'
            },
            {
                element: $( ".bottom" )[0],
                intro: '<a href="" target="_blank">常用网址</a> 与 Chrome 默认标签页一样。<br>但支持 简单模式 · 九宫格模式 · 隐藏 三种模式。<br>并拥有 <a href="" target="_blank">自定义</a> 功能。'
            },
            {
                intro: '<a href="" target="_blank">白噪音</a> 也是 简 Tab 独有的功能，辅以 <a href="" target="_blank">全屏化</a> + <a href="" target="_blank">自动更换背景</a>，可获得 <b>音乐相册级的</b> 视听享受。<br><br>快捷键 <kbd>w</kbd> 开启/关闭<br><br><b>注意：</b> 在任何界面中都没有白噪音的开启方式，只能选择通过快捷键操作。'
            },
            {
                intro: '<a href="" target="_blank">书签栏</a> 简洁直观的二级平铺目录，书签再多也不怕。<br><br>快捷键 <kbd>b</kbd> 开启/关闭<br><br><b>注意：</b> 因为要申请新的权限，所以书签栏 <b>默认关闭</b>，请 <b>手动</b> 在选项页中选择开启此功能。'
            },
            {
                intro: '<a href="" target="_blank">快捷搜索栏</a> 开启书签栏后，即可使用快捷搜索栏，支持关键字搜索书签，并默认接入多种 <a href="" target="_blank">搜索引擎</a>。<br><br>快捷键 <kbd>q</kbd> 开启/关闭'
            },
            {
                intro: '<a href="" target="_blank">选项页</a> 包含了大量的可定制选项，如：标题栏 · 全局自定义样式 · 全局性的自定义脚本 · 更灵活的 Unsplash 背景源选项 等。<br><br>快捷键 <kbd>o</kbd> 开启。'
            },
        ];

    function init( introJs ) {
        intros = introJs();
        $( ".controlbar" ).attr( "data-hits", "controlbar" );
        $( ".clock"      ).attr( "data-hits", "clock" );
        $( ".bottom"     ).attr( "data-hits", "bottom" );
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
            exitOnEsc: false,
            exitOnOverlayClick: false,
            steps: steps,
        });
        intros.onbeforechange( function( target ) {
            var id = $( target ).data().hits;
            if ( id == "controlbar" ) {
                $(target).css({ "opacity": 1, width: "initial" });
            } else if ( id == "clock" ) {
                $( ".controlbar" ).removeAttr( "style" );
            } else if ( id == "bottom" ) {
                $(target).css({ "opacity": 1 });
            }
        });
        intros.onexit( function() {
            $( ".controlbar" ).removeAttr( "data-hits" );
            $( ".clock"      ).removeAttr( "data-hits" );
            $( ".bottom"     ).removeAttr( "data-hits" ).removeAttr( "style" );
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