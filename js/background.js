
define([ "jquery", "date", "i18n", "setting", "apis", "vo", "files", "controlbar", "error", "notify", "progress", "waves", "message", "history" ], function( $, date, i18n, setting, apis, vo, files, controlbar, SimpError, Notify, progress, Waves, message, history ) {

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
                if ( !vo.Verify.call( vo.cur )) {
                    console.error( "Current data structure error.", result );
                    //// set default background and call api. type 1
                    def.resolve(1);
                }
                else {
                    if ( localStorage[ "simptab-background-update" ] == "true" ) {
                        def.resolve(3);
                    } else if ( setting.Mode( "changestate" ) == "none" ) {
                        def.resolve(4);
                    } else if ( setting.Mode( "changestate" ) == "earth" ) {
                        message.Publish( message.TYPE.UPDATE_EARTH );
                        def.resolve(4);
                    } else if ( setting.Mode( "changestate" ) == "day" && !date.IsNewDay( date.Today() ) ) {
                        def.resolve(4);
                    } else if ( date.IsNewDay( date.Today() ) || ( !is_random && date.Today() != vo.cur.enddate ) ) {
                        //// set background refresh
                        localStorage["simptab-background-refresh"] = "true";
                        //// only call api. type 3
                        def.resolve(3);
                    } else if ( is_random && isPinTimeout() ) {
                        //// set current background and call api. type 2
                        def.resolve(2);
                    } else {
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
                history.DataURI( result );
                localStorage[ "simptab-background-update" ] == "true" && files.DataURI( result );
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) {
                        if ( typeof result != "undefined" && !$.isEmptyObject( result )) {
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
            if ( localStorage["simptab-background-refresh"] == "true" ) {

                // when local storage 'simptab-background-refresh' == "true", re-set 'simptab-background-state' is 'ready'
                progress.Set( "ready" );

                // seach current bing.com background is favorite?
                vo.new.favorite = files.FindFavBing( files.FavBingVO(), vo.new.enddate );

                // update vo.cur
                vo.cur = vo.Clone( vo.new );
                controlbar.Set( false );
            }

            // sync vo
            isPinTimeout() ? vo.Set( vo.new ) : writePinBackground();
            localStorage[ "simptab-background-update" ] == "true" && updateBackground();
            console.log( "======= New Background Obj is ", vo );
            localStorage[ "simptab-background-mode" ] == "time" && history.Add( vo.new );
        }
    }

    function failBackground( error ) {

        // re-set (hide) progress bar
        progress.Set( "remotefailed" );

        // re-set simptab-background-update
        localStorage[ "simptab-background-update" ] = "false";
        bgeffect( "delete" );

        // when bing.com( today ) remote failed, set vo.new == vo.cur and refresh current backgrond
        if ( error.data.apis_vo && error.data.apis_vo.origin == "today" && vo.cur && vo.cur.type != "default" ) {
            vo.new = vo.Clone( vo.cur );
            controlbar.Set( false );
        }

        try {
            throw error;
        }
        catch( error ) {
            new Notify().Render( 2, i18n.GetLang( "notify_refresh_failed" ));
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

    function isPinTimeout() {
        var limit  = localStorage[ "simptab-pin" ],
            pin    = vo.cur.pin,
            diff   = date.TimeDiff( pin ),
            result = pin == -1 || diff > limit ? true : false;
        return result;
    }

    function writePinBackground() {
        files.Add( vo.constructor.BACKGROUND, files.DataURI() )
            .progress( function( result ) { console.log( "Write process:", result ); })
            .fail(     function( result ) { console.log( "Write error: ", result );  })
            .done( function( result ) {
                console.log( "Write completed: ", result );
                vo.new = vo.Clone( vo.cur );
                vo.Set( vo.new );
                progress.Set( "pinnedsuccess" );
                console.log( "======= Current background dispin success.", vo )
            });
    }

    function updateBackground() {
        // update vo.cur from vo.new
        vo.cur = vo.Clone( vo.new );
        vo.Set( vo.cur );
        // update controlbar
        message.Publish( message.TYPE.UPDATE_CONTROLBAR, { url: 'filesystem:' + chrome.extension.getURL( "/" ) + 'temporary/background.jpg' + '?' + +new Date() });
        // remove effect
        bgeffect( "delete" );
        // re-set simptab-background-update
        localStorage[ "simptab-background-update" ] = "false";
    }

    function bgeffect( type ) {
        var url = 'filesystem:' + chrome.extension.getURL( "/" ) + 'temporary/background.jpg' + '?' + +new Date();
        if ( type == "add" ) {
            $( "body" ).append( '<div class="bgeffect" style="background-image: url(' + url +');"></div>' );
            setTimeout( function() {
                $( "body" ).find( ".bgeffect" ).css( 'filter', 'blur(50px)' );
            }, 1 );
        } else {
            $( ".bgeffect" ).css( 'background-image', 'url(' + url +')' );
            $( ".bgeffect" ).animate({'opacity': '0'}, 1000, function() {
                $( ".bgeffect" ).remove();
            });
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
            //$( "body" ).css({ "font-family" : lang.substr(0,2) });
        },

        Valid: function() {
            setTimeout( function() {
                if ( $("body").css( "background-image" ) == "none" ) {
                    controlbar.Set( true );
                }
            }, 5 * 1000 );
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
                        vo.cur.type != "upload" && vo.cur.pin == -1 && localStorage["simptab-background-mode"] == "time" && controlbar.SetDislikeState( false );

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
                            vo.cur.type != "upload" && vo.cur.pin == -1 && localStorage["simptab-background-mode"] == "time" && controlbar.SetDislikeState( true );

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
                            apis_vo   = { url : "", type : "GET", dataType : "localStorage", timeout : 2000, method : "background.Upload()", origin : "favorite", code : 10 };

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
            try {
                var dislikelist = JSON.parse( localStorage["simptab-dislike"] || "[]" ),
                    uid         = btoa( vo.cur.url );

                vo.cur.dislike  = type ? uid   : -1;
                localStorage[ "simptab-background-state" ] != "success" && vo.Set( vo.cur );

                type ? dislikelist.push( uid ) : dislikelist = dislikelist.filter( function( item ) { return item != uid; });

                controlbar.setDislikeIcon();
                controlbar.SetFavorteState( !type );
                controlbar.setPinState( !type );
                Waves.attach( '.icon', ['waves-circle'] );

                new Notify().Render( i18n.GetLang( "notify_dislike_" + ( type ? "add" : "del" ) ));
                localStorage["simptab-dislike"] = JSON.stringify( dislikelist );
                console.log( "=== Current dislike object data structure is ", dislikelist, vo.cur );
            }
            catch ( error ) {
                console.error( "background.Dislike(), Parse 'simptab-dislike' error.", error );
            }
        },

        Pin: function( is_pinned ) {
            console.log("Current background is pinned? ", is_pinned)
            if ( is_pinned ) {
                vo.cur.pin = -1;
                vo.new     = vo.Clone( vo.cur )
                vo.Set( vo.new );
                new Notify().Render( i18n.GetLang( "notify_pin_del" ));
                console.log( "======= Current background dispin success.", vo )
            }
            else {
                vo.cur.pin = new Date().getTime();
                localStorage[ "simptab-background-state" ] == "success" ? writePinBackground() : vo.Set( vo.cur );
                new Notify().Render( i18n.GetLang( "notify_pin_add" ).replace( "#1", localStorage["simptab-pin"] / 60 ) );
            }
            controlbar.setPinIcon();
            vo.cur.type != "upload" && vo.cur.favorite == -1 && controlbar.SetDislikeState( is_pinned );
            Waves.attach( '.icon', ['waves-circle'] );
        },

        Update: function( type, is_refresh ) {
            if ( is_refresh && vo.cur.type == "earth" ) {
                new Notify().Render( i18n.GetLang( "notify_eartch_mode" ) );
                return;
            }
            if ( type == "none" ) writePinBackground();
            if ( type == "time" ) {
                if ( localStorage[ "simptab-background-mode" ] == "earth" ) {
                    new Notify().Render( 2, i18n.GetLang( "notify_eartch_mode" ) );
                } else {
                    localStorage[ "simptab-background-update" ] = "true";
                    bgeffect( "add" );
                    this.Get( true );
                }
                $( "body" ).removeClass( "bgearth" );
            }
        },

        Earth: function( is_notify ) {
            localStorage["simptab-earth-notify"] != "false" &&
                    new Notify().Render({ content: i18n.GetLang( "notify_earth_tips" ), action: i18n.GetLang( "notify_zen_mode_tips_confirm" ), callback:function (){
                        localStorage["simptab-earth-notify"] = false;
                    }});
            if ( vo.cur.type == "earth" && date.Now() - vo.cur.enddate < 10000 ) {
                is_notify && new Notify().Render( i18n.GetLang( "notify_eartch_update_failed" ) );
                return;
            }
            var notify   = new Notify().Render({ content: i18n.GetLang( "notify_eartch_loading" ), state: "loading" }),
                getEarth = function () {
                    apis.Earth( function ( base64 ) {
                        notify.complete();
                        $( "body" ).css( "background-image", "url(" + base64 + ")" ).addClass( "bgearth" );
                        files.DataURI( base64 );
                        files
                            .Add( vo.constructor.BACKGROUND, files.DataURI() )
                            .progress( function( result ) { console.log( "Write process:", result ); })
                            .fail(     function( result ) { console.log( "Write error: ", result );  })
                            .done( function( result ) {
                                console.log( "Write completed: ", result );
                                vo.Set( vo.new );
                                localStorage[ "simptab-background-position" ] == "mask" && new Notify().Render( i18n.GetLang( "notify_carousel" ) );
                                console.log( "======= Current background success.", vo )
                                if ( is_notify ) {
                                    new Notify().Render( i18n.GetLang( "notify_eartch_update_success" ) );
                                    setTimeout( function () {
                                        window.location.reload();
                                    }, 2000 );
                                }
                        });
                    });
            };
            getEarth();
        },

    };
});
