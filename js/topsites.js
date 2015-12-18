
define([ "jquery" ], function( $ ) {

    /* simple topsite example
    <ul class="topsites">
        <li><a href="#"><span>Site 001</span></a></li>
    </ul>
    */

    /* senior topsites example
    <div class="senior-mask">
        <div class="senior-group">
            <a href="javascript:void(0);"><span class="senior-ts-icon-b"></span><div>百度</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-g"></span><div>Google</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-c"></span><div>Cnbeta.com</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-k"></span><div>KsRia</div></a>
        </div>
    </div>
    */

    var tp,
        topsites  = [],
        MAX       = 9,
        TYPE      = "simple",
        $bottom   = $( ".bottom" ),
        topSitesRender = function ( sites ) {
            console.log( "Topsites", sites );
            if ( sites && !$.isEmptyObject( sites ) ) {
                var len   = sites && sites.length > MAX ? MAX : sites.length,
                    item  = "", site;
                for( var i = 0; i < len; i++ ) {

                    // get topsites object
                    site = sites[i];
                    topsites.push( site );

                    // crete topsites render, include: simple and senior
                    tp.Render( site );
                }
                // generate topsits
                tp.Generate();
            }
            else {
                $( ".topsites" ).hide();
            }
    },
    getTLD = function ( url ) {
        var a   = document.createElement('a'),
            tld = "",
            arr = [];
        a.href = url;
        tld    = a.hostname;
        arr    = tld.split(".");
        tld    = arr.length > 1 ? arr[ arr.length - 2 ] : tld;
        return tld && tld.length > 0 ? tld[0] : "empty";
    },
    mouseOverHandler = function() {

        console.log( "bottom mouse over", tp.type )

        if ( tp.type == TYPE ) {

        }
        else {
            var $topsites = $bottom.children();
            if ( !$topsites.hasClass( "senior-show" )) {
                $topsites.removeClass( "senior-hide" ).addClass( "senior-show" );
                tp.senior.On();
            }
        }
    },
    mouseLeaveHandler = function() {
        tp.senior.Off();
        $(this).parent().fadeOut( 1000, function () {
            $(this).removeAttr( "style" ).removeClass( "senior-show" ).addClass( "senior-hide" );
        });
    };

    function Topsites() {}

    // type include: 'simple' and 'senior'
    Topsites.prototype.type = localStorage["simptab-topsites"] && localStorage["simptab-topsites"] == TYPE ? localStorage["simptab-topsites"] : "senior";

    Topsites.prototype.simple        = {};
    Topsites.prototype.simple.$item  = $( '<li><a href="#"><span>Site 001</span></a></li>' );
    Topsites.prototype.simple.$a     = $( Topsites.prototype.simple.$item.find("a"));
    Topsites.prototype.simple.$span  = $( Topsites.prototype.simple.$item.find("span"));
    Topsites.prototype.simple.html   = "";

    Topsites.prototype.senior        = {};
    Topsites.prototype.senior.$item  = $('<a><span></span><div></div>');
    Topsites.prototype.senior.$div   = $( Topsites.prototype.senior.$item.find( "div"  ));
    Topsites.prototype.senior.$span  = $( Topsites.prototype.senior.$item.find( "span" ));
    Topsites.prototype.senior.html   = "";

    Topsites.prototype.senior.On     = function() {
        $bottom.delegate( ".senior-group", "mouseleave", mouseLeaveHandler );
    };
    Topsites.prototype.senior.Off    = function() {
        $bottom.undelegate( ".senior-group", "mouseleave", mouseLeaveHandler );
    };

    Topsites.prototype.SimpleRender = function( site ) {
        this.simple.$a.attr( "href", site.url );
        this.simple.$span.text( site.title );
        this.simple.html += this.simple.$item[0].outerHTML;
    };

    Topsites.prototype.SeniorRender = function( site ) {
        this.senior.$item.attr( "href", site.url );
        this.senior.$span.attr( "class", "senior-ts-icon-" + getTLD( site.url ));
        this.senior.$div.text( site.title );
        this.senior.html += this.senior.$item[0].outerHTML;
    };

    Topsites.prototype.Render = function( site ) {
        this.SimpleRender( site );
        this.SeniorRender( site );
    };

    Topsites.prototype.Generate = function() {
        if ( this.type == TYPE ) {
            $bottom.html( '<ul class="topsites">' + tp.simple.html + '</ul>' );
        }
        else {
            $bottom.html( '<div class="senior-mask senior-hide"><div class="senior-group">' + tp.senior.html + '</div></div>' );
        }
    }

    return {
        Init: function() {
            tp = new Topsites();

            // add test code
            window.tp = tp;

            chrome.topSites.get( topSitesRender );

            $bottom.on( "mouseover", mouseOverHandler );
        },
        sites: function() {
            return topsites;
        }
    };

});
