
define([ "jquery", "i18n" ], function( $, i18n ) {

    return {
        Bing: function ( random, errorBack, callBack ) {

            var local = "",
                url   = "";

            // set local
            if ( i18n.GetLocale() == "zh_CN" ) {
                local = "cn.";
            }

            // set url
            url = "http://" + local + "bing.com/HPImageArchive.aspx?format=js&idx=" + random + "&n=1";

            console.log("url = " + url );

            $.ajax({
                type       : "GET",
                timeout    : 2000,
                url        : url,
                dataType   : "json",
                error      : function( jqXHR, textStatus, errorThrown ) {
                    errorBack( jqXHR, textStatus, errorThrown );
                },
                success    : function( result ) {
                    callBack( result );
                }
            });

        }
    }
});
