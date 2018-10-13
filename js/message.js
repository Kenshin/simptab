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
            "OPEN_BOOKMARKS"   : "OPEN_BOOKMARKS",
            "OPEN_QUICKBAR"    : "OPEN_QUICKBAR",
        },
        Subscribe: subscribe,
        Publish  : publish
    }
});