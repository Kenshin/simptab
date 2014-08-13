"use strict";
$( document ).ready( function() {

    var lang = navigator.language;

    // set 'en-XX' to 'en'
    if ( lang.split("-")[0] == "en" ) {
        lang = "en";
    }

    // set default language
    if ( lang != "en" && lang != "zh-CN" && lang != "zh-TW" ) {
        lang = "en";
    }

    // set cookie
    var newLang = $.cookie( "lang" );
    if ( newLang != undefined ) {
        lang = newLang;
    }

    // get http://xxxx.index.html?lang=xxx
    newLang = getQueryString( "lang" )
    if ( newLang != null ) {
        lang = newLang;
    }

    // set options
    var options = {
        load         : "current",
        lng          : lang,
        lowerCaseLng : true,
        fallbackLng  : false,
        debug        : true,
        cookieName   : "lang",
        useCookie    : true,
        detectLngQS  : "lang"
    };

    // i18n init
    i18n.init( options, function( t ) {

    	$(".title > h1 > div").html( t( "title" ));
    	$(".download > .btn-download > div").html( t( "download" ));
    });

});

function getQueryString( name ) {
    var reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)", "i" );
    var r = window.location.search.substr(1).match( reg );
    if (r != null) return unescape(r[2]); return null;
}