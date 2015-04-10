
define([ "jquery" ], function( $ ) {

	"use strict";

	function SimpError( method_name, message, data ) {
		Error.apply( this, arguments );

		this.method_name = method_name;
		this.message     = message;
		this.data         = data;
	}

	SimpError.prototype = Error.prototype;

	return SimpError;

});


