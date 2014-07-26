// requirejs config
requirejs.config({
    baseUrl: '.',
    paths: {
      'jquery': 'vender/jquery-2.1.1.min',
      'background': 'js/background'
  	}
});

// main
requirejs(['jquery', 'background' ],function ($, background) {
	background.Get(false);
});