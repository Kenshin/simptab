"use strict";
var i18nn, lang;
$( document ).ready( function() {
    lang = navigator.language;

    // set 'en-XX' to 'en'
    if ( lang.split("-")[0] == "en" ) {
        lang = "en";
    }

    // set cookie
    var newLang = $.cookie( "lang" );
    if ( newLang !== undefined ) {
        lang = newLang;
    }

    // get http://xxxx.index.html?lang=xxx
    newLang = getQueryString( "lang" );
    if ( newLang !== null ) {
        lang = newLang;
    }

    // set lower case
    lang = lang.toLowerCase();

    // set default language
    if ( lang != "en" && lang !== "zh-cn" && lang !== "zh-tw" ) {
        lang = "en";
    }

    /*
    // set body font-family
    $( "body" ).css({ "font-family": lang.toLowerCase() });
    if ( lang !== "en" ) {
        $( "body" ).css({ "font-weight": "normal" });
    }
    */

    // set options
    var options = {
        load         : "current",
        lng          : lang,
        lowerCaseLng : true,
        fallbackLng  : false,
        cookieName   : "lang",
        useCookie    : true,
        detectLngQS  : "lang"
    };

    // i18n init
    i18n.init( options, function( t ) {

        i18nn = t;

        $($(".title div")[0]).html( t( "title" ));
        $($(".title div")[1]).html( t( "desc" ));
        $(".download .btn-download h3").html( t( "download" ));
        $(".download .smaller").html( t( "or" ));
        $(".download .btn-offline-download").html( t( "offline" ));

        $($(".top ul li a")[0]).text( t( "nav3" ) );
        $($(".top ul li a")[1]).text( t( "nav2" ) );
        $($(".top ul li a")[2]).text( t( "nav4" ) );
        $($(".top ul li a")[6]).text( t( "nav5" ) );
        $($(".top ul li a")[7]).text( t( "nav6" ) );

        if ( lang == "zh-tw" ) $($(".top ul li a")[1]).attr( "href", "http://ksria.com/simptab/docs/#/CHANGELOG.tw" );
        if ( lang == "en"    ) $($(".top ul li a")[1]).attr( "href", "http://ksria.com/simptab/docs/#/CHANGELOG.en" );

        $.each( $(".feature"), function( idx, item ) {
            $( item ).find( ".desc" ).text( t( $(item).attr( "data-type" ) ));
        });

        $( ".feature .learnmore").html( t( "learn" ));

        $( ".middle a:nth-child(1)").html( t( "middle1" ));

        $(".footer li:nth-child(1) h2").html( t( "support" ));
        $(".footer li:nth-child(1) div p:nth-of-type(1)").html( t( "feedback" ));
        $(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(1)").html( t( "contact" ));
        $(".footer li:nth-child(1) div p:nth-of-type(2) a:nth-of-type(2)").html( t( "author" ).toLowerCase() );
        $(".footer li:nth-child(1) div p:nth-of-type(2) span:nth-of-type(2)").html( t( "end" ).toLowerCase() );

        $(".footer li:nth-child(2) h2").html( t( "author" ));
        $(".footer li:nth-child(2) p:nth-child(2)").html( t( "job" ));

        $(".footer .copyright span:nth-child(1)").html( t( "footer" ));
    });

    $( ".btn-download" ).click( function() {
        window.location.href = "https://chrome.google.com/webstore/detail/kbgmbmkhepchmmcnbdbclpkpegbgikjc" + "?hl=" + i18n.lng();
    });

    $( ".middle a:nth-child(1)" ).click( function() {
        var lng = i18n.lng();
        lng     = lng === "en" ? lng : lng.split("-")[1];
        lng     = lng === "cn" ? ""  : "." + lng;
        window.location.href = lng == ".en" ? "http://github.com/kenshin/simptab/blob/master/README" + lng + ".md" : "http://ksria.com/simptab/docs/#/";
    });

    $( ".feature .learnmore" ).on( "click", function( event ) {
        var $target = $( event.currentTarget ).parent().parent(),
            id      = $target.attr( "data-type" );
        $target.addClass( "active" );
        tooltips( id );
    });

    Waves.init();
    Waves.attach( '.feature', [ "waves-block" ]);
    Waves.attach( '.btn-download', [ "waves-button", "waves-float" ]);
    Waves.attach( '.feature .learnmore', [ "waves-button", "waves-float" ]);
});

function getQueryString( name ) {
    var reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)", "i" );
    var r = window.location.search.substr(1).match( reg );
    if (r !== null) return unescape(r[2]); return null;
}

