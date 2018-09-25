define([ "jquery", "waves", "i18n" ], function( $, Waves, i18n ) {

    var bookmarks = { origin: [], root: [], folders: [], all: [] }, maxBookmark = 0;

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
                createFolderTmpl({ id: item.id, title: item.title, children: item.children });
                fmtBookmarks( item.children );
            } else {
                bookmarks.all.push({ id: item.parentId, title: item.title, url: item.url, item: item });
                //is_parent && maxBookmark++;
                is_parent && createRootTmpl({ id: item.parentId, title: item.title, url: item.url, item: item });
            }
        });
        console.log( bookmarks )
    }

    function createFolderTmpl( folder ) {
        bookmarks.folders.push( folder );
    }

    function createRootTmpl( item ) {
        bookmarks.root.push( item );
    }

    return {
        Render() {
            $( "body" ).append( '<div class="bm-overlay"><div class="bm"><div class="folder"></div><div class="file"></div></div></div>' );
            setTimeout( function() {
                bmListen();
                getBookmarks();
            }, 10 );
        }
    }
});