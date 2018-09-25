define([ "jquery", "waves", "i18n" ], function( $, Waves, i18n ) {

    var bookmarks  = { origin: [], root: [], folders: [], all: [] }, maxBookmark = 0,
        getBgColor = function ( chars ) {
            var idx = bgColors.idx.indexOf( chars.toLowerCase() ),
                bg  = bgColors.colors[idx];
            !bg && ( bg = bgColors.colors[ random( 0, bgColors.colors.length ) ]);
            return bg;
        },
        random = function( min, max ) {
            if ( max < min ) throw new Error( "cdns.New(), Max must be greater than min." );
            return Math.floor( Math.random() * ( max - min + 1 ) + min );
        },
        bgColors = {
            colors: ["rgb(255, 114, 129)", "rgb(64, 196, 255)", "rgb(255, 157, 68)", "rgb(140, 216, 66)", "rgb(251, 88, 74)", "rgb(255, 229, 95)", "rgb(0, 230, 118)", "rgb(0, 169, 240)", "rgb(128, 222, 234)", "rgb(247, 77, 95)", "rgb(255, 206, 73)", "rgb(250, 154, 63)", "rgb(155, 88, 182)", "rgb(57, 194, 241)", "rgb(141, 196, 72)", "rgb(49,149,215)", "rgb(83, 109, 254)", "rgb(255, 183, 77)", "rgb(197, 231, 99)", "rgb(239, 83, 80)", "rgb(126,86,77)", "rgb(156,39,176)", "rgb(100, 181, 246)", "rgb(119, 232, 86)", "rgb(141,110,99)", "rgb(0, 203, 232)", "rgb(038,166,154)", "rgb(255, 196, 0)", "rgb(253,154,155)", "rgb(167, 134, 116)", "rgb(86, 209, 216)", "rgb(253, 208, 174)", "rgb(97,97,97)", "rgb(239, 88, 74)", "rgb(249, 79, 40)", "rgb(255, 88, 100)", "rgb(224,64,251)", "rgb(0, 177, 251)", "rgb(255,202,40)", "rgb(251, 182, 75)", "rgb(48,63,159)", "rgb(35, 180, 210)", "rgb(0,229,255)", "rgb(158,157,36)", "rgb(239,83,80)", "rgb(50, 71, 93)", "rgb(216,67,21)", "rgb(139, 223, 231)", "rgb(69,90,100)"],
            idx   : "abcdefghijklmnopqrstuvwxyz0123456789",
        },
        folderTmpl = '<div class="folder root"></div>';

    function bmListen() {
        $( ".bm-overlay" ).mouseenter( function() {
            $( ".bm" ).css({ "transform": "translateX(0px)", "opacity": 1 });
        });
        $( ".bm" ).mouseleave( function() {
            //$( ".bm" ).css({ "transform": "translateX(-300px)", "opacity": 0 });
        });
    }

    function getBookmarks() {
        chrome.bookmarks.getTree( function( result ) {
            if ( result && result.length > 0 && result[0].children && result[0].children.length > 0 ) {
                bookmarks.origin = result[0].children[0].children;
                fmtBookmarks( bookmarks.origin, true );
            } else {
                new new Notify().Render( "当前环境并未有任何书签。" );
                // TO-DO
            }
        })
    }

    function fmtBookmarks( result, is_parent ) {
        result.forEach( function( item ) {
            if ( item.children ) {
                //maxBookmark += item.children.length;
                //!is_parent && maxBookmark--;
                createFoldersTmpl({ id: item.id, title: item.title, children: item.children });
                fmtBookmarks( item.children );
            } else {
                bookmarks.all.push({ id: item.parentId, title: item.title, url: item.url, item: item });
                //is_parent && maxBookmark++;
                is_parent && createRootTmpl({ id: item.parentId, title: item.title, url: item.url, item: item });
            }
        });
        console.log( bookmarks )
    }

    function createFoldersTmpl( folder ) {
        bookmarks.folders.push( folder );
        var title = folder.title.substr( 0, 1 ),
            tmpl  = '<div data-balloon="' + folder.title + '" data-balloon-pos="right" class="folder normal"><span style="background-color: ' + getBgColor( title ) + '">' + title + '</span></div>';
        folderTmpl += tmpl;
        $( ".bm .folders" ).html( folderTmpl );
    }

    function createRootTmpl( item ) {
        bookmarks.root.push( item );
    }

    return {
        Render() {
            $( "body" ).append( '<div class="bm-overlay"><div class="bm"><div class="folders"></div><div class="files"></div></div></div>' );
            setTimeout( function() {
                bmListen();
                getBookmarks();
            }, 10 );
        }
    }
});