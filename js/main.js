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
requirejs([ "jquery", "lodash", "notify", "background", "date" , "controlbar", "setting", "i18n", "shortcuts", "files", "topsites", "version", "progress", "waves", "message", "bookmarks", "welcome", "zen" ], function ( $, _, Notify, background, date, controlbar, setting, i18n, shortcuts, files, topsites, version, progress, Waves, message, bookmarks, welcome, zen ) {

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

    // listen
    controlbar.Listen( function( type, result ) {
        switch ( type) {
            case "upload"  : background.Upload( result );   break;
            case "favorite": background.Favorite( result ); break;
            case "dislike" : background.Dislike( result );  break;
            case "pin"     : background.Pin( result );      break;
            case "refresh" : background.UpdateBg( result ); break;
        }
    });
    setting.Listen( function( type, result ) {
        switch ( type) {
            case "tsstate"      : topsites.Refresh( result ); break;
            case "clockstate"   : date.Toggle( result );      break;
            case "positionstate": controlbar.SetBgPosition( true ); break;
            case "changestate"  :
                result == "none" && background.UpdateBg( result );
                break;
        }
    });

    // validation background
    localStorage["simptab-zenmode"] != "true" && background.Valid();

    topsites.Init();

    // short cuts init
    shortcuts.Init();

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
        controlbar.Update( event.data.url );
    });

    chrome.permissions.contains({ permissions: [ 'bookmarks' ]}, function( result ) {
        result && bookmarks.Render();
        result && bookmarks.Listen();
    });

    localStorage["simptab-zenmode"] == "true" && zen.Render();

});
