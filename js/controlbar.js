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

    function setBackground( url ) {
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    function setBackgroundPosition() {
       var value = localStorage[ "simptab-background-position" ];
       vo.cur.type == "default" || !value || value == "center" ? $( "body" ).addClass( "bgcenter" ) : $( "body" ).removeClass( "bgcenter" );
    }

    function setFavorteState( is_show ) {
        is_show ? $( ".controlink[url='favorite']" ).parent().show() : $( ".controlink[url='favorite']" ).parent().hide();
    }

    function setFavorteIcon() {
        var newclass = vo.cur.favorite == -1 ? "unfavoriteicon" : "favoriteicon";
        $( ".controlink[url='favorite']" ).find("span").attr( "class", "icon " + newclass );
    }

    function setDislikeState( is_show ) {
        is_show ? $( ".controlink[url='dislike']" ).parent().show() : $( ".controlink[url='dislike']" ).parent().hide();
    }

    function setDislikeIcon() {
        var newclass = vo.isDislike( vo.cur.url ) ? "dislike" : "disliked";
        $( ".controlink[url='dislike']" ).find("span").attr( "class", "icon " + newclass );
        return newclass == "dislike" ? true : false;
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
                    case "dislike":
                        var $dislike   = $target.find( "span" ),
                            is_dislike = $dislike.hasClass( "dislike" );
                        is_dislike ? $dislike.removeClass( "dislike" ).addClass( "disliked" ) : $dislike.removeClass( "disliked" ).addClass( "dislike" );
                        callBack( url, is_dislike );
                        break;
                }
            });
        },

        AutoClick: function( idx ) {
            if ( idx < 3 ) {
                $( $(".chromelink")[idx] ).click();
            }
            else {
                var target    = $( $(".controlbar").find( "a" )[idx] )[0],
                    $favorite = $( ".controlink[url='favorite']" ),
                    $favhidden= $favorite.has(":hidden"),
                    $dislike  = $( ".controlink[url='dislike']" ),
                    $dishidden= $dislike.has(":hidden");
                // when favorite hidden, dislike not action; when dislike hidden, favroite not action;
                if ( (target !== $favorite[0] && target !== $dislike[0]) ||
                     (target === $favorite[0] && $favhidden && $favhidden.length === 0 ) ||
                     (target === $dislike[0]  && $dishidden && $dishidden.length === 0 )
                 ) {
                    target.click();
                }
            }
        },

        Set: function( is_default ) {

            // set default background
            if ( is_default ) {
                vo.cur = vo.Clone( vo.Create( vo.constructor.DEFAULT_BACKGROUND, vo.constructor.DEFAULT_BACKGROUND, "Wallpaper", "#", date.Now(), "Wallpaper", "default", {} ));
            }
            else {
                setCurBackgroundURI();
            }

            setInfoURL();
            setDownloadURL();
            setBackground( is_default ? vo.constructor.DEFAULT_BACKGROUND: vo.constructor.CURRENT_BACKGROUND );
            setBackgroundPosition();
            setDislikeState( (!is_default && vo.cur.favorite == -1 && setting.IsRandom()) );
            setFavorteState( !is_default && setDislikeIcon() );
            setFavorteIcon();
        },
        SetBgPosition     : setBackgroundPosition,
        SetFavorteIcon    : setFavorteIcon,
        SetFavorteState   : setFavorteState,
        SetDislikeState   : setDislikeState
    };
});
