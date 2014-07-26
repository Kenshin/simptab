
define( ["jquery"], function($){

	getDefault = function () {
		$.ajax({
			type       : "GET",
			timeout    : 2000,
			url        : "http://bing.com",
			success    : function( data ) {
				//console.log(data);
				var begin = data.indexOf( "g_img=" ),
				    end   = data.indexOf( ".jpg"),
				    url   = data.substring( begin + 12, end ) + ".jpg";

				console.log("url = " + url);
				console.log("end = " + end);
				console.log("begin = " + begin);

				// set background image
				$("body").css({ "background-image": "url(" + url + ")" });
			}
		});
	}

	getRandom = function () {
		console.log("getRandom")
	}

	return {
		Get: function ( is_random ) {
			if ( is_random ) {
				getRandom();
			}
			else {
				getDefault();
			}
		}
	}
});
