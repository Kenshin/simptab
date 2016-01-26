
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

	function SimpError( method_name, message, data ) {

		var err   = Error.call( this, arguments[1] );

		this.method_name = method_name;
		this.message     = message;
		this.data        = data;
		this.stack       = err.stack;

		console.groupCollapsed( "===== SimpTab warning =====" );
        console.warn.apply( console, arguments );
        console.warn.call( console, this.stack );
		console.groupEnd();
	}

    SimpError.prototype.name = "SimpError";

    SimpError.Clone = function( simperr, error ) {
        __copy( simperr, error );
        return error;
    };

	return SimpError;

});
