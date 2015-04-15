
define([ "jquery" ], function( $ ) {

    function topSitesRender( sites ) {
        console.log( "Topsites", sites );
        if ( sites && !$.isEmptyObject( sites ) ) {
            var $item = $( '<li><a href="#"><span>Site 001</span></a></li>' ),
                $a    = $( $item.find("a")    ),
                $span = $( $item.find("span") ),
                max   = 10,
                len   = sites && sites.length > max ? max : sites.length,
                item  = "", site;
            for( var i = 0; i < len; i++ ) {
                site = sites[i];

                $a.attr( "href", site.url );
                $span.text( site.title );

                item += $item[0].outerHTML;
            }
            $( ".topsites" ).html( item );
        }
        else {
            $( ".topsites" ).hide();
        }
    }

    return {
        Init: function() {
            chrome.topSites.get( topSitesRender );
        }
    };

});
