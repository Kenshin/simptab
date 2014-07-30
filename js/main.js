// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {
      "jquery"     : "vender/jquery-2.1.1.min",
      "background" : "js/background",
      "date"       : "js/date",
      "controlbar" : "js/controlbar",
      "option"     : "js/option"
    }
});

// main
requirejs([ "jquery", "background", "date" , "controlbar", "option" ], function ( $, background, date, controlbar, option ) {

  // init radio input
  option.Init();

  // set is_random
  var is_random = true;
  if ( option.Get( "changestate" ) != undefined ) {
    is_random = false;
  }

  // get background image
  background.Get( is_random );

  // get time
  if ( option.Get( "clockstate" ) != undefined ) {
    date.Show();
  }
  else {
    date.Hide();
  }

  // listen
  controlbar.Listen();
  option.Listen();

});