// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {

      "jquery"     : "vender/jquery-3.3.1.min",
      "lodash"     : "vender/lodash.min",
      "mousetrap"  : "vender/mousetrap.min",
      "progressbar": "vender/progressbar.min",
      "notify"     : "vender/notify/notify.min",
      "waves"      : "vender/waves/waves.min",

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
      "manage"     : "js/manage"
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
requirejs([ "jquery", "lodash", "notify", "background", "date" , "controlbar", "setting", "i18n", "shortcuts", "files", "topsites", "version", "progress", "waves" ], function ( $, _, Notify, background, date, controlbar, setting, i18n, shortcuts, files, topsites, version, progress, Waves ) {

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
    background.Get( setting.IsRandom() );

    // get time
    date.Toggle( setting.Mode( "clockstate" ));

    // listen
    controlbar.Listen( function( type, result ) {
        switch ( type) {
            case "upload"  : background.Upload( result );   break;
            case "favorite": background.Favorite( result ); break;
            case "dislike" : background.Dislike( result );  break;
            case "pin"     : background.Pin( result );      break;
            case "refresh" :
                setting.Mode( "changestate" ) == "time" ? 
                    background.UpdateBg( result ) : 
                    new Notify().Render( 2, i18n.GetLang( "notify_not_refresh" ) );
                break;
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
    background.Valid();

    topsites.Init();

    // short cuts init
    shortcuts.Init();

    version.Init();

    // waves config
    Waves.attach( '.icon', ['waves-circle'] );
    Waves.attach( '.lineradio', ['waves-block'] );
    Waves.init();

});
