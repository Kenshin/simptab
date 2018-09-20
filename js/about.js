define([ "jquery", "lodash", "notify", "i18n" ], function( $, _, Notify, i18n ) {

    var rTmpl  = '\
                <div class="close"><span class="close"></span></div>\
                    <div class="about">\
                        <div class="banner"><img src="filesystem:' + chrome.extension.getURL( "temporary/background.jpg" ) + '?' + +new Date() + '"/></div>\
                        <div class="content">\
                            <h1>简 Tab</h1>\
                            <h3>' + i18n.GetLang( 'extension_desc' ) + '去除多余功能，只关注标签页呈现效果。</h3>\
                            <p className="desc">\
                                嗨，我叫 <a href="http://kenshin.wang" target="_blank">Kenshin</a> ，感谢使用 简 Tab，希望它可以给你一成不变的 New Tab 带来一些不同；简 Tab 只关注如何能更好的在 New Tab 呈现背景，这些背景均来自于：<code>bing</code> · <code>unsplash</code> · <code>flickr</code> · <code>wallhaven</code> · <code>google art</code> · <code>desktoppr</code> · <code>visualhunt</code> 等。<br>\
                                除此以外，简 Tab 还拥有自己的 <code>精选集</code>；如同 iPhone 上的壁纸类 App 一样，通过 <code>人工筛选</code> 的方式进一步将适合作为 New Tab 背景的壁纸呈现给你；这也是与其它同类扩展最大的不同。<br><br>\
                                如果你有 <code>好的作品</code> 亦或 <code>适合的背景</code>，也请告诉 简 Tab，投稿地址 👉 <a href="" target="_blank">猛戳这里</a> · <a href="" target="_blank">备用地址</a> <br>\
                            </p>\
                            \
                        </div>\
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