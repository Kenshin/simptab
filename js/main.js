// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {
      "jquery"     : "vender/jquery-2.1.1.min",
      "background" : "js/background",
      "date"       : "js/date",
      "controlbar" : "js/controlbar",
      "setting"     : "js/setting"
    }
});

// main
requirejs([ "jquery", "background", "date" , "controlbar", "setting" ], function ( $, background, date, controlbar, setting ) {

  // init radio input
  setting.Init();

  // set is_random
  var is_random = true;
  if ( setting.Get( "changestate" ) != undefined ) {
    is_random = false;
  }

  // get background image
  background.Get( is_random );

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

});