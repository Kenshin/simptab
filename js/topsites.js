
define([ "jquery" ], function( $ ) {

    function topSitesRender( sites ) {
        console.log( "Topsites", sites );
    }

    return {
        Init: function() {
            chrome.topSites.get( topSitesRender );
        }
    };

});
