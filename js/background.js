
define([ "jquery", "date", "i18n", "apis", "vo", "files", "controlbar" ], function( $, date, i18n, apis, vo, files, controlbar ) {

    // var defaultBackground = "../assets/images/background.jpg";

    getBackgroundByAPI = function () {

        // state includ: init loading staring pending success failed unsuccess(end)
        localStorage["simptab-background-state"] = "init";

        apis.Init()
            .fail( function( jqXHR,  textStatus, errorThrown ) {

                if ( jqXHR != null ) {
                    console.error( "jqXHR            = ", jqXHR            )
                    console.error( "jqXHR.status     = ", jqXHR.status     )
                    console.error( "jqXHR.statusText = ", jqXHR.statusText )
                }
                console.error( "textStatus       = ", textStatus  )
                console.error( "errorThrown      = ", errorThrown )

                localStorage["simptab-background-state"] = "unsuccess";

                if ( $("body").css( "background-image" ) == "none" ) {
                    controlbar.Set( true );
                }

            })
            .done( function( result ) {

                // change background-state
                localStorage["simptab-background-state"] = "loading";

                // transfor to datauri
                // save background to chrome
                image2URI( result.hdurl );

            });
    }

    getBackgroundURL = function() {
        return $("body").css("background-image").replace( "url(", "" ).replace( ")", "" );
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

        // update vo
        vo.Set( vo.new );

        // when 'change bing.com background everyday', re-set controlbar.Set
        if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {
            vo.cur = vo.new;
            controlbar.Set( false );
            files.Init( getBackgroundURL() );
        }
    }

    return {
        Get: function ( is_random ) {

            // set background refresh
            localStorage["simptab-background-refresh"] = "false";

            // get simptab-background
            vo.Get( function( result ) {
                if ( result && !$.isEmptyObject( result )) {
                    // reset-background
                    var today  = date.Today(),
                        data   = result["simptab-background"];

                    // save current background object
                    vo.cur = data;

                    console.log( "Current background data structure is ", vo.cur )

                    // check old data structure
                    // when result.version is undefined, it's old version, so call getBackgroundByAPI() refresh new data structure.
                    if ( !vo.Verify( data.version ) ) {
                        console.error("Current data structure error.", result );
                        controlbar.Set( true );
                        getBackgroundByAPI();
                        files.Init( getBackgroundURL() );
                        return;
                    }

                    // random = true
                    if ( is_random ) {

                        // set current background
                        controlbar.Set( false );

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
                            // set current background
                            controlbar.Set( false );
                        }
                    }

                }
                else {
                    // set default background
                    controlbar.Set( true );

                    // get background
                    getBackgroundByAPI();
                }

                // files object init
                files.Init( getBackgroundURL() );

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
                    controlbar.Set( true );
                }
            }, 8 * 1000 );
        },

        Favorite: function( is_favorite ) {

            console.log("is_favorite = ", is_favorite)

            if ( is_favorite ) {
                var file_name = date.Now();
                files.Add( file_name, files.DataURI() )
                    .done( function() {

                        // update favorite
                        vo.cur.favorite = file_name;

                        // when current background is 'delete favorite', need re-set 'favorite'
                        if ( vo.cur.type == "delete favorite" ) {
                            vo.cur.type = "favorite";
                        }
                        else {
                            vo.cur.type = "favorite";
                        }

                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            vo.Set( vo.cur );
                        }

                        // update local storge 'simptab-favorites'
                        var obj = { "file_name" : file_name, "result" : JSON.stringify( vo.cur ) };
                        var arr = [];
                        if ( localStorage[ "simptab-favorites" ] != undefined ) {
                            arr = JSON.parse( localStorage[ "simptab-favorites" ]);
                        }

                        arr.push( JSON.stringify( obj ));
                        localStorage[ "simptab-favorites" ] = JSON.stringify( arr );

                        // set favorite icon state
                        controlbar.SetFavorteIcon();

                        console.log( "Favorite background add success." );
                    })
                    .fail( function( error ) {
                        console.error( "Favorite backgroud error is ", error )
                    });
            }
            else {
                files.Delete( vo.cur.favorite
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

                        vo.cur.favorite = -1;
                        vo.cur.type     = "delete favorite";
                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            vo.Set( vo.cur );
                        }

                        // update favorite icon
                        controlbar.SetFavorteIcon();

                        console.log( "Favorite background del success." );

                    }
                    , function( error ) {
                        console.error( "Delete favorite background error.", error );
                });
            }

        }
    }
});
