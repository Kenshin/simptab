
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
        bgColors = {
            colors: ["rgb(255, 114, 129)", "rgb(64, 196, 255)", "rgb(255, 157, 68)", "rgb(140, 216, 66)", "rgb(251, 88, 74)", "rgb(255, 229, 95)", "rgb(0, 230, 118)", "rgb(0, 169, 240)", "rgb(128, 222, 234)", "rgb(247, 77, 95)", "rgb(255, 206, 73)", "rgb(250, 154, 63)", "rgb(155, 88, 182)", "rgb(57, 194, 241)", "rgb(141, 196, 72)", "rgb(49,149,215)", "rgb(83, 109, 254)", "rgb(255, 183, 77)", "rgb(197, 231, 99)", "rgb(239, 83, 80)", "rgb(126,86,77)", "rgb(156,39,176)", "rgb(100, 181, 246)", "rgb(119, 232, 86)", "rgb(141,110,99)", "rgb(0, 203, 232)", "rgb(038,166,154)", "rgb(255, 196, 0)", "rgb(253,154,155)", "rgb(167, 134, 116)", "rgb(86, 209, 216)", "rgb(253, 208, 174)", "rgb(97,97,97)", "rgb(239, 88, 74)", "rgb(249, 79, 40)", "rgb(255, 88, 100)", "rgb(224,64,251)", "rgb(0, 177, 251)", "rgb(255,202,40)", "rgb(251, 182, 75)", "rgb(48,63,159)", "rgb(35, 180, 210)", "rgb(0,229,255)", "rgb(158,157,36)", "rgb(239,83,80)", "rgb(50, 71, 93)", "rgb(216,67,21)", "rgb(139, 223, 231)", "rgb(69,90,100)"],
            idx   : "abcdefghijklmnopqrstuvwxyz0123456789",
        },
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
        var re    = /http(s)?:\/\/\S[^\/]+/ig,
            match = [];
        match     = re.exec(url);
        return match && match.length > 1 ? match[0].replace( /(http(s)?:\/\/)(w{3}.)?/ig, "" ) : "empty";
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
        $( ".seniorgp" ).fadeOut( 500, function () {
            $(this).removeAttr( "style" ).removeClass( "senior-show" ).addClass( "senior-hide" );
            addRootEvent();
            //offestPosition();
        });
    },
    offestPosition = function() {
        var right = parseInt($( ".seniorgp" ).css( "right" )),
            width = $( ".setting"  ).width();
        $( ".seniorgp" ).css( "right", right + width );
    };

    function Topsites() {}

    // type include: 'normal', 'simple'(default) and 'senior'
    Topsites.prototype.type = localStorage["simptab-topsites"];

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
        $root.delegate( ".seniorgp", "click",      mouseLeaveHandler );  // 116-simptab-optimize-layout
        $root.delegate( ".senior",   "mouseleave", mouseLeaveHandler );
    };
    Topsites.prototype.senior.Off    = function() {
        $root.undelegate( ".seniorgp", "click",      mouseLeaveHandler ); // 116-simptab-optimize-layout
        $root.undelegate( ".senior",   "mouseleave", mouseLeaveHandler );
    };

    Topsites.prototype.SimpleRender = function( site ) {
        this.simple.$a.attr( "href", site.url );
        this.simple.$span.text( site.title );
        this.simple.$item.attr( "data-balloon", site.url ).attr( "data-balloon-pos", "up" );
        this.simple.html += this.simple.$item[0].outerHTML;
    };

    Topsites.prototype.SeniorRender = function( site ) {
        this.senior.$item.attr( "href", site.url );
        var chars = getTLD( site.url ).substr( 0, 1 ),
            idx = bgColors.idx.indexOf( chars ),
            bg  = bgColors.colors[idx];
        this.senior.$span.text( chars );
        this.senior.$span.css( "background-color", bg );
        this.senior.$div.text( site.title );
        this.senior.$item.attr( "data-balloon", site.url ).attr( "data-balloon-pos", "down" );
        this.senior.html += this.senior.$item[0].outerHTML;
    };

    Topsites.prototype.Render = function( site ) {
        this.SimpleRender( site );
        this.SeniorRender( site );
    };

    Topsites.prototype.Generate = function() {
        switch ( this.type ) {
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
        // 116-simptab-optimize-layout
        //offestPosition();
    }

    Topsites.prototype.Custom = function( data ) {
        var result= [],
            lines = data.split( "\n" );
        for( var i = 0; i < lines.length; i++ ){
            var line  = lines[i],
                arr   = line.split( "," ),
                title = arr[0],
                url   = arr[1];
            result.push({ title: title, url: url });
        }
        return result;
    }

    return {
        Init: function( result ) {
            tp = new Topsites();
            if ( result.enable && result.custom != "" ) {
                topSitesRender( tp.Custom( result.custom ));
            } else {
                chrome.topSites.get( topSitesRender );
            }
        },
        sites: function() {
            return topsites;
        },
        Refresh: function( result ) {
            tp.type = result;
            tp.Generate();
        }
    };

});
