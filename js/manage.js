
define([ "jquery", "lodash", "notify", "i18n", "vo", "date", "options", "files", "message", "unveil", "history" ], function( $, _, Notify, i18n, vo, date, options, files, message, unveil, history ) {

    "use strict";

    var albumLoad = 0,
        io     = new IntersectionObserver( observerImg ),
        oriImg = chrome.extension.getURL( "/assets/images/loading.gif" ),
        rTmpl  = '\
                <div class="close"><span class="waves-effect close"><i class="fas fa-times-circle"></i></span></div>\
                <div class="tabs">\
                    <div class="tab tab-active" idx="0">' + i18n.GetLang( "manage_tab_fav" ) + '</div>\
                    <div class="tab" idx="1">' + i18n.GetLang( "manage_tab_sub" ) + '</div>\
                    <div class="tab" idx="2">' + i18n.GetLang( "manage_tab_explore" ) + '</div>\
                </div>\
                <div class="albums">\
                    <div class="album favorite album-active"><div class="empty">Loading...</div></div>\
                    <div class="album subscribe"><div class="empty">Loading...</div></div>\
                    <div class="album explore"><div class="empty">Loading...</div></div>\
                </div>',
        favTmpl = '\
                <div class="photograph">\
                    <img src="' + oriImg + '" data-src=<%- album %>>\
                    <ul class="toolbox">\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_use"    ) + '" data-balloon-pos="up" class="waves-effect useicon"><i class="fas fa-check-circle"></i></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="waves-effect downicon"><i class="fas fa-arrow-circle-down"></i></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_remove" ) + '" data-balloon-pos="up" class="waves-effect removeicon"><i class="fas fa-minus-circle"></i></span></li>\
                    </ul>\
                </div>',
        subTmpl = '\
                <div class="photograph">\
                    <div class="photos">\
                        <div class="title"><%= title %></div>\
                        <div class="desc"><%= desc %></div>\
                        <div class="author"><a href="<%= contact %>" target="_blank"><%= name %></a></div>\
                        <div class="images">\
                            <%= images %>\
                        </div>\
                    </div>\
                </div>',
        exploreTmpl = '\
                <div class="photograph">\
                    <img src="' + oriImg + '" data-src=<%- album.thumb %>>\
                    <ul class="toolbox">\
                        <li><a href="<%= album.link %>" target="_blank"><span class="waves-effect linkicon"><i class="fas fa-home"></i></span></a></li>\
                        <li>\
                            <a href="<%= album.contact %>" target="_blank">\
                                <span data-balloon="<%= album.name %>" data-balloon-pos="up" class="waves-effect authoricon"><i class="fas fa-user-circle"></i></span>\
                            </a>\
                        </li>\
                        <li><span type="explore" data-vo="<%= encodeURI(JSON.stringify( album )) %>" data-balloon="' + i18n.GetLang( "manage_toolbar_use" ) + '" data-balloon-pos="up" class="waves-effect useicon"><i class="fas fa-check-circle"></i></span></li>\
                        <li><span type="explore" data-balloon="' + i18n.GetLang( "manage_toolbar_down" ) + '" data-balloon-pos="up" class="waves-effect downicon" url="<%= album.down %>" ><i class="fas fa-arrow-circle-down"></i></span></li>\
                    </ul>\
                </div>',
        imgTmpl = '\
                <div class="image">\
                    <img src="' + oriImg + '" data-src=<%- image.url %>>\
                    <ul class="toolbox">\
                        <li><a href="<%= image.info %>" target="_blank"><span class="waves-effect linkicon"><i class="fas fa-home"></i></span></a></li>\
                        <li>\
                            <a href="<%= image.contact == "" ? "#" : image.contact %>" target="<%= image.contact == "" ? "_self" : "_blank" %>">\
                                <span data-balloon="<%= image.name == "" ? "' + i18n.GetLang( "notify_mange_no_user" ) + '" : image.name %>" data-balloon-pos="up" class="waves-effect authoricon"><i class="fas fa-user-circle"></i></span>\
                            </a>\
                        </li>\
                        <li><span data-vo="<%= encodeURI(JSON.stringify( image )) %>" data-balloon="' + i18n.GetLang( "manage_toolbar_use" ) + '" data-balloon-pos="up" class="waves-effect useicon"><i class="fas fa-check-circle"></i></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="waves-effect downicon"><i class="fas fa-arrow-circle-down"></i></span></li>\
                    </ul>\
                </div>';

    function isPinTimeout() {
        var limit  = localStorage[ "simptab-pin" ],
            pin    = vo.cur.pin,
            diff   = date.TimeDiff( pin ),
            result = pin == -1 || diff > limit ? true : false;
        result && $( ".controlink[url='pin']" ).find("span").attr( "class", "icon pin" );
        return result;
    }

    function closeListenEvent() {
        $( ".manage .close" ).click( function( event ) {
            albumLoad = 0;
            $( "body" ).off( "click", ".manage .toolbox span" );
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
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

            if ( $( ".tabs .tab-active").attr("idx") == "2" ) {
                getExploreTmpl();
                localStorage["simptab-explore-notify"] != "false" &&
                    new Notify().Render({ content: i18n.GetLang( "tips_explore" ), action: i18n.GetLang( "tips_confirm" ), callback:function (){
                        localStorage["simptab-explore-notify"] = false;
                    }});
            }
        });
    }

    function toolbarListenEvent() {
        $( "body" ).on( "click", ".manage .toolbox span", function( event ) {
            var url    = $( event.currentTarget ).parent().parent().prev().attr( "src" ),
                new_vo = $( event.currentTarget ).attr( "data-vo" ),
                type   = $( event.currentTarget ).attr( "type" ),
                name   = url && url.replace( vo.constructor.FAVORITE, "" ).replace( ".jpg", "" );
            switch( event.currentTarget.className.replace( "waves-effect ", "" ) ) {
                case "useicon":
                    new_vo && ( new_vo = JSON.parse( decodeURI( new_vo )) );
                    if ( type == "explore" ) {
                        url  = new_vo.url;
                        name = new_vo.name;
                    }
                    setBackground( url, name, new_vo );
                    break;
                case "downicon":
                    if ( type == "explore" ) {
                        url = $( event.currentTarget ).attr( "url" );
                    }
                    files.Download( url, "simptab-wallpaper-" + date.Now() + ".png" );
                    break;
                case "removeicon":
                    files.Delete( name, function( result ) {
                        new Notify().Render( i18n.GetLang( "notify_mange_remove" ) );
                        $( event.currentTarget ).parent().parent().parent().slideUp( function() {
                            $( event.currentTarget ).parent().parent().parent().remove();
                        });
                        files.DeleteFavorite( files.FavoriteVO(), name );
                    }, function( error ) {
                        new Notify().Render( 2, i18n.GetLang( "notify_mange_remove_failed" ) );
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
        vo.cur.pin   = -1;
        vo.cur.dislike  = -1;
        vo.cur.favorite = -1;
        vo.cur.enddate  = date.Now();
        vo.cur.version  = "2.2";
        delete vo.cur.apis_vo;
    }

    function setBackground( url, name, new_vo ) {
        if ( !isPinTimeout() ) {
            new Notify().Render( 2, i18n.GetLang( "notify_pin_not_changed" ) );
            return;
        }
        if ( localStorage[ "simptab-background-mode" ] == "earth" ) {
            new Notify().Render( 2, i18n.GetLang( "notify_eartch_mode" ) );
            return;
        }
        // set vo.cur, include: favorite, subscribe
        var type = new_vo == undefined ? "favorite" : "subscribe";
        // when new_vo is undefined is favorite call
        new_vo == undefined && ( new_vo = files.FindFavorite( files.FavoriteVO(), name ));
        if ( new_vo ) {
            if ( type == "subscribe" ) { var notify = new Notify().Render({ content: i18n.GetLang( "notify_mange_setting" ), state: "loading" } ); }
            // save url to background.jpg
            files.GetDataURI( url ).then( function( result ) {
                files.DataURI( result );
                history.DataURI( result );
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
                        message.Publish( message.TYPE.UPDATE_CONTROLBAR, { url: url, info: vo.cur.info });
                        // complete notify
                        notify && notify.complete();
                        new Notify().Render( i18n.GetLang( "notify_mange_setting_success" ) );
                        history.Add( vo.cur );
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
            } else $( ".manage .empty" ).text( i18n.GetLang( "mange_explore_empty" ) );
        });
    }

    function getSubscribe( callback ) {
        $.ajax({
            type       : "GET",
            url        : "http://st.ksria.cn/special.day.v2.json?_=" + Math.round(+new Date()),
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
            if ( error ) $( ".manage .album .empty" ).text( i18n.GetLang( "mange_explore_empty" ) );
            else {
                var html = "";
                Object.keys( albums ).forEach( function( idx ) {
                    // get title and desc
                    var lang   = i18n.GetLocale(),
                        title  = category[idx]["lang"][lang].title,
                        desc   = category[idx]["lang"][lang].desc,
                        name   = category[idx]["author"].name,
                        contact= category[idx]["author"].contact,
                        images = albums[idx];

                    // get images html template
                    var imgComp  = _.template( '<% jq.each( images, function( idx, image ) { %>' + imgTmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                        imgHtml  = imgComp({ 'images': images });

                    // get subscribe html template
                    var scribComp = _.template( subTmpl ),
                        scribHTML = scribComp({ title: title, desc: desc, name: name, contact: contact, images: imgHtml });

                    html += scribHTML;
                });
                $( ".manage .albums .subscribe" ).html( html );
            }
        });
    }

    function getExploreTmpl() {
        if ( !options.Storage.db.unsplash || ( options.Storage.db.unsplash.length == 1 && options.Storage.db.unsplash[0] == "" )) {
            $( ".manage .album .empty" ).text( i18n.GetLang( "mange_explore_empty" ) );
            return;
        }
        $( ".albums .explore").find(".photograph").length == 0 && $( ".manage .album .empty" ).text( i18n.GetLang( "mange_explore_loading" ) );
        var COUNT  = 16,
            items  = [],
            CLIENT = "86ec05bcde52b196fe41f4e5602d35219fdaeb54fd73508c61ec93e24225c94a",
            screen = /\d+x\d+/.test( options.Storage.db.unsplash_screen ) ? options.Storage.db.unsplash_screen : "2560x1440",
            random = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) + min );
            },
            collection = options.Storage.db.unsplash[ random( 0, options.Storage.db.unsplash.length - 1 ) ],
            getCollection = function() {
                $.ajax({
                    type       : "GET",
                    url        : "https://api.unsplash.com/" + collection.replace( "collection", "collections" ) + "?client_id=" + CLIENT,
                    dataType   : "json"
                }).then( function( result ) {
                    if ( result && result.total_photos > 0 ) {
                        var page = random( 1, Math.ceil( result.total_photos / COUNT ));
                        getPhotos( page );
                    }
                }, function( jqXHR, textStatus, errorThrown ) {
                    $( ".manage .album .empty" ).text( i18n.GetLang( "mange_explore_empty" ) );
                });
            },
            getPhotos = function( page ) {
                var url = "https://api.unsplash.com/" + collection.replace( "collection", "collections" ) + "/photos?client_id=" + CLIENT + "&page=" + page + "&per_page=" + COUNT;
                $.ajax({
                    type       : "GET",
                    url        : url,
                    dataType   : "json"
                }).done( function( result ) {
                    if ( result && result.length >= COUNT ) {
                        for( var i = 0; i < COUNT; i++ ) {
                            var item = result[i];
                            items.push({
                                thumb: item.urls.thumb,
                                url: "https://source.unsplash.com/" + item.id + "/" + screen,
                                name: item.user.name,
                                contact: item.user.links.html,
                                info: item.links.html,
                                down: item.urls.full,
                            });
                        }
                        var compiled = _.template( '<% jq.each( albums, function( idx, album ) { %>' + exploreTmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                        html         = compiled({ 'albums': items });
                        $( ".manage .albums .explore .empty" ).remove();
                        $( ".manage .albums .explore" ).append( html );
                        $( ".manage .albums .explore").scroll()
                    } else $( ".manage .album .empty" ).text( i18n.GetLang( "mange_explore_empty" ) );
                }).fail( function( jqXHR, textStatus, errorThrown ) {
                    getCollection();
                });
            };
        getCollection();
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
        $(".albums").on("scroll", function() {
            if( $(this).scrollTop() + Math.floor( $(this).innerHeight() ) >= $(this)[0].scrollHeight - 1 ) {
                $( ".tabs .tab-active").attr("idx") == "2" && getExploreTmpl();
            }
        });
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
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog manage"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                $( ".dialog" ).html( rTmpl );
                closeListenEvent();
                tabListenEvent();
                albumLoadListenEvent();
                getFavoriteTmpl();
                getSubscribeTmpl();
                toolbarListenEvent();
                scrollListenEvent();
            }, 300 );
        }
    };
});