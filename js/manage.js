
define([ "jquery", "lodash", "notify", "i18n", "vo", "date", "error", "files" ], function( $, _, Notify, i18n, vo, date, SimpError, files ) {

    "use strict";

    var tmpl = '<div class="close"><span class="close"></span></div>\
                <div class="tabs">\
                    <div class="tab tab-active" idx="0">' + i18n.GetLang( "manage_tab_fav" ) + '</div>\
                    <div class="tab" idx="1">' + i18n.GetLang( "manage_tab_sub" ) + '</div>\
                </div>\
                <div class="albums">\
                    <div class="album favorite album-active"><div class="empty">Loading...</div></div>\
                    <div class="album subscribe"></div>\
                </div>\
               ',
        album = '<div class="photograph">\
                    <img src=<%- album %>>\
                    <ul class="toolbox">\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_use"    ) + '" data-balloon-pos="up" class="useicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="downicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_remove" ) + '" data-balloon-pos="up" class="removeicon"></span></li>\
                    </ul>\
                </div>';

    function closeListenEvent() {
        $( ".manage .close" ).click( function( event ) {
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

    function getFavoriteTmpl() {
        files.List( function( result ) {
            if ( result.length > 0 ) {
                    var compiled = _.template( '<% jq.each( albums, function( idx, album ) { %>' + album + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                    html     = compiled({ 'albums': result });
                $( ".manage .albums .favorite" ).html( html );
                toolbarListenEvent();
            } else {
                $( ".manage .empty" ).text( "暂时没有任何收藏的图片" );
            }
        });
    }

    function setFavorite2Bg( url, name ) {
        // set vo.cur
        var new_vo = files.FindFavorite( files.FavoriteVO(), name );
        if ( new_vo ) {
            // save favorite to background.jpg
            files.GetDataURI( url ).then( function( result ) {
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) { console.log( "Write process:", result ); })
                    .fail(     function( result ) { console.log( "Write error: ", result );  })
                    .done( function( result ) {
                        console.log( "Write completed: ", result );
                        vo.cur = new_vo;
                        vo.Set( vo.cur );
                        console.log( "======= Current background dispin success.", vo )
                });
            });
            // hack code
            // change background
            $( "body" ).css( "background-image", 'url("' + url + '")' );
            // change background mask
            $( "head" ).find( ".bgmask-filter" ).html( '<style class="bgmask-filter">.bgmask::before{background: url(' + url + ')}</style>' );
            $( "body" ).find( ".img-bg > img" ).attr( "src", url );
            // change conntrolbar download url and info
            $($( ".controlbar" ).find( "a" )[4]).attr( "href", url );
            $( ".controlbar" ).find( "a[url=info]" ).prev().text( vo.cur.type );
        }
    }

    function toolbarListenEvent() {
        $( ".manage .toolbox span" ).click( function( event ) {
            var url  = $( event.target ).parent().parent().prev().attr( "src" ),
                name = url.replace( vo.constructor.FAVORITE, "" ).replace( ".jpg", "" );
            switch( event.target.className ) {
                case "useicon":
                    setFavorite2Bg( url, name );
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

    return {
        Render: function () {
            var compiled = _.template( tmpl ),
                html     = compiled();

            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( html );
                closeListenEvent();
                tabListenEvent();
                getFavoriteTmpl();
            }, 10 );
        }
    };
});