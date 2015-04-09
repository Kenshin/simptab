
define([ "jquery", "date", "i18n", "apis", "vo", "files", "controlbar" ], function( $, date, i18n, apis, vo, files, controlbar ) {

    getCurrentBackground = function( is_random ) {

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
                    if ( is_random ) {
                        //// set current background and call api. type 2
                        def.resolve(2);
                    }
                    else {
                        if ( date.Today() != vo.cur.enddate ) {
                            //// set background refresh
                            localStorage["simptab-background-refresh"] = "true";
                            //// only call api. type 3
                            def.resolve(3);
                        }
                        else {
                            //// set current background and not-call api. type 4
                            def.resolve(4);
                        }
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

    setCurrentBackground = function( state ) {
        var def = $.Deferred();

        console.log( "Current state is " + state )

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

    getRemoteBackground = function( is_remote ) {
        var def = $.Deferred();

        if ( is_remote ) {

            localStorage["simptab-background-state"] = "remote";

            apis.Init()
                .fail( failBackground )
                .done( function( result ) {
                    def.resolve( true, result.hdurl );
                });
        }
        else {
            def.resolve( false, null );
        }

        return def.promise();
    }

    setRemoteBackground = function( is_save, url ) {
        var def = $.Deferred();

        if ( is_save ) {

            // change background-state
            localStorage["simptab-background-state"] = "loading";

            files.GetDataURI( url ).then( function( result ) {
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) {
                        if ( result != undefined && !$.isEmptyObject( result )) {
                            switch ( result.type ) {
                                case "writestart":
                                    console.log( "Write start: ", result );
                                    localStorage["simptab-background-state"] = "writestart";
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
                        def.resolve( is_save );
                    })
                    .fail( function( result ) {
                        console.log( "Write error: ", result );
                        localStorage["simptab-background-state"] = "writefailed";
                        def.reject( null, "Favorite write to local error.", result );
                    })
            }, function( error ) {
                def.reject( null, "Load background error.", error );
            });
        }
        else {
            def.resolve( is_save );
        }

        return def.promise();
    }

    successBackground = function( is_save ) {

        console.log( "===== New background get success. =====" );

        if ( is_save ) {
            // when 'change bing.com background everyday', re-set controlbar.Set
            if ( localStorage["simptab-background-refresh"] != undefined && localStorage["simptab-background-refresh"] == "true" ) {

                // when local storage 'simptab-background-refresh' == "true", re-set 'simptab-background-state' is 'ready'
                localStorage["simptab-background-state"] = "ready";

                // seach current bing.com background is favorite?
                var bing_fav = localStorage[ "simptab-bing-fav" ] || "[]";
                var bing_arr = JSON.parse( bing_fav );
                var val      = {}
                for( idx in bing_arr ) {
                    val = bing_arr[idx];
                    if ( val.split(":")[0] == vo.new.enddate ) {
                        vo.new.favorite = val.split(":")[1];
                        break;
                    }
                }

                // update vo.cur
                vo.cur = vo.Clone( vo.new );
                controlbar.Set( false );
            }

            // sync vo
            vo.Set( vo.new );
            console.log( "======= New Background Obj is ", vo );
        }
    }

    failBackground = function( jqXHR, textStatus, errorThrown ) {
        console.error( "===== New background get failed. =====" )

        if ( jqXHR != null ) {

            localStorage["simptab-background-state"] = "remotefailed";

            console.error( "jqXHR            = ", jqXHR            )
            console.error( "jqXHR.status     = ", jqXHR.status     )
            console.error( "jqXHR.statusText = ", jqXHR.statusText )
        }
        console.error( "textStatus       = ", textStatus  )
        console.error( "errorThrown      = ", errorThrown )
    }

    return {
        Get: function ( is_random ) {

            // state includ: ready remote(call api) loading(image) writestart(write start) pending(writting) success(write complete, end) writefailed(write error, end) remotefailed(remote failed, end)
            localStorage["simptab-background-state"] = "ready";

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

            console.log("is_favorite = ", is_favorite)

            if ( is_favorite ) {

                var file_name = date.Now();
                files.Add( file_name, files.DataURI() )
                    .done( function() {

                        // update favorite
                        vo.cur.favorite = file_name;
                        // when vo.type is 'upload', need update hdurl and url
                        if ( vo.cur.type == "upload" ) {
                            var new_url_arr = vo.cur.hdurl.split("/");
                            new_url_arr.pop();
                            new_url_arr.push( file_name + ".jpg" );
                            vo.cur.hdurl = new_url_arr.join("/");
                            vo.cur.url   = vo.cur.hdurl;
                        }

                        // when simptab-background-state != success, need refresh vo
                        if ( localStorage[ "simptab-background-state" ] != "success" ) {
                            vo.Set( vo.cur );
                        }

                        // update local storge 'simptab-favorites'
                        files.AddFavorite( files.FavoriteVO(), file_name, vo.cur );
                        /*
                        var obj = { "file_name" : file_name, "result" : JSON.stringify( vo.cur ) },
                            arr = JSON.parse( localStorage["simptab-favorites"] || "[]" );
                        arr.push( JSON.stringify( obj ));
                        localStorage[ "simptab-favorites" ] = JSON.stringify( arr );
                        */

                        // update local storge 'simptab-bing-fav'
                        if ( vo.cur.enddate == date.Today() ) {
                            var bing_fav = localStorage[ "simptab-bing-fav" ] || "[]";
                            var bing_arr = JSON.parse( bing_fav );
                            bing_arr.push( vo.cur.enddate + ":" + vo.cur.favorite );
                            localStorage[ "simptab-bing-fav" ] = JSON.stringify( bing_arr );
                        }

                        // set favorite icon state
                        controlbar.SetFavorteIcon();

                        console.log( "Add favorite background success." );
                    })
                    .fail( function( error ) {
                        console.error( "Add favorite background error.", error )
                    });
            }
            else {
                files.Delete( vo.cur.favorite
                    , function( file_name ) {

                        console.log( "Delete favorite is ", file_name )

                        try {
                            // update local storge 'simptab-favorites'
                            files.DeleteFavorite( files.FavoriteVO(), file_name );
                            /*
                            var arr   = JSON.parse( localStorage[ "simptab-favorites" ] || "[]" ),
                                obj   = {};
                            for( idx in arr ) {
                                obj = JSON.parse( arr[idx] );
                                if ( obj.file_name == file_name ) {
                                    arr.splice( idx, 1 );
                                    localStorage[ "simptab-favorites" ] = JSON.stringify( arr );
                                    break;
                                }
                            }
                            */

                            // update local storge 'simptab-bing-fav'
                            var bing_arr = JSON.parse( localStorage[ "simptab-bing-fav" ] || "[]" ),
                                val      = {};
                            for( idx in bing_arr ) {
                                val = bing_arr[idx];
                                if ( val.split(":")[1] == vo.cur.favorite ) {
                                    bing_arr.splice( idx, 1 );
                                    localStorage[ "simptab-bing-fav" ] = JSON.stringify( bing_arr );
                                    break;
                                }
                            }

                            // update vo.cur
                            vo.cur.favorite = -1;

                            // when simptab-background-state != success, need refresh vo
                            if ( localStorage[ "simptab-background-state" ] != "success" ) {
                                vo.Set( vo.cur );
                            }

                            // update favorite icon
                            controlbar.SetFavorteIcon();

                            console.log( "Delete favorite background success." );
                        }
                        catch ( error ) {
                            console.log( "Delete favorite background error.", error )
                        }
                    }
                    , function( error ) {
                        console.error( "Delete favorite background error.", error );
                });
            }

        },

        Upload: function( result ) {
            var arr = [],
                len = result.length;
            for( var i = 0; i < len; i++ ) {
                (function( i, name ) {
                    files.ReadAsDataURL( result[i], arr, i, len ).done( function( datauri ) {

                        var file_name = Math.round(+new Date()),
                            upload_vo = {new:{}};

                        files.Add( file_name, datauri )
                        .done( function( result, hdurl ) {

                            // create upload vo
                            vo.Create.apply( upload_vo, [ hdurl, hdurl, name, "#", date.Now(), name, "upload", file_name ]);

                            // update local storge 'simptab-favorites'
                            files.AddFavorite( files.FavoriteVO(), file_name, upload_vo.new );

                            console.log("Upload favorite background success.", upload_vo.new )

                            /*
                            // update local storge 'simptab-favorites'
                            var obj = { "file_name" : file_name, "result" : JSON.stringify( upload_vo.new ) };
                            var arr = JSON.parse( localStorage["simptab-favorites"] || "[]" );
                            arr.push( JSON.stringify( obj ));
                            localStorage[ "simptab-favorites" ] = JSON.stringify( arr );
                            */
                        })
                        .fail( function( error ) {
                            console.error( "Upload favorite background error.", error )
                        });
                    }).fail( failed );
                }).bind( null, i, result[i].name )();
            }
        }
    }
});
