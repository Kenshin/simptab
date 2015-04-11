
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

	function SimpError( method_name, message, data ) {

		Error.apply( this, arguments );

        __extend( SimpError, Error );

		this.method_name = method_name;
		this.message     = message;
		this.data        = data;
	}

    SimpError.prototype.name = "SimpError";

    SimpError.Clone = function( simperr, error ) {
        __copy( simperr, error );
        return error;
    }

	return SimpError;

});