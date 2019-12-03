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

function tooltips( id ) {
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