
define([ "jquery", "lodash", "notify", "i18n", "vo", "date", "error", "files", "message", "unveil" ], function( $, _, Notify, i18n, vo, date, SimpError, files, message, unveil ) {

    "use strict";

    var albumLoad = 0,
        io     = new IntersectionObserver( observerImg ),
        oriImg = chrome.extension.getURL( "/assets/images/loading.gif" ),
        rTmpl  = '\
                <div class="close"><span class="close"></span></div>\
                <div class="tabs">\
                    <div class="tab tab-active" idx="0">' + i18n.GetLang( "manage_tab_fav" ) + '</div>\
                    <div class="tab" idx="1">' + i18n.GetLang( "manage_tab_sub" ) + '</div>\
                </div>\
                <div class="albums">\
                    <div class="album favorite album-active"><div class="empty">Loading...</div></div>\
                    <div class="album subscribe"><div class="empty">Loading...</div></div>\
                </div>',
        favTmpl = '\
                <div class="photograph">\
                    <img src="' + oriImg + '" data-src=<%- album %>>\
                    <ul class="toolbox">\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_use"    ) + '" data-balloon-pos="up" class="useicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="downicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_remove" ) + '" data-balloon-pos="up" class="removeicon"></span></li>\
                    </ul>\
                </div>',
        subTmpl = '\
                <div class="photograph">\
                    <div class="photos">\
                        <div class="title"><%= title %></div>\
                        <div class="desc"><%= desc %></div>\
                        <div class="images">\
                            <%= images %>\
                        </div>\
                    </div>\
                </div>',
        imgTmpl = '\
                <div class="image">\
                    <img src="' + oriImg + '" data-src=<%- image.url %>>\
                    <ul class="toolbox">\
                        <li>\
                            <a href="<%= image.contact == "" ? "#" : image.contact %>" target="<%= image.contact == "" ? "_self" : "_blank" %>">\
                                <span data-balloon="<%= image.name == "" ? "暂无" : image.name %>" data-balloon-pos="up" class="authoricon"></span>\
                            </a>\
                        </li>\
                        <li><a href="<%= image.info %>" target="_blank"><span class="linkicon"></span></a></li>\
                        <li><span data-vo="<%= encodeURI(JSON.stringify( image )) %>" data-balloon="' + i18n.GetLang( "manage_toolbar_use"    ) + '" data-balloon-pos="up" class="useicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="downicon"></span></li>\
                    </ul>\
                </div>';

    function closeListenEvent() {
        $( ".manage .close" ).click( function( event ) {
            albumLoad = 0;
            $( "body" ).off( "click", ".manage .toolbox span" );
            $( ".manage-bg" ).removeClass( "manage-bg-show" );
            setTimeout( function() {
                $( ".manage-overlay" ).remove();
            }, 400 );
        });
    }

    function tabListenEvent() {
        $( ".manage .tab" ).click( function( event ) {
            var $target = $( event.target ),
                idx     = $target.attr( "idx" );
            $( ".manage .tab" ).removeClass( "tab-active" );
            $target.addClass( "tab-active" );

            $( ".manage .album" ).removeClass( "album-active" );
            $( $( ".manage .album" )[idx] ).addClass( "album-active" );
        });
    }

    function toolbarListenEvent() {
        $( "body" ).on( "click", ".manage .toolbox span", function( event ) {
            var url    = $( event.target ).parent().parent().prev().attr( "src" ),
                new_vo = $( event.target ).attr( "data-vo" ),
                name   = url.replace( vo.constructor.FAVORITE, "" ).replace( ".jpg", "" );
            switch( event.target.className ) {
                case "useicon":
                    new_vo && ( new_vo = JSON.parse( decodeURI( new_vo )) );
                    setBackground( url, name, new_vo );
                    break;
                case "downicon":
                    var title = "SimpTab-Favorite-" + url.replace( vo.constructor.FAVORITE, "" );
                    files.Download( url, title );
                    break;
                case "removeicon":
                    files.Delete( name, function( result ) {
                        new Notify().Render( "已删除当前背景" );
                        $( event.target ).parent().parent().parent().slideUp( function() {
                            $( event.target ).parent().parent().parent().remove();
                        });
                        files.DeleteFavorite( files.FavoriteVO(), name );
                    }, function( error ) {
                        new Notify().Render( 2, "删除错误，请重新操作。" );
                    });
                    break;
            }
        });
    }

    function subscribe2VO( new_vo ) {
        vo.cur.hdurl = new_vo.url;
        vo.cur.url   = new_vo.url;
        vo.cur.info  = new_vo.info;
        vo.cur.name  = new_vo.origin;
        vo.cur.favorite = -1;
        delete vo.cur.apis_vo;
    }

    function setBackground( url, name, new_vo ) {
        // set vo.cur, include: favorite, subscribe
        var type = new_vo == undefined ? "favorite" : "subscribe";
        // when new_vo is undefined is favorite call
        new_vo == undefined && ( new_vo = files.FindFavorite( files.FavoriteVO(), name ));
        if ( new_vo ) {
            type == "subscribe" && new Notify().Render( "开始下载当前图片并设定为背景，请稍后..." );
            // save url to background.jpg
            files.GetDataURI( url ).then( function( result ) {
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) { console.log( "Write process:", result ); })
                    .fail(     function( result ) { console.log( "Write error: ", result );  })
                    .done( function( result ) {
                        console.log( "Write completed: ", result );
                        // set new_vo to vo.cur
                        type == "favorite" ? vo.cur = new_vo : subscribe2VO( new_vo );
                        vo.Set( vo.cur );
                        console.log( "======= Current background download success.", vo )
                        // add url to custom event
                        message.Publish( message.TYPE.UPDATE_CONTROLBAR, { url: url });
                        // complete notify
                        new Notify().Render( "设置成功。" );
                    });
            });
        }
    }

    function getFavoriteTmpl() {
        files.List( function( result ) {
            if ( result.length > 0 ) {
                var compiled = _.template( '<% jq.each( albums, function( idx, album ) { %>' + favTmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                    html     = compiled({ 'albums': result });
                $( ".manage .albums .favorite" ).html( html );
            } else $( ".manage .empty" ).text( "暂时没有任何收藏的图片" );
        });
    }

    function getSubscribe( callback ) {
        $.ajax({
            type       : "GET",
            url        : "http://simptab.qiniudn.com/special.day.v2.json?_=" + Math.round(+new Date()),
            dataType   : "json"
        }).then( function( result ) {
            if ( result && result.collections ) {
                var category    = result.category,
                    collections = result.collections,
                    len         = collections.length,
                    albums      = {},
                    album;
                for( var i = 0; i < len; i++ ) {
                    album = collections[i];
                    if ( !albums[ album.create ] ) {
                        albums[ album.create ] = [ album ];
                    } else albums[ album.create ].push( album );
                }
                callback( albums, category );
            } else callback( undefined, undefined, "remote json error" );
        }, function( jqXHR, textStatus, errorThrown ) {
            callback( undefined, undefined, textStatus );
        });
    }

    function getSubscribeTmpl() {
        getSubscribe( function( albums, category, error ) {
            if ( error ) new Notify().Render( 2, "获取订阅源错误，请稍后再试。" );
            else {
                var html = "";
                Object.keys( albums ).forEach( function( idx ) {
                    // get title and desc
                    var lang   = i18n.GetLocale(),
                        title  = category[idx]["lang"][lang].title,
                        desc   = category[idx]["lang"][lang].desc,
                        images = albums[idx];

                    // get images html template
                    var imgComp  = _.template( '<% jq.each( images, function( idx, image ) { %>' + imgTmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                        imgHtml  = imgComp({ 'images': images });

                    // get subscribe html template
                    var scribComp = _.template( subTmpl ),
                        scribHTML = scribComp({ title: title, desc: desc, images: imgHtml });

                    html += scribHTML;
                });
                $( ".manage .albums .subscribe" ).html( html );
            }
        });
    }

    function albumLoadListenEvent() {
        var observer = new MutationObserver( function() {
            albumLoad++;
            if ( albumLoad <= 2 ) {
                setTimeout( function() { checkImg(); }, 800 );
                observer = undefined;
            }
        });
        observer.observe( $( ".manage .albums" )[0], { childList: true, subtree: true });
    }

    function checkImg() {
        var imgs = Array.from( $( ".manage .albums img" ) );
        imgs.forEach( function ( item ) {
            $( item ).attr( "data-src" ) ? io.observe( item ) : io.unobserve( item );
        });
    }

    function loadImg( el ) {
        var $target = $( el ),
            lazy    = $target.attr( "data-src" );
        lazy && $( el ).unveil( 200, function() {
            $( this ).removeAttr( "data-src" );
        });
    }

    function scrollListenEvent() {
        $( ".manage .albums" ).scroll( function() {
            checkImg();
        })
    }

    function observerImg( ioes ) {
        ioes.forEach( function( ioe ) {
            var el  = ioe.target,
                num = ioe.intersectionRatio;
            num > 0 && loadImg( el );
            el.onload = el.onerror = function() { io.unobserve( el ) };
        });
    }

    return {
        Render: function () {
            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( rTmpl );
                closeListenEvent();
                tabListenEvent();
                albumLoadListenEvent();
                getFavoriteTmpl();
                getSubscribeTmpl();
                toolbarListenEvent();
                scrollListenEvent();
            }, 10 );
        }
    };
});