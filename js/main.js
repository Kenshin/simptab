// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {
      "main"       : "js/main",
      "jquery"     : "vender/jquery-2.1.1.min",
      "mousetrap"  : "vender/mousetrap.min",
      "background" : "js/background",
      "apis"       : "js/apis",
      "vo"         : "js/vo",
      "date"       : "js/date",
      "controlbar" : "js/controlbar",
      "setting"    : "js/setting",
      "i18n"       : "js/i18n",
      "shortcuts"  : "js/shortcuts",
      "files"       : "js/files"
    },
    shim: {
      "mousetrap"   : {
          exports  : "Mousetrap"
      }
    }
});

// main
requirejs([ "jquery", "background", "date" , "controlbar", "setting", "i18n", "shortcuts" ], function ( $, background, date, controlbar, setting, i18n, shortcuts ) {

  // set background font
  background.SetLang( i18n.GetLocale() );

  // set language
  i18n.Init();

  // init radio input
  setting.Init();

  // get background image
  background.Get( setting.IsRandom() );

  // get time
  if ( setting.Get( "clockstate" ) != undefined ) {
    date.Show();
  }
  else {
    date.Hide();
  }

  // listen
  controlbar.Listen();
  setting.Listen();

  // validation background
  background.Valid();

  // short cuts init
  shortcuts.Init();

  $( ".controlbar" ).on( "favoriteClickEvent", function( event, result ) {
      background.Favorite( result );
  })

});
