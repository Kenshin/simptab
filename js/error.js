
define([ "jquery" ], function( $ ) {

	"use strict";

    function __extend( Child, Parent ) {
        function F(){}
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
    }

    function __copy( d, b ) {
        for (var p in d) if (d.hasOwnProperty(p)) if ( d[p] ) b.constructor.prototype[p] = d[p];
    }

	__extend( SimpError, Error );

	function SimpError( method_name, message, data, state ) {

		var err   = Error.call( this, arguments[1] ),
			print = state && state == "error" ? console.err : console.warn;

		this.method_name = method_name;
		this.message     = message;
		this.data        = data;
		this.stack       = err.stack;

		console.group();
		print.call( console, "this.method_name = ", this.method_name );
		print.call( console, "this.message     = ", this.message     );
		print.call( console, "this.data        = ", this.data        );
		print.call( console, "this.stack       = ", this.stack       );
		console.groupEnd();
	}

    SimpError.prototype.name = "SimpError";

    SimpError.Clone = function( simperr, error ) {
        __copy( simperr, error );
        return error;
    };

	return SimpError;

});
