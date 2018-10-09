define([ "jquery", "lodash", "notify", "i18n" ], function( $, _, Notify, i18n ) {

    var prefix = i18n.GetLang( 'lang' ) == "cn" ? "" : i18n.GetLang( 'lang' ),
        rTmpl  = '\
                <div class="close"><span class="close"></span></div>\
                    <div class="about">\
                        <div class="banner"><img src="filesystem:' + chrome.extension.getURL( "temporary/background.jpg" ) + '?' + +new Date() + '"/></div>\
                        <div class="content">\
                            <div class="title">\
                                <h1>' + i18n.GetLang( 'short_title' ) + '</h1>\
                                <div>\
                                    <a target="_blank" href="https://github.com/Kenshin/simptab/releases"><img src="' + chrome.extension.getURL( "assets/images/version.svg" ) + '"></a>\
                                    <a target="_blank" href="http://ksria.com/simptab"><img src="' + chrome.extension.getURL( "assets/images/website.svg" ) + '"></a>\
                                    <a target="_blank" href="https://gitter.im/kenshin/simptab"><img src="' + chrome.extension.getURL( "assets/images/gitter.svg" ) + '"></a>\
                                    <a target="_blank" href="https://github.com/Kenshin/simptab"><img src="' + chrome.extension.getURL( "assets/images/github.svg" ) + '"></a>\
                                    <a target="_blank" href="https://github.com/Kenshin/simptab/blob/master/CHANGELOG' + prefix + '.md"><img src="' + chrome.extension.getURL( "assets/images/changelog.svg" ) + '"></a>\
                                    <a target="_blank" href="https://weibo.com/simptab"><img src="' + chrome.extension.getURL( "assets/images/weibo.svg" ) + '"></a>\
                                </div>\
                            </div>\
                            <h3>' + i18n.GetLang( 'extension_desc' ) + '</h3>\
                            <div>\
                                ' + i18n.GetLang( 'about_content_begin' ) + '<b class="ellipsis">' + i18n.GetLang( 'about_content_more' ) + '</b><span class="more">' + i18n.GetLang( 'about_content_middle' ) + '</span>' + i18n.GetLang( 'about_content_end' ) + '\
                            </div>\
                        </div>\
                        <div class="footer">' + i18n.GetLang( 'short_title' ) + ' - ' + i18n.GetLang( 'extension_desc' ) + ' © 2014 <a href="http://ksria.com/simptab">ksria.com</a> via <a href="http://kenshin.wang" target="_blank">Kenshin</a></div>\
                    </div>\
                </div>';

    function closeListenEvent() {
        $( ".dialog .close" ).click( function( event ) {
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
            }, 400 );
        });
    }

    function moreAbout() {
        $( ".about .content .ellipsis" ).click( function( event ) {
            $( ".about .content .ellipsis" ).remove();
            $( ".about .content .more" ).show( 600 );
        });
    }

    return {
        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog" style="height:auto;"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                $( ".dialog" ).html( rTmpl );
                closeListenEvent();
                moreAbout();
            }, 10 );
        }
    }
});