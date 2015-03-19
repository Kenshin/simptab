
define([ "jquery", "i18n" ], function( $, i18n ) {


    return {
        Listen: function () {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.getCurrent( function( obj ) {
                    chrome.tabs.create({ url : $( event.currentTarget ).attr( "url" ) });
                    chrome.tabs.remove( obj.id );
                })
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                var $target =  $( event.currentTarget ),
                    url     = $target.attr( "url" );
                if ( url == "setting" ) {

                    if ( !$target.hasClass( "close" )) {
                        $( ".setting" ).animate({ width: i18n.GetSettingWidth(), opacity : 0.8 }, 500, function() {
                            $target.addClass( "close" );
                        });
                    }
                    else {
                        $( ".setting" ).animate({ width: 0, opacity : 0 }, 500, function() {
                            $target.removeClass( "close" );
                        });
                    }
                }
                else if ( url == "favorite" ) {
                    var is_favorite = $($target.find("span")).hasClass("unfavoriteicon") ? true : false;
                    $( ".controlbar" ).trigger( "favoriteClickEvent", [is_favorite] );
                }
            });
        },

        AutoClick: function( idx ) {
            if ( idx < 3 ) {
                $( $(".chromelink")[idx] ).click();
            }
            else {
                $( $(".controlbar").find( "a" )[idx] )[0].click();
            }
        }
    }
});
