
define([ "jquery" ], function( $ ) {

    /* simple topsite example
    <ul class="topsites">
        <li><a href="#"><span>Site 001</span></a></li>
    </ul>
    */

    /* senior topsites example
    <div class="seniorgp">
        <div class="senior">
            <a href="javascript:void(0);"><span class="senior-ts-icon-b"></span><div>百度</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-g"></span><div>Google</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-c"></span><div>Cnbeta.com</div></a>
            <a href="javascript:void(0);"><span class="senior-ts-icon-k"></span><div>KsRia</div></a>
        </div>
    </div>
    */

    var tp,
        topsites = [],
        MAX      = 9,
        TYPE     = "simple",
        $root    = $( ".bottom" ),
        addRootEvent = function() {
            $root.on( "mouseover", mouseOverHandler  );
        },
        delRootEvent = function() {
            $root.off( "mouseover", mouseOverHandler );
        },
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
                $root.hide();
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
        delRootEvent();
        if ( tp.type == TYPE ) {
            // NO TO-DO
        }
        else {
            var $topsites = $root.children();
            if ( !$topsites.hasClass( "senior-show" )) {
                $topsites.removeClass( "senior-hide" ).addClass( "senior-show" );
                tp.senior.On();
            }
        }
    },
    mouseLeaveHandler = function() {
        tp.senior.Off();
        $(this).parent().fadeOut( 500, function () {
            $(this).removeAttr( "style" ).removeClass( "senior-show" ).addClass( "senior-hide" );
            addRootEvent();
        });
    };

    function Topsites() {}

    // type include: 'normal', 'simple'(default) and 'senior'
    Topsites.prototype.type = !localStorage["simptab-topsites"] ? "simple": localStorage["simptab-topsites"];

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
        $root.delegate( ".senior", "mouseleave", mouseLeaveHandler );
    };
    Topsites.prototype.senior.Off    = function() {
        $root.undelegate( ".senior", "mouseleave", mouseLeaveHandler );
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
        switch ( this.type) {
            case "simple":
                delRootEvent();
                $root.html( '<ul class="topsites">' + tp.simple.html + '</ul>' );
                break;
            case "senior":
                addRootEvent();
                $root.html( '<div class="seniorgp senior-hide"><div class="senior">' + tp.senior.html + '</div></div>' );
                break;
            default:
                delRootEvent();
                $root.empty();
                break;
        }
    }

    return {
        Init: function() {
            tp = new Topsites();
            chrome.topSites.get( topSitesRender );
        },
        sites: function() {
            return topsites;
        },
        Refresh: function( result ) {
            localStorage["simptab-topsites"] = result;
            tp.type = result;
            tp.Generate();
        }
    };

});
