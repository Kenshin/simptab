// requirejs config
requirejs.config({
    baseUrl: ".",
    paths: {
      "jquery"             : "vender/jquery-2.1.1.min",
      "background" : "js/background",
      "date"                 : "js/date",
      "controlbar"     : "js/controlbar"
    }
});

// main
requirejs([ "jquery", "background", "date" , "controlbar" ], function ( $, background, date, controlbar ) {

  // get background image
  background.Get( false );

  // get time
  date.Show();

  // listen
  controlbar.Listen();

});