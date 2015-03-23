
define([ "jquery", "date", "i18n", "apis", "vo", "files" ], function( $, date, i18n, apis, vo, files ) {

    var defaultBackground = "../assets/images/background.jpg";
    var new_background    = {};
    var cur_background    = {};

    getBackgroundByAPI = function () {

        // state includ: init loading staring pending success failed
        localStorage["simptab-background-state"] = "init";

        apis.Init()
            .fail( function( jqXHR,  textStatus, errorThrown ) {
                if ( jqXHR != null ) {
                    console.error( "jqXHR            = ", jqXHR)
                    console.error( "jqXHR.status     = ", jqXHR.status )
                    console.error( "jqXHR.statusText = ", jqXHR.statusText )
                }
                console.error( "textStatus       = ", textStatus )
                console.error( "errorThrown      = ", errorThrown  )

                if ( $("body").css( "background-image" ) == "none" ) {
                    setDefaultBackground();
                }
            })
            .done( function( result ) {
                if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {
                    // set background image
                    setBackground( result.hdurl );
                    // set download url
                    setDownloadURL( result.hdurl, result.name, result.shortname );
                    // set info url
                    setInfoURL( result.info, result.name );
                }

                // set chrome local storage
                // no use cache mode
                //chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });
                // use local mode
                //chrome.storage.local.set({ "simptab-background" : { "url" : hdurl, "date" : enddate, "name" : name, "info" : info } });

                // set cache background object

                // when version is `1`( undefined ) data structure
                // new_background = { "simptab-background" : { "url" : result.hdurl, "date" : result.enddate, "name" : result.name, "info" : result.info }};
                // new_background = { "url" : result.hdurl, "date" : result.enddate, "name" : result.name, "info" : result.info };

                // when version is `2` data structure
                // new_background = { "simptab-background" : result };
                new_background = result;

                localStorage["simptab-background-state"] = "loading";

                // transfor to datauri
                // save background to chrome
                image2URI( result.hdurl );
            });
    }

    setDefaultBackground = function() {
        // set background image
        setBackground( defaultBackground );
        // set download url
        setDownloadURL( defaultBackground, null, "Wallpaper" );
        // set info url
        setInfoURL( "#", null );
        // hide favorite icon
        setFavorteState( false );
    }

    setDownloadURL = function( url, name, shortname ) {
        if ( isDefaultbackground() ) {
            url  = defaultBackground;
            name = null;
            shortname = "Wallpaper";
        }

        if ( shortname == "#" ) {
            shortname = name;
        }

        $( ".controlink[url='download']" ).attr({
            "title"    : name,
            "href"     : url,
            "download" : "SimpTab-" + date.Now() + "-" + shortname + ".jpg"
        });

        if ( url == null ) {
            $( ".controlink[url='download']" ).removAttr( "title" );
        }
    }

    setInfoURL = function( url, name ) {
        if ( isDefaultbackground() ) {
            url  = "#";
            name = null;
        }
        if ( i18n.GetLocale() != "zh_CN" ) {
            url = url.replace( "/knows/", "/" );
        }
        $( ".controlink[url='info']" ).attr({
            "title"    : name,
            "href"     : url
        });
        if ( url == null ) {
            $( ".controlink[url='info']" ).removAttr( "title" );
        }
    }

    setFavorte = function( is_favorite ) {
        var newclass = is_favorite ? "favoriteicon" : "unfavoriteicon";
        $( ".controlink[url='favorite']" ).find("span").attr( "class", "icon " + newclass );
    }

    setFavorteState = function( is_show ) {
        is_show ? $( ".controlink[url='favorite']" ).show() : $( ".controlink[url='favorite']" ).hide();
    }

    setBackground = function( url ) {
        if ( isDefaultbackground() ) {
            url = defaultBackground;
            setFavorteState( false );
        }
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    getBackgroundURL = function() {
        return $("body").css("background-image").replace( "url(", "" ).replace( ")", "" );
    }

    isDefaultbackground = function() {

        var state = localStorage["simptab-background-state"];
        console.log("simptab-background-state = " + state );

        // when new background is writting or failed, show defautl image
        if ( state != undefined && ( state == "writestart" || state == "pending" || state == "failed" )) {
            return true;
        }
        else {
            return false;
        }
    }

    image2URI = function ( url ) {
        files.GetDataURI( url ).then( function( result ) {
            saveImg2Local( result );
        });
    }

    saveImg2Local = function ( dataURI ) {

        files.Add( "background.jpg", dataURI )
            .progress( function( result ) {
                if ( result != undefined && !$.isEmptyObject( result )) {
                    switch ( result.type ) {
                        case "writestart":
                            console.log( "Write start: ", result );
                            localStorage["simptab-background-state"] = "staring";
                            break;
                        case "progress":
                            console.log( "Write process: ", result );
                            localStorage["simptab-background-state"] = "pending";
                            break;
                    }
                }
            })
            .done( function( result ) {
                console.log( "Write completed: ", result );
                localStorage["simptab-background-state"] = "success";
                saveBackgroundStorge();
            })
            .fail( function( result ) {
                console.log( "Write error: ", result );
                localStorage["simptab-background-state"] = "failed";
            })
    }

    saveBackgroundStorge = function() {
      vo.Set( new_background );
    }

    return {
        Get: function ( is_random ) {

            //var random = 0,
            //var   url    = defaultBackground;

            // set background refresh
            localStorage["simptab-background-refresh"] = "false";

            // get simptab-background
            vo.Get( function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    // reset-background
                    var today  = date.Today(),
                        data   = result["simptab-background"];

                    // no use cache
                    //url    = data.background;

                    // check old data structure
                    // when result.version is undefined, it's old version, so call getBackgroundByAPI() refresh new data structure.
                    if ( !vo.Verify( data.version ) ) {
                        console.error("Current data structure error.", result );
                        setDefaultBackground();
                        getBackgroundByAPI();
                        files.Init( getBackgroundURL() );
                        return;
                    }

                    // random = true
                    if ( is_random ) {

                        // set background image
                        setBackground( "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg" );
                        // set download url
                        setDownloadURL( data.hdurl, data.name, data.shortname );
                        // set info url
                        setInfoURL( data.info, data.name );

                        // get new background
                        getBackgroundByAPI();
                    }
                    // random = false
                    else {

                        console.log("today = " + today)
                        console.log("data  = " + data.enddate)

                        if ( today != data.enddate ) {
                            // set background refresh
                            localStorage["simptab-background-refresh"] = "true";
                            // get background
                            getBackgroundByAPI();
                        }
                        else {
                            // set background image
                            setBackground( "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg" );
                            // set download url
                            setDownloadURL( data.hdurl, data.name, data.shortname );
                            // set info url
                            setInfoURL( data.info, data.name );
                        }
                    }

                }
                else {
                    // set default background
                    setDefaultBackground();
                    // get background
                    getBackgroundByAPI();
                }

                // save current background object
                cur_background = data;

                // files object init
                files.Init( getBackgroundURL() );

                // set favorite
                // when data is undefined explain first open new tab
                if ( data != undefined && data.favorite != undefined ) {
                    setFavorte( data.favorite == -1 ? false : true );
                }

            });
        },

        SetLang: function( lang ) {

            // check locales
            if ( lang != "en" && lang != "zh_CN" && lang != "zh_TW" ) {
                lang = "en";
            }

            // set font-family
            $( "body" ).css({ "font-family" : lang });
        },

        Valid: function() {
            setTimeout( function() {
                if ( $("body").css( "background-image" ) == "none" ) {
                    setDefaultBackground();
                }
            }, 8 * 1000 );
        },

        Favorite: function( is_favorite ) {

            console.log("is_favorite = ", is_favorite)

            if ( is_favorite ) {
                var file_name = date.Now();
                files.Add( file_name, files.DataURI() )
                    .done( function() {

                        // update hdurl url favorite
                        cur_background.favorite = file_name;

                        // when current background is 'delete favorite', need refresh vo
                        if ( cur_background.type == "delete favorite" ) {
                            cur_background.type = "favorite";
                            vo.Set( cur_background );
                        }
                        else {
                            cur_background.type = "favorite";
                        }

                        // update local storge 'simptab-favorites'
                        var obj = { "file_name" : file_name, "result" : JSON.stringify( cur_background ) };
                        var arr = [];
                        if ( localStorage[ "simptab-favorites" ] != undefined ) {
                            arr = JSON.parse( localStorage[ "simptab-favorites" ]);
                        }

                        arr.push( JSON.stringify( obj ));
                        localStorage[ "simptab-favorites" ] = JSON.stringify( arr );

                        // set favorite icon state
                        setFavorte( true );

                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            vo.Set( cur_background );
                        }

                        console.log( "Favorite background add success." );
                    })
                    .fail( function( error ) {
                        console.error( "Favorite backgroud error is ", error )
                    });
            }
            else {
                files.Delete( cur_background.favorite
                    , function( file_name ) {

                        console.log( "Delete favorite is ", file_name )

                        // update local storge
                        var arr   = JSON.parse(localStorage[ "simptab-favorites" ]);
                        var obj   = {};
                        var index = -1;
                        $.each( arr, function( idx ) {
                            obj = JSON.parse( arr[idx] );
                            if ( obj.file_name == file_name ) {
                                index  = idx;
                                return;
                            }
                        })
                        if ( index != -1 ) {
                            arr.splice( index, 1 );
                        }
                        localStorage[ "simptab-favorites" ] = JSON.stringify( arr );

                        // update favorite icon
                        setFavorte( false );

                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            cur_background.favorite = -1;
                            cur_background.type     = "delete favorite";
                            vo.Set( cur_background );
                        }

                    }
                    , function( error ) {
                        console.error( "Delete favorite background error.", error );
                });
            }

        }
    }
});
