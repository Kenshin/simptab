
define([ "jquery" ], function( $ ) {

    "use strict";

    /* example
    <div class="senior-mask">
        <div class="senior-group">
            <a href="javascript:void(0);"><span class="senior-ts-icon-b"></span><div>百度</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-g"></span><div>Google</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-c"></span><div>Cnbeta.com</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-k"></span><div>KsRia</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-1"></span><div>123.com</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-t"></span><div>twi22222222222tter.com</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-q"></span><div>糗事百科.com</div></a>
        </div>
    </div>
    */

    var $senior      = $('<div class="senior-mask"><div class="senior-group"></div></div>'),
        $seniorGroup = $( $senior.find("div"));

    function getTLD( url ) {
        var a  = document.createElement('a');
        a.href = url;
        return a.hostname && a.hostname.length > 0 ? a.hostname[0] : "#";
    }

    function seniortsRender( sites ) {

        if ( sites && !$.isEmptyObject( sites ) ) {

            $( ".senior-ts-target" ).mouseover( function() {
                $( "body" ).append( $senior );
            });

            var $site = $('<a><span></span><div></div>'),
                $div  = $( $site.find( "div"  )),
                $span = $( $site.find( "span" )),
                max   = 9,
                len   = sites && sites.length > max ? max : sites.length,
                item  = "", site;
                for( var i = 0; i < len; i++ ) {
                    site = sites[i];
                    $site.attr( "href", site.url );
                    $span.attr( "class", "senior-ts-icon-" + getTLD( site.url ));
                    $div.html( site.title );
                    item += $site[0].outerHTML;
                }
                $seniorGroup.append( item );
        }
        else {
            $( ".senior-mask" ).remove();
            $( ".senior-ts-target" ).die( "mouseover" );
        }
    }

    return {
        Init: function() {
            chrome.topSites.get( seniortsRender );
        }
    }
});
