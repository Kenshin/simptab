define([ "jquery", "i18n", "vo", "date", "files", "setting", "manage", "about", "options" ], function( $, i18n, vo, date, files, setting, manage, about, options ) {

    "use strict";

    function setInfoURL() {
        var info    = vo.cur.info,
            $target = $( ".controlink[url='info']" );
        if ( i18n.GetLocale() != "zh_CN" ) vo.cur.info.replace( "/knows/", "/" );
        $target.attr({ "title" : vo.cur.name, "href" : info });
        $target.parent().find( ".tooltip" ).text( vo.cur.type == "upload" ? "Upload image" : vo.cur.type );
    }

    function setDownloadURL() {

        if ( vo.cur.info.search( "https://unsplash.com" ) == 0 ) {
            $( ".controlink[url='download']" ).attr({
                "href"     : vo.cur.hdurl,
                "target"   : "_blank",
            }).removeAttr( "url" );
        } else {
            var shortname = vo.cur.shortname;
            if ( shortname == "#" ) {
                shortname = vo.cur.name;
            }
            $( ".controlink[url='download']" ).attr({
                "title"    : vo.cur.name,
                "href"     : vo.cur.hdurl,
                "download" : "SimpTab-" + date.Now() + "-" + shortname + ".jpg"
            });
        }

    }

    function setBackground( url ) {
        if ( localStorage[ "simptab-background-update" ] == "true" ) return;
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    function setBackgroundPosition( is_settingclick ) {
        if ( !is_settingclick && $( "body" ).find( ".bgmask-bg" ).length > 0 ) return;
        var value = localStorage[ "simptab-background-position" ];
        if ( value == "mask" ) {
            var url       = vo.cur.type == "default" ? vo.cur.hdurl : "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg",
                maxHeight = 800,
                height    = $( "body" ).height();
            $( "body" ).addClass( "bgmask" ).prepend( '<div class="bgmask-bg"><img src="' + url + '"></div>' );
            $( "head" ).append( '<style class="bgmask-filter">.bgmask::before{background: url(' + url + ')}</style>' );
            height <= maxHeight && $( ".bgmask-bg" ).find( "img" ).height( height - 300 );
        } else {
            $( "body" ).removeClass( "bgmask" ).find( ".bgmask-bg" ).remove();
            $( ".bgmask-filter" ).remove();
            vo.cur.type == "default" || !value || value == "center" ? $( "body" ).addClass( "bgcenter" ) : $( "body" ).removeClass( "bgcenter" );
        }
    }

    function setUploadState( is_show ) {
        is_show ? $( ".controlink[url='upload']" ).parent().show() : $( ".controlink[url='upload']" ).parent().hide();
    }

    function setFavorteState( is_show ) {
        is_show ? $( ".controlink[url='favorite']" ).parent().show() : $( ".controlink[url='favorite']" ).parent().hide();
    }

    function setFavorteIcon() {
        $( ".controlink[url='favorite']" ).find("span").attr( "class", "icon " + (vo.cur.favorite == -1 ? "unfavoriteicon" : "favoriteicon") );
    }

    function setDislikeState( is_show ) {
        is_show ? $( ".controlink[url='dislike']" ).parent().show() : $( ".controlink[url='dislike']" ).parent().hide();
    }

    function setDislikeIcon() {
        $( ".controlink[url='dislike']" ).find("span").attr( "class", "icon " + ( vo.cur.dislike == -1 ? "dislike" : "disliked") );
    }

    function setPinState( is_show ) {
        is_show ? $( ".controlink[url='pin']" ).parent().show() : $( ".controlink[url='pin']" ).parent().hide();
    }

    function setPinIcon() {
        $( ".controlink[url='pin']" ).find("span").attr( "class", "icon " + (vo.cur.pin == -1 ? "pin" : "pinned") );
    }

    function setCurBackgroundURI() {
        files.GetDataURI( vo.constructor.CURRENT_BACKGROUND ).done( function( dataURI) {
            files.DataURI( dataURI );
        });
    }

    function update( url ) {
        // change background
        $( "body" ).css( "background-image", 'url("' + url + '")' );
        // change background mask
        $( "head" ).find( ".bgmask-filter" ).html( '<style class="bgmask-filter">.bgmask::before{background: url(' + url + ')}</style>' );
        $( "body" ).find( ".bgmask-bg > img" ).attr( "src", url );
        // change conntrolbar download url and info
        $($( ".controlbar" ).find( "a" )[4]).attr( "href", url );
        $( ".controlbar" ).find( "a[url=info]" ).prev().text( vo.cur.type );
        // change favorite
        setFavorteIcon();
    }

    return {
        Listen: function ( callBack ) {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.getCurrent( function( tab ) {
                    chrome.tabs.update( tab.id, { url : $( event.currentTarget ).attr( "url" ) });
                });
            });

            $( ".controlink[url=setting]" ).mouseenter( function( event ) {
                $( ".controlink[url=setting]" ).prev().addClass( "horz-toolbox-show" );
                $( ".controlink[url=manage]" ).parent().addClass( "horz-toolbox-show-1" );
                $( ".controlink[url=options]" ).parent().addClass( "horz-toolbox-show-2" );
                $( ".controlink[url=about]" ).parent().addClass( "horz-toolbox-show-3" );
            });

            $($( ".controlbar li" )[8]).mouseleave( function( event ) {
                $( ".controlink[url=setting]" ).prev().removeClass( "horz-toolbox-show" );
                $( ".controlink[url=manage]" ).parent().removeClass( "horz-toolbox-show-1" );
                $( ".controlink[url=options]" ).parent().removeClass( "horz-toolbox-show-2" );
                $( ".controlink[url=about]" ).parent().removeClass( "horz-toolbox-show-3" );
            });

            $( $( ".controlbar" ).find( "a" )[3] ).mouseenter( function( event ) {
                $( $( ".controlbar" ).find( "a" )[3] ).prev().addClass( "horz-toolbox-show" );
                $( $( ".controlbar" ).find( "a" )[0] ).parent().addClass( "horz-toolbox-show-1" );
                $( $( ".controlbar" ).find( "a" )[1] ).parent().addClass( "horz-toolbox-show-2" );
                $( $( ".controlbar" ).find( "a" )[2] ).parent().addClass( "horz-toolbox-show-3" );
            });

            $($( ".controlbar li" )[0]).mouseleave( function( event ) {
                $( $( ".controlbar" ).find( "a" )[3] ).prev().removeClass( "horz-toolbox-show" );
                $( $( ".controlbar" ).find( "a" )[0] ).parent().removeClass( "horz-toolbox-show-1" );
                $( $( ".controlbar" ).find( "a" )[1] ).parent().removeClass( "horz-toolbox-show-2" );
                $( $( ".controlbar" ).find( "a" )[2] ).parent().removeClass( "horz-toolbox-show-3" );
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                var $target =  $( event.currentTarget ),
                    url     = $target.attr( "url" );

                switch ( url ) {
                    case "setting":
                        var width = parseInt( i18n.GetSettingWidth() );
                        if ( !$target.hasClass( "close" )) {
                            $( ".setting" ).css({ "transform": "translateX(0px)", "opacity": 0.8 });
                            $( ".sidebar" ).animate({ right: width }, 500, function() {
                                $target.addClass( "close" );
                                $( ".setting" ).addClass( "open" );
                            });

                            //$( ".seniorgp, .bottom" ).animate({ right: parseInt($(".bottom").css("right")) + width }, 500 ); // 116-simptab-optimize-layout

                            // 116-simptab-optimize-layout
                            var selector = ".content, .sidebar, .controlbar, .clock";
                            $( selector ).on( "click", function( event ) {
                                var cls  = $( event.target ).attr( "class" );
                                if ( selector.indexOf( cls ) != -1 ) {
                                    $( selector ).off( "click" );
                                    $( ".controlink .settingicon" ).trigger( "click" );
                                }

                            });
                        }
                        else {
                           $( ".setting" ).css({ "transform": "translateX(" + width + "px)", "opacity": 0 });
                           $( ".sidebar" ).animate({ right: 0 }, 600, function() {
                                $target.removeClass( "close" );
                                $( ".setting" ).removeClass( "open" );
                            });
                            //$( ".seniorgp, .bottom" ).animate({ right: "65px" }, 500 );    // 116-simptab-optimize-layout
                        }
                        break;
                    case "favorite":
                        var is_favorite = $($target.find("span")).hasClass("unfavoriteicon") ? true : false;
                        callBack( url, is_favorite );
                        break;
                    case "download":
                        // hack code( when 'unsplash.com' or 'nasa.gov' image download, new tab happen crash error. )
                        //if ( vo.cur.type != "unsplash.com" && vo.cur.type != "nasa.gov" ) {
                        //event.currentTarget.href = files.DataURI() || vo.cur.hdurl;
                        //}
                        break;
                    case "upload":
                        var input  = document.createElement("input"),
                            $input = $(input);

                        $input.attr({ type : "file", multiple : "true" });
                        $input.one( "change", function(event){
                            callBack( url, event.currentTarget.files );
                            input  = null;
                            $input = null;
                        });
                        $input.trigger("click");
                        break;
                    case "refresh":
                        callBack( url, "time" );
                        break;
                    case "dislike":
                        var is_dislike = $target.find( "span" ).hasClass( "dislike" );
                        callBack( url, is_dislike );
                        break;
                    case "pin":
                        var is_pinned = $target.find( "span" ).hasClass( "pinned" );
                        setting.TogglePinState( !is_pinned );
                        callBack( url, is_pinned );
                        break;
                    case "manage":
                        $( "body" ).find( ".dialog-overlay" ).length == 0 ?
                            manage.Render() :
                            new Notify().Render( i18n.GetLang( "notify_double_open" ) );
                        break;
                    case "options":
                        $( "body" ).find( ".dialog-overlay" ).length == 0 ?
                            options.Render() :
                            new Notify().Render( i18n.GetLang( "notify_double_open" ) );
                        break;
                    case "about":
                        $( "body" ).find( ".dialog-overlay" ).length == 0 ?
                            about.Render() :
                            new Notify().Render( i18n.GetLang( "notify_double_open" ) );
                        break;
                    case "mobile":
                        if ( !/http:\/\/(\d{1,3}.){4}:\d+/ig.test( options.Storage.db.mobile_host ) ) {
                            new Notify().Render( 2, i18n.GetLang( "notify_mobile_host_failed" ) );
                            return;
                        }
                        var notify = new Notify().Render({ content: i18n.GetLang( "notify_mobile_send" ), state: "loading" });
                        $.ajax({
                            type       : "POST",
                            url        : options.Storage.db.mobile_host,
                            data       : files.DataURI(),
                        }).then( function( result ) {
                            if ( result.status == 200 ) {
                                notify.complete();
                                new Notify().Render( i18n.GetLang( "notify_mobile_send_success" ) + result.name );
                            } else new Notify().Render( 2, i18n.GetLang( "notify_mobile_send_failed" ) );
                        } , function( jqXHR, textStatus, errorThrown ) {
                            notify.complete();
                            new Notify().Render( 2, i18n.GetLang( "notify_mobile_send_failed" ) );
                        });
                        break;
                }
            });
        },

        AutoClick: function( idx ) {
            if ( idx < 3 ) {
                $( $(".chromelink")[idx] ).click();
            }
            else {
                var $target = $( $(".controlbar").find( "a" )[idx] ),
                    type    = $target.attr("url"),
                    hidden  = $target.parent().has(":hidden"),
                    hidden  = hidden && hidden.length > 0 ? true : false,
                    arr     = [ "upload", "favorite", "dislike", "pin" ];
                ( arr.indexOf( type ) == -1 || !hidden ) && $target[0].click();
            }
        },

        Set: function( is_default ) {

            // set default background
            is_default ? vo.cur = vo.Clone( vo.Create( vo.constructor.DEFAULT_BACKGROUND, vo.constructor.DEFAULT_BACKGROUND, "Wallpaper", "#", date.Now(), "Wallpaper", "default", {} )) : setCurBackgroundURI();

            setInfoURL();
            setDownloadURL();
            setBackground( is_default ? vo.constructor.DEFAULT_BACKGROUND: vo.constructor.CURRENT_BACKGROUND );
            setBackgroundPosition();
            setUploadState( setting.IsRandom() );
            setFavorteState( !is_default && vo.cur.dislike == -1 );
            setFavorteIcon();
            setPinState( (!is_default && vo.cur.dislike == -1 && setting.IsRandom()) );
            setPinIcon();
            setDislikeState( !is_default && ( vo.cur.favorite == -1 && vo.cur.pin == -1 && vo.cur.type != "upload" ) && setting.IsRandom() );
            setDislikeIcon();
            setting.TogglePinState( vo.cur.pin != -1 );
        },
        SetBgPosition     : setBackgroundPosition,
        SetFavorteIcon    : setFavorteIcon,
        SetFavorteState   : setFavorteState,
        setDislikeIcon    : setDislikeIcon,
        SetDislikeState   : setDislikeState,
        setPinIcon        : setPinIcon,
        setPinState       : setPinState,
        Update            : update,
    };
});
