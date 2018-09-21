define([ "jquery", "lodash", "notify", "i18n" ], function( $, _, Notify, i18n ) {

    var rTmpl  = '\
                <div class="close"><span class="close"></span></div>\
                    <div class="about" style="height:auto;">\
                        <div class="banner"><img src="filesystem:' + chrome.extension.getURL( "temporary/background.jpg" ) + '?' + +new Date() + '"/></div>\
                        <div class="content">\
                            <h1>'  + i18n.GetLang( 'short_title' )    + '</h1>\
                            <h3>'  + i18n.GetLang( 'extension_desc' ) + '</h3>\
                            <div>' + i18n.GetLang( 'about_content' )  + '</div>\
                        </div>\
                        <div class="footer">' + i18n.GetLang( 'short_title' ) + ' - ' + i18n.GetLang( 'extension_desc' ) + ' © 2014 <a href="http://ksria.com/simptab">ksria.com</a> via <a href="http://kenshin.wang" target="_blank">Kenshin</a></div>\
                    </div>\
                </div>';

    function closeListenEvent() {
        $( ".manage .close" ).click( function( event ) {
            $( ".manage-bg" ).removeClass( "manage-bg-show" );
            setTimeout( function() {
                $( ".manage-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Render: function() {
            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( rTmpl );
                closeListenEvent();
            }, 10 );
        }
    }
});