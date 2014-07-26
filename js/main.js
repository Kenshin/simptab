// requirejs config
requirejs.config({
    baseUrl: '.',
    paths: {
      'jquery': 'vender/jquery-2.1.1.min'
  	}
});

// main
requirejs(['jquery' ],function ($) {
    console.log("asdfasdfasdfasdf = " + $().jquery );
});