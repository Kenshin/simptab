
define([ "jquery", "date", "i18n", "apis", "vo", "files" ], function( $, date, i18n, apis, vo, files ) {

    var defaultBackground = "../assets/images/background.jpg",
        background_obj    = {},
        background_vo     = {};

    getBackgroundByAPI = function () {

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

                // transfor to datauri
                // save background to chrome
                image2URI( result.hdurl );

                // set chrome local storage
                // no use cache mode
                //chrome.storage.local.set({ "simptab-background" : { "background" : dataURI, "url" : url, "date" : enddate, "name" : name } });
                // use local mode
                //chrome.storage.local.set({ "simptab-background" : { "url" : hdurl, "date" : enddate, "name" : name, "info" : info } });

                // set cache background object

                // when version is `1`( undefined ) data structure
                // background_obj = { "simptab-background" : { "url" : result.hdurl, "date" : result.enddate, "name" : result.name, "info" : result.info }};
                // background_obj = { "url" : result.hdurl, "date" : result.enddate, "name" : result.name, "info" : result.info };

                // when version is `2` data structure
                // background_obj = { "simptab-background" : result };
                background_obj = result;
            });
    }

    setDefaultBackground = function() {
        // set background image
        setBackground( defaultBackground );
        // set download url
        setDownloadURL( defaultBackground, null, "Wallpaper" );
        // set info url
        setInfoURL( "#", null );
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

    getBackgroundURL = function() {
        return $("body").css("background-image").replace( "url(", "" ).replace( ")", "" );
    }

    setBackground = function( url ) {
        if ( isDefaultbackground() ) {
            url = defaultBackground;
        }
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    isDefaultbackground = function() {
        console.log("simptab-background-state = " + localStorage["simptab-background-state"]);
        return localStorage["simptab-background-state"] != undefined && localStorage["simptab-background-state"] != "success"
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
      vo.Set( background_obj );
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

                // add test code
                window.files = files;
                window.date  = date;
                // file object init
                files.Init( getBackgroundURL() );
                background_vo = data;

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

        Favorite: function() {
            var file_name = date.Now();
            files.Add( file_name, files.DataURI() )
                .done( function() {
                    background_vo.hdurl = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/favorite/" + file_name + ".jpg";
                    background_vo.url   = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/favorite/" + file_name + ".jpg";
                    var obj = { "file_name" : file_name, "result" : JSON.stringify( background_vo ) };
                    var arr = [];
                    if ( localStorage[ "simptab-favorites" ] != undefined ) {
                        arr = JSON.parse( localStorage[ "simptab-favorites" ]);
                    }
                    arr.push( JSON.stringify( obj ));
                    localStorage[ "simptab-favorites" ] = JSON.stringify( arr );
                })
                .fail( function( error ) {
                    console.error( "Favorite backgroud error is ", error )
                });
        }
    }
});
