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
            "SET_BACKGROUND"   : "SET_BACKGROUND",
            "SET_BACKGROUND_POSITION" : "SET_BACKGROUND_POSITION",
            "UPDATE_CONTROLBAR": "UPDATE_CONTROLBAR",
            "OPEN_BOOKMARKS"   : "OPEN_BOOKMARKS",
            "OPEN_QUICKBAR"    : "OPEN_QUICKBAR",
            "OPEN_ZENMODE"     : "OPEN_ZENMODE",
            "OPEN_NOISE"       : "OPEN_NOISE",
            "UPDATE_EARTH"     : "UPDATE_EARTH",
            "HISTORY"          : "HISTORY",
        },
        Subscribe: subscribe,
        Publish  : publish
    }
});