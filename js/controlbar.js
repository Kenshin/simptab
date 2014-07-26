
define([ "jquery" ], function( $ ) {

    return {
        Listen: function () {
            // listen control bar
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.create({ url : $( event.currentTarget ).attr( "url" ) });
            });
        }
    }
});
