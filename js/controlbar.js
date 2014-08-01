
define([ "jquery" ], function( $ ) {

    return {
        Listen: function () {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.create({ url : $( event.currentTarget ).attr( "url" ) });
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                var $target =  $( event.currentTarget ),
                    url     = $target.attr( "url" );
                if ( url == "setting" ) {

                    if ( !$target.hasClass( "close" )) {
                        $( ".setting" ).animate({ width: 240, opacity : 0.8 }, 500, function() {
                            $target.addClass( "close" );
                        });
                    }
                    else {
                        $( ".setting" ).animate({ width: 0, opacity : 0 }, 500, function() {
                            $target.removeClass( "close" );
                        });
                    }

                }
            });
        }
    }
});
