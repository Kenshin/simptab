"use strict";
$( document ).ready( function() {
    var lang = navigator.language;

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

    $( ".feature .learnmore").on( "click", function( event ) {
        var id = $( event.currentTarget ).parent().parent().attr( "data-type" );
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

function tooltips( id ) {
    var steps  = {
            origins: [{
                element: $( ".feature[data-type=origins]" )[0],
                intro: '简 Tab 支持从多个壁纸源获取数据，包括：<ul><li>必应每日图片</li><li>必应随机图片</li><li>wallhaven.cc</li><li>unsplash.com</li><li>googleartproject.com</li><li>desktoppr.co</li><li>visualhunt.com</li></ul>详细请看开发文档 <a href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%a4%9a%e7%a7%8d%e8%83%8c%e6%99%af%e6%ba%90" target="_blank">多种背景源</a>'
            }],
            positionmode: [{
                element: $( ".feature[data-type=positionmode]" )[0],
                position: 'right',
                intro: '简 Tab 具有多种方式的壁纸更换模式，包括：<ul><li>每天更换背景<br><abbr>每天更换一次，背景源只来源于 必应每日图片</abbr></li><li>随机更换<br><abbr>每次新打开标签页，即可看到一副新的背景图</abbr></li><li>只显示当前背景</li><li>地球每刻</li></ul>'
            },
            {
                element: $( ".feature[data-type=positionmode]" )[0],
                position: 'right',
                intro: '<img src="https://simptab-1254315611.cos.ap-shanghai.myqcloud.com/www/earth.jpg" alt="地球每刻"><br><span style="border-left:.25em solid rgba(255,255,255,0.9);padding-left:5px;">地球每刻由 <a href="http://himawari8.nict.go.jp/" target="_blank">向日葵-8號</a> 提供，详细请看 <a href="https://simptab.art/docs/#/%E8%83%8C%E6%99%AF%E6%BA%90?id=%e5%9c%b0%e7%90%83%e6%af%8f%e5%88%bb" target="_blank">地球每刻</a></span>'
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
        overlayOpacity: 0.2,
        steps: steps[id],
    });
    intros.start();
}