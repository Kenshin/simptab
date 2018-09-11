define([ "jquery", "i18n", "vo", "date", "files", "setting" ], function( $, i18n, vo, date, files, setting ) {

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
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    function setBackgroundPosition( is_settingclick ) {
        if ( !is_settingclick && $( "body" ).find( ".img-bg" ).length > 0 ) return;
        var value = localStorage[ "simptab-background-position" ];
        if ( value == "mask" ) {
            var url       = vo.cur.type == "default" ? vo.cur.hdurl : "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg",
                maxHeight = 800,
                height    = $( "body" ).height();
            $( "body" ).addClass( "bgmask" ).prepend( '<div class="img-bg"><img src="' + url + '"></div>' );
            $( "head" ).append( '<style class="bgmask-filter">.bgmask::before{background: url(' + url + ')}</style>' );
            height <= maxHeight && $( ".img-bg" ).find( "img" ).height( height - 300 );
        } else {
            $( "body" ).removeClass( "bgmask" ).find( ".img-bg" ).remove();
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

    return {
        Listen: function ( callBack ) {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.getCurrent( function( tab ) {
                    chrome.tabs.update( tab.id, { url : $( event.currentTarget ).attr( "url" ) });
                });
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                var $target =  $( event.currentTarget ),
                    url     = $target.attr( "url" );

                switch ( url ) {
                    case "setting":
                        if ( !$target.hasClass( "close" )) {
                            var width = parseInt( i18n.GetSettingWidth() );

                            $( ".setting" ).animate({ "width": width, opacity : 0.8 }, 500, function() {
                                $target.addClass( "close" );
                            });

                            $( ".seniorgp, .bottom" ).animate({ right: parseInt($(".bottom").css("right")) + width }, 500 ); // 116-simptab-optimize-layout

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
                            $( ".setting" ).animate({ width: 0, opacity : 0 }, 500, function() {
                                $target.removeClass( "close" );
                            });
                            $( ".seniorgp, .bottom" ).animate({ right: "65px" }, 500 );    // 116-simptab-optimize-layout
                        }
                        break;
                    case "favorite":
                        var is_favorite = $($target.find("span")).hasClass("unfavoriteicon") ? true : false;
                        callBack( url, is_favorite );
                        break;
                    case "download":
                        // hack code( when 'unsplash.com' or 'nasa.gov' image download, new tab happen crash error. )
                        //if ( vo.cur.type != "unsplash.com" && vo.cur.type != "nasa.gov" ) {
                        event.currentTarget.href = files.DataURI() || vo.cur.hdurl;
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
        setPinState       : setPinState
    };
});