/*
function tooltips( id ) {
    var steps  = {
            origins: [{
                element: $( ".feature[data-type=origins]" )[0],
                position: 'right',
                intro: '简 Tab 支持从多个壁纸源获取数据，包括：<ul><li>必应每日图片</li><li>必应随机图片</li><li>wallhaven.cc</li><li>unsplash.com</li><li>googleartproject.com</li><li>desktoppr.co</li><li>visualhunt.com</li></ul>详细请看开发文档 <a href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%a4%9a%e7%a7%8d%e8%83%8c%e6%99%af%e6%ba%90" target="_blank">多种背景源</a>'
            }],
            positionmode: [{
                element: $( ".feature[data-type=positionmode]" )[0],
                position: 'right',
                intro: '简 Tab 具有多种方式的壁纸更换模式，包括：<ul><li>每天更换背景<br><abbr>每天更换一次，背景源只来源于 必应每日图片</abbr></li><li>随机更换<br><abbr>每次新打开标签页，即可看到一副新的背景图</abbr></li><li>只显示当前背景</li><li>地球每刻</li></ul>详细请看开发文档 <a href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%a4%9a%e7%a7%8d%e8%83%8c%e6%99%af%e6%ba%90" target="_blank">背景更换模式</a>'
            },
            {
                element: $( ".feature[data-type=positionmode]" )[0],
                position: 'right',
                intro: '<img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/earth.jpg" alt="地球每刻"><br><span style="border-left:.25em solid rgba(255,255,255,0.9);padding-left:5px;">地球每刻由 <a href="http://himawari8.nict.go.jp/" target="_blank">向日葵-8號</a> 提供，详细请看 <a href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%9c%b0%e7%90%83%e6%af%8f%e5%88%bb" target="_blank">地球每刻</a></span>'
            }],
            controlbar: [{
                element: $( ".feature[data-type=controlbar]" )[0],
                position: 'left',
                intro: '直观的控制栏，包含多种操作方案：<br><ul><li>上传 · 下载</li><li>收藏</li><li>固定</li><li>下一张（刷新）</li><li>不喜欢</li></ul>详细请看开发文档 <a href="https://simptab.art/docs/#/%E6%8E%A7%E5%88%B6%E6%A0%8F" target="_blank">控制栏</a>'
            }],
            unsplash: [{
                element: $( ".feature[data-type=unsplash]" )[0],
                position: 'left',
                intro: '深度集成 对 Unsplash 源的定制化设置，包含：<ul><li>自定义 Unsplash 源</li><li>更改 Unsplash 源分辨率</li></ul>'
            }]
        },
        intros = introJs();
    intros.setOptions({
        hintButtonLabel: "确认",
        nextLabel: "下一条 →",
        prevLabel: "← 上一条",
        skipLabel: "",
        doneLabel: "完成",
        hidePrev: true,
        hideNext: true,
        exitOnEsc: true,
        exitOnOverlayClick: true,
        overlayOpacity: 0.8,
        steps: steps[id],
    });
    intros.onexit( function() {
        $( ".feature" ).removeClass( "active" );
    });
    intros.start();
}
*/

