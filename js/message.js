define([ "jquery" ], function( $ ) {

    function subscribe( type, callback ) {
        document.addEventListener( type, callback );
    }

    function publish( type, data ) {
        var evt  = document.createEvent( "Event" );
        evt.data = data;
        evt.initEvent( type );
        document.dispatchEvent( evt );
    }

    return {
        TYPE     : {
            "UPDATE_CONTROLBAR": "UPDATE_CONTROLBAR",
        },
        Subscribe: subscribe,
        Publish  : publish
    }
});