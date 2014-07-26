// requirejs config
requirejs.config({
    baseUrl: '.',
    paths: {
      'jquery'    : 'vender/jquery-2.1.1.min',
      'background': 'js/background',
      'date'      : 'js/date'
  	}
});

// main
requirejs(['jquery', 'background', 'date' ],function ($, background, date) {

	// get background image
	background.Get(false);

	// get time
	date.Show();
});