function tooltips( id ) {
    var steps  = {
        origins     : '<div class="title">支持从多个壁纸源获取数据</div><div class="details">必应每日图片 · 必应随机图片 · wallhaven.cc · unsplash.com · googleartproject.com · desktoppr.co · visualhunt.com</div><a class="learnmore" href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%a4%9a%e7%a7%8d%e8%83%8c%e6%99%af%e6%ba%90" target="_blank">多种背景源</a>',
        positionmode: '<div class="title">具有多种方式的壁纸更换模式</div><div class="details"><ul><li>每天更换背景<br><abbr style="font-size:11px;">每天更换一次，背景源只来源于 必应每日图片</abbr></li><li>随机更换</li><li>只显示当前背景</li><li>地球每刻</li></ul></div><a class="learnmore" href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%a4%9a%e7%a7%8d%e8%83%8c%e6%99%af%e6%ba%90" target="_blank">背景更换模式</a>',
        earth       : '<div class="title">地球每刻</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/earth.jpg" alt="地球每刻"><div class="details">感谢 <a target=\"_blank\" href=\"http://himawari8.nict.go.jp/\">向日葵-8號</a> 提供</div><a class="learnmore" href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%9c%b0%e7%90%83%e6%af%8f%e5%88%bb" target="_blank">地球每刻</a>',
        bgmanage    : '<div class="title">订阅精选集</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/subscibe.jpg" alt="订阅源"><div class="details">人工筛选，让你的标签页与众不同。</div><a class="learnmore" href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E7%AE%A1%E7%90%86%E5%99%A8" target="_blank">背景管理器</a>',
        bookmarks   : '<div class="title">书签栏</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/bookmarks.jpg" alt="书签栏"><div class="details">采用二级平铺目录，书签再深也不怕；<a target=\"_blank\" href=\"https://simptab.art/docs/#/%E4%B9%A6%E7%AD%BE%E6%A0%8F?id=%e5%bf%ab%e6%8d%b7%e6%90%9c%e7%b4%a2%e6%a0%8f\">快捷搜索</a> 接入多种搜索引擎。</div><a class="learnmore" href="https://simptab.art/docs/#/%E4%B9%A6%E7%AD%BE%E6%A0%8F" target="_blank">书签栏</a>',
        topsites    : '<div class="title">常用网址，一键直达</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/topsites.jpg" alt="常用网址"><div class="details">简洁模式 · 九宫格模式 · 隐藏，更可自定义。</div><a class="learnmore" href="https://simptab.art/docs/#/%E5%B8%B8%E7%94%A8%E7%BD%91%E5%9D%80" target="_blank">常用网址</a>',
        noise       : '<div class="title">白噪音</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/noise.jpg" alt="白噪音"><div class="details">内置白噪音，专心工作好伴侣。</div><a class="learnmore" href="https://simptab.art/docs/#/%E7%99%BD%E5%99%AA%E9%9F%B3" target="_blank">白噪音</a>',
        zenmode     : '<div class="title">禅模式</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/zenmode.jpg" alt="禅模式"><div class="details">更加专注，更加极简，高度定制化。内置 <a target=\"_blank\" href=\"https://simptab.art/docs/#/%E7%A6%85%E6%A8%A1%E5%BC%8F?id=%e8%84%9a%e6%9c%ac%e7%ae%a1%e7%90%86%e5%99%a8\">脚本管理器</a>，随时更换标签页</div><a class="learnmore" href="https://simptab.art/docs/#/%E7%A6%85%E6%A8%A1%E5%BC%8F" target="_blank">禅模式</a>',
        controlbar  : '<div class="title">直观的控制栏，多种操作方案</div><div class="details"><ul><li>上传 · 下载</li><li>收藏</li><li>固定</li><li>下一张（刷新）</li><li>不喜欢</li></ul></div><a class="learnmore" href="https://simptab.art/docs/#/%E6%8E%A7%E5%88%B6%E6%A0%8F" target="_blank">控制栏</a>',
        unsplash    : '<div class="title">深度集成 Unsplash 定制化设置</div><div class="details"><ul><li>自定义 Unsplash 源</li><li>更改 Unsplash 源分辨率</li></ul></div><a class="learnmore" href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e8%87%aa%e5%ae%9a%e4%b9%89unsplash%e6%ba%90" target="_blank">自定义 Unsplash 源</a>',
        options     : '<div class="title">丰富的定制化选项</div><div class="details">内置了大量的可定制化内容，包括：新标签页标题 · 时间格式 · 自定义样式 · 自定义脚本等<br>让你的新标签页再一次「与众不同」</div><a class="learnmore" href="https://simptab.art/docs/#/%E9%80%89%E9%A1%B9%E9%A1%B5" target="_blank">选项页</a>',
        shortcuts   : '<div class="title">键盘党的最爱</div><img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/shortcuts.jpg" alt="快捷键"><div class="details">支持全局 <kbd>ESC</kbd> 不仅如此，几乎每个功能均支持快捷键。</div><a class="learnmore" href="https://simptab.art/docs/#/%E5%BF%AB%E6%8D%B7%E9%94%AE" target="_blank">快捷键</a>',
    };
    var $target = $( ".feature[data-type=" + id + "]" );
    $target.append( '<div class="more">' + i18nn( "feature_" + id ) + '</div>' );
    $target.find( ".icon, .desc, .content" ).addClass( "hide" );
    setTimeout( function() {
        $target.find( ".more" ).addClass( "active" );
        lang == "en" && $target.find( ".more .learnmore" ).hide();
    }, 200 );

    $( ".feature .more" ).one( "click", function( event ) {
        var $target = $( event.currentTarget ).parent(),
            id      = $target.attr( "data-type" );
        $target.removeClass( "active" ).find( ".more" ).removeClass( "active" );
        setTimeout( function() {
            $target.find( ".icon, .desc, .content" ).removeClass( "hide" );
        }, 200 );
    });
}