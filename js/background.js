
define([ "jquery", "date", "i18n", "apis", "vo", "files", "controlbar", "error", "notify", "progress" ], function( $, date, i18n, apis, vo, files, controlbar, SimpError, Notify, progress ) {

    "use strict";

    function getCurrentBackground( is_random ) {

        var def = $.Deferred();

        // set background refresh
        localStorage["simptab-background-refresh"] = "false";

        // get simptab-background
        vo.Get( function( result ) {
            if ( result && !$.isEmptyObject( result )) {

                // save current background object
                vo.cur = result["simptab-background"];
                console.log( "Current background data structure is ", vo.cur );

                // check old data structure
                if ( !vo.Verify() ) {
                    console.error( "Current data structure error.", result );
                    //// set default background and call api. type 1
                    def.resolve(1);
                }
                else {
                    if ( date.IsNewDay( date.Today() ) || ( !is_random && date.Today() != vo.cur.enddate ) ) {
                        //// set call special count, max count is '11111', length is 5
                        localStorage["simptab-special-day-count"] = 1;
                        //// set background refresh
                        localStorage["simptab-background-refresh"] = "true";
                        //// only call api. type 3
                        def.resolve(3);
                    }
                    else if ( is_random ) {
                        //// set current background and call api. type 2
                        def.resolve(2);
                    }
                    else {
                        //// set current background and not-call api. type 4
                        def.resolve(4);
                    }
                }
            }
            else {
                //// set default background and call api. type 1
                def.resolve(1);
            }
        });

        return def.promise();
    }

    function setCurrentBackground( state ) {
        var def = $.Deferred();

        console.log( "Current state is " + state );

        switch ( state ) {
            case 1:
                controlbar.Set( true );
                //call api
                break;
            case 2:
                controlbar.Set( false );
                //call api
                break;
            case 3:
                //call api
                break;
            case 4:
                controlbar.Set( false );
                break;
        }

        def.resolve( state != 4 ? true : false );

        return def.promise();
    }

    function getRemoteBackground( is_remote ) {
        var def = $.Deferred();

        if ( is_remote ) {

            progress.Set( "remote" );

            apis.Init()
                .fail( failBackground )
                .done( function( result ) {
                    console.log( "=== Current background image url: " + result.hdurl )
                    console.log( "=== Current background vo.new   : ", vo.new        )
                    // when result.hdurl == vo.constructor.DEFAULT_BACKGROUND, version.hdurl verify failed, re-set vo.new is vo.cur
                    result.hdurl != vo.constructor.DEFAULT_BACKGROUND ? def.resolve( true, result.hdurl ) : vo.new = vo.Clone( vo.cur );
                });
        }
        else {
            def.resolve( false, null );
        }

        return def.promise();
    }

    function setRemoteBackground( is_save, url ) {
        var def = $.Deferred();

        if ( is_save ) {

            // change background-state
            progress.Set( "loading" );

            files.GetDataURI( url ).then( function( result ) {
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) {
                        if ( result != undefined && !$.isEmptyObject( result )) {
                            switch ( result.type ) {
                                case "writestart":
                                    console.log( "Write start: ", result );
                                    progress.Set( "writestart" );
                                    break;
                                case "progress":
                                    console.log( "Write progress: ", result, ( result.loaded / result.total ) * 10 );
                                    progress.Set( "pending", ( result.loaded / result.total ) * 10 );
                                    break;
                            }
                        }
                    })
                    .done( function( result ) {
                        console.log( "Write completed: ", result );
                        progress.Set( "success" );
                        def.resolve( is_save );
                    })
                    .fail( function( result ) {
                        console.log( "Write error: ", result );
                        progress.Set( "writefailed" );
                        def.reject( new SimpError( "background.setRemoteBackground()::files.Add()", "Background write to local error.", result ));
                    });
            }, function( error ) {
                def.reject( new SimpError( "background.setRemoteBackground()::files.GetDataURI()", "Load background error.", error ));
            });
        }
        else {
            def.resolve( is_save );
        }

        return def.promise();
    }

    function successBackground( is_save ) {

        console.log( "===== New background get success. =====" );

        if ( is_save ) {
            // when 'change bing.com background everyday', re-set controlbar.Set
            if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {

                // when local storage 'simptab-background-refresh' == "true", re-set 'simptab-background-state' is 'ready'
                progress.Set( "ready" );

                // seach current bing.com background is favorite?
                vo.new.favorite = files.FindFavBing( files.FavBingVO(), vo.new.enddate );

                // update vo.cur
                vo.cur = vo.Clone( vo.new );
                controlbar.Set( false );
            }

            // sync vo
            vo.Set( vo.new );
            console.log( "======= New Background Obj is ", vo );
        }
    }

    function failBackground( error ) {

        // re-set (hide) progress bar
        progress.Set( "remotefailed" );

        // when bing.com( today ) remote failed, set vo.new == vo.cur and refresh current backgrond
        if ( error.data.apis_vo && error.data.apis_vo.origin == "today" && vo.cur && vo.cur.type != "default" ) {
            vo.new = vo.Clone( vo.cur );
            controlbar.Set( false );
        }

        try {
            throw error;
        }
        catch( error ) {
            console.group( "===== SimpTab failed ====="             );
            console.error( "error             = ", error             );
            console.error( "error.stack       = ", error.stack       );
            console.error( "error.name        = ", error.name        );
            console.error( "error.method_name = ", error.method_name );
            console.error( "error.message     = ", error.message     );
            console.error( "error.data        = ", error.data        );
            console.groupEnd();
        }
    }

    return {
        Get: function( is_random ) {

            progress.Set( "ready" );

            getCurrentBackground( is_random )
                .then( setCurrentBackground )
                .then( getRemoteBackground  )
                .then( setRemoteBackground, failBackground )
                .then( successBackground,   failBackground );
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

            console.log("is_favorite = ", is_favorite);

            if ( is_favorite ) {

                var file_name = date.Now();
                files.Add( file_name, files.DataURI() )
                    .done( function() {

                        // update favorite
                        vo.cur.favorite = file_name;
                        // when vo.type is 'upload', need update hdurl and url
                        if ( vo.cur.type == "upload" ) {
                            var new_url  = vo.cur.hdurl;
                            new_url      = new_url.substring( new_url.lastIndexOf("/") + 1, new_url.lastIndexOf(".jpg") );
                            vo.cur.hdurl = vo.cur.hdurl.replace( new_url, file_name );
                            vo.cur.url   = vo.cur.hdurl;
                        }

                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            vo.Set( vo.cur );
                        }

                        // update local storge 'simptab-favorites'
                        files.AddFavorite( files.FavoriteVO(), file_name, vo.cur );

                        // update local storge 'simptab-bing-fav'
                        vo.cur.type == "today" && files.AddFavBing( files.FavBingVO(), vo.cur.enddate + ":" + vo.cur.favorite );

                        // set favorite / dislike icon state
                        controlbar.SetFavorteIcon();
                        controlbar.SetDislikeState( false );

                        new Notify().Render( i18n.GetLang( "notify_favorite_add" ) );

                        console.log( "=== Add favorite background success.", vo.cur );
                    })
                    .fail( function( error ) {
                        console.error( "Add favorite background error.", error );
                    });
            }
            else {
                files.Delete( vo.cur.favorite,
                    function( file_name ) {

                        console.log( "Delete favorite is ", file_name );

                        try {
                            // update local storge 'simptab-favorites'
                            files.DeleteFavorite( files.FavoriteVO(), file_name );

                            // update local storge 'simptab-bing-fav'
                            vo.cur.type == "today" && files.DeleteFavBing( files.FavBingVO(), vo.cur.favorite );

                            // update vo.cur
                            vo.cur.favorite = -1;

                            // when simptab-background-state != success, need refresh vo
                            if ( localStorage[ "simptab-background-state" ] != "success" ) {
                                vo.Set( vo.cur );
                            }

                            // update favorite / dislike icon
                            controlbar.SetFavorteIcon();
                            controlbar.SetDislikeState( true );

                            new Notify().Render( i18n.GetLang( "notify_favorite_del" ) );

                            console.log( "=== Delete favorite background success.", vo.cur );
                        }
                        catch ( error ) {
                            console.log( "Delete favorite background error.", error );
                        }
                    },
                    function( error ) {
                        console.error( "Delete favorite background error.", error );
                    }
                );
            }

        },

        Upload: function( result ) {
            var filelist = files.VerifyUploadFile( result ),
                arr      = [],
                adapter  = function( i, name ) {
                    files.GetDataURI( filelist[i], arr, i, len ).done( function( datauri ) {

                        var file_name = Math.round(+new Date()),
                            upload_vo = {new:{}},
                            apis_vo   = { url : "", type : "GET", dataType : "localStorge", timeout : 2000, method : "background.Upload()", origin : "favorite", code : 10 };

                        files.Add( file_name, datauri )
                        .done( function( result, hdurl ) {

                            // create upload vo
                            apis_vo.url = hdurl;
                            vo.Create.apply( upload_vo, [ hdurl, hdurl, name, "#", date.Now(), name, "upload", apis_vo, file_name ]);

                            // update local storge 'simptab-favorites'
                            files.AddFavorite( files.FavoriteVO(), file_name, upload_vo.new );

                            console.log("=== Upload favorite background success.", upload_vo.new );
                        })
                        .fail( function( error ) {
                            new Notify().Render( i18n.GetLang( "notify_upload_fail" ) );
                            console.error( "Upload favorite background error.", error );
                        })
                        .always( function() {
                            if ( i === filelist.length - 1 ) {
                                new Notify().Render( i18n.GetLang( "notify_upload_complete" ) );
                            }
                        });
                    }).fail( function( error ) {
                        console.error("Upload favorite background error.", error );
                    });
            };
            for( var i = 0, len = filelist.length; i < len; i++ ) {
                adapter.bind( null, i, filelist[i].name.replace( /\.(jpg|jpge|png|gif|bmp)$/ig, "" ) )();
            }
        },
        Dislike: function( type ) {
            var dislikelist = JSON.parse( localStorage["simptab-dislike"] || "[]" ),
                uid         = btoa( vo.cur.url );
            try {
                type ? dislikelist.push( uid ) : dislikelist = dislikelist.filter( function( item ) { return item != uid; });
                controlbar.SetFavorteState( !type );
                new Notify().Render( i18n.GetLang( "notify_dislike_" + ( type ? "add" : "del" ) ));
                console.log( "=== Current dislike object data structure is ", dislikelist, vo.cur );
                localStorage["simptab-dislike"] = JSON.stringify( dislikelist );
            }
            catch ( error ) {
                console.error( "Parse 'simptab-dislike' error.", error );
            }
        }
    };
});
