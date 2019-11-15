// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {

      "jquery"     : "vender/jquery-3.3.1.min",
      "unveil"     : "vender/jquery.unveil",
      "lodash"     : "vender/lodash",
      "mousetrap"  : "vender/mousetrap.min",
      "progressbar": "vender/progressbar.min",
      "notify"     : "vender/notify/notify.min",
      "waves"      : "vender/waves/waves.min",
      "carousel"   : "vender/carousel/carousel",

      "main"       : "js/main",
      "background" : "js/background",
      "apis"       : "js/apis",
      "vo"         : "js/vo",
      "date"       : "js/date",
      "controlbar" : "js/controlbar",
      "setting"    : "js/setting",
      "i18n"       : "js/i18n",
      "shortcuts"  : "js/shortcuts",
      "files"      : "js/files",
      "error"      : "js/error",
      "topsites"   : "js/topsites",
      "version"    : "js/version",
      "progress"   : "js/progress",
      "cdns"       : "js/cdns",
      "manage"     : "js/manage",
      "about"      : "js/about",
      "bookmarks"  : "js/bookmarks",
      "welcome"    : "js/welcome",
      "zen"        : "js/zen",
      "options"    : "js/options",
      "noise"      : "js/noise",
      "history"    : "js/history",
      "comps"      : "js/components",
      "message"    : "js/message",
    },
    shim: {
        "mousetrap"    : {
            exports    : "Mousetrap"
        },
        "progressbar" : {
            exports    : "ProgressBar"
        }
    }
});

// main
requirejs([ "jquery", "lodash", "notify", "background", "date" , "controlbar", "setting", "i18n", "shortcuts", "files", "topsites", "version", "progress", "waves", "message", "bookmarks", "welcome", "zen", "options", "noise", "vo", "history" ], function ( $, _, Notify, background, date, controlbar, setting, i18n, shortcuts, files, topsites, version, progress, Waves, message, bookmarks, welcome, zen, options, noise, vo, history ) {

    progress.Init();

    // file system init
    files.Init( function( error ) {
        console.error( "File system error ", error );
    });

    // set background font
    background.SetLang( i18n.GetLocale() );

    // set language
    i18n.Init();

    // init radio input
    setting.Init();

    // get background image
    localStorage["simptab-zenmode"] != "true" && background.Get( setting.IsRandom() );

    // get time
    date.Toggle( setting.Mode( "clockstate" ));

    localStorage["simptab-zenmode"] != "true" && controlbar.AutoPlay();

    // listen
    controlbar.Listen( function( type, result ) {
        switch ( type) {
            case "upload"  : background.Upload( result );   break;
            case "favorite": background.Favorite( result ); break;
            case "dislike" : background.Dislike( result );  break;
            case "pin"     : background.Pin( result );      break;
            case "refresh" : background.Update( result, true ); break;
        }
    });
    setting.Listen( function( type, result ) {
        switch ( type) {
            case "tsstate"      : topsites.Refresh( result ); break;
            case "clockstate"   : date.Toggle( result );      break;
            case "positionstate": controlbar.SetBgPosition( true ); break;
            case "changestate"  :
                result == "none" && background.Update( result );
                result == "earth"&& background.Earth( true );
                result == "time" && background.Update( result );
                break;
        }
    });

    // validation background
    localStorage["simptab-zenmode"] != "true" && background.Valid();

    options.Init();

    topsites.Init( options.Storage.db.topsites );

    // short cuts init
    shortcuts.Init();

    // custom title
    if ( options.Storage.db.title.startsWith( '(function()' ) ) new Function( options.Storage.db.title )();
    else options.Storage.db.title && ( document.title = options.Storage.db.title );

    version.Init( function( ver ) {
        welcome.Render( ver );
    });
    // welcome.Render({ first: false, update: "1.5.2" });

    // waves config
    Waves.attach( '.icon',      [ 'waves-circle']);
    Waves.attach( '.lineradio', [ 'waves-block' ]);
    Waves.attach( '.boxradio',  [ 'waves-block' ]);
    Waves.init();

    // global event handler
    message.Subscribe( message.TYPE.UPDATE_CONTROLBAR, function( event ) {
        controlbar.Update( event.data.url, event.data.info );
    });
    message.Subscribe( message.TYPE.UPDATE_EARTH, function() {
        background.Earth();
    });
    message.Subscribe( message.TYPE.HISTORY, function( event ) {
        localStorage["simptab-zenmode"] != "true" && options.Storage.db.history && history.Get( event.data );
    });
    message.Subscribe( message.TYPE.SET_BACKGROUND, function( event ) {
        background.Set( event.data );
    });
    message.Subscribe( message.TYPE.SET_BACKGROUND_POSITION, function( event ) {
        background.SetPosition( event.data );
    });
    message.Subscribe( message.TYPE.OPEN_ZENMODE, function( event ) {
        $( ".zenstate input" ).click();
    });
    message.Subscribe( message.TYPE.CLOSE_ZENMODE, function( event ) {
        zen.ESC();
    });

    chrome.permissions.contains({ permissions: [ 'bookmarks' ]}, function( result ) {
        result && bookmarks.Render( options.Storage.db.search );
        result && bookmarks.Listen();
    });

    localStorage["simptab-zenmode"] == "true" && zen.Render();

    noise.Init();

    localStorage["simptab-zenmode"] != "true" && localStorage[ "simptab-background-mode" ] == "time" && options.Storage.db.history && history.Init();

    try {
        options.Storage.db.script != "" && setTimeout( function() { new Function( options.Storage.db.script )(); }, 1000 );
    } catch ( error ) {
        console.error( '此脚本运行时出现错误，错误信息 ', error )
    }

});
