
define([ "jquery" ], function( $ ) {

    return {
        Listen: function () {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.create({ url : $( event.currentTarget ).attr( "url" ) });
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                $target = $( event.currentTarget ).attr( "url" );
                if ( $target == "setting" ) {
                    //TO DO
                }
            });
        }
    }
});
