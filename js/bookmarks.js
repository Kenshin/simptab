define([ "jquery", "lodash", "waves", "i18n" ], function( $, _, Waves, i18n ) {

    var bookmarks  = { origin: [], root: [], folders: [], all: [] },
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
        fmtTitle = function( url ) {
            var re    = /http(s)?:\/\/\S[^\/]+/ig,
                match = [];
            match     = re.exec( url) ;
            return match && match.length > 1 ? match[0].replace( /(http(s)?:\/\/)(w{3}.)?/ig, "" ) : url.substr( 0, 1 );
        },
        findBookmarks = function( id ) {
            var result = [];
            bookmarks.all.forEach( function( item ) {
                item.id == id && result.push( item );
            });
            return result;
        },
        bgColors = {
            colors: ["rgb(255, 114, 129)", "rgb(64, 196, 255)", "rgb(255, 157, 68)", "rgb(140, 216, 66)", "rgb(251, 88, 74)", "rgb(255, 229, 95)", "rgb(0, 230, 118)", "rgb(0, 169, 240)", "rgb(128, 222, 234)", "rgb(247, 77, 95)", "rgb(255, 206, 73)", "rgb(250, 154, 63)", "rgb(155, 88, 182)", "rgb(57, 194, 241)", "rgb(141, 196, 72)", "rgb(49,149,215)", "rgb(83, 109, 254)", "rgb(255, 183, 77)", "rgb(197, 231, 99)", "rgb(239, 83, 80)", "rgb(126,86,77)", "rgb(156,39,176)", "rgb(100, 181, 246)", "rgb(119, 232, 86)", "rgb(141,110,99)", "rgb(0, 203, 232)", "rgb(038,166,154)", "rgb(255, 196, 0)", "rgb(253,154,155)", "rgb(167, 134, 116)", "rgb(86, 209, 216)", "rgb(253, 208, 174)", "rgb(97,97,97)", "rgb(239, 88, 74)", "rgb(249, 79, 40)", "rgb(255, 88, 100)", "rgb(224,64,251)", "rgb(0, 177, 251)", "rgb(255,202,40)", "rgb(251, 182, 75)", "rgb(48,63,159)", "rgb(35, 180, 210)", "rgb(0,229,255)", "rgb(158,157,36)", "rgb(239,83,80)", "rgb(50, 71, 93)", "rgb(216,67,21)", "rgb(139, 223, 231)", "rgb(69,90,100)"],
            idx   : "abcdefghijklmnopqrstuvwxyz0123456789",
        },
        folderHTML = '\
                    <div class="folder special root" data-balloon="书签栏" data-balloon-pos="right">\
                        <span id="root" class="waves-effect waves-block"><icon id="root"></icon></span>\
                    </div>\
                    <div class="folder special recent" data-balloon="近期使用" data-balloon-pos="right">\
                        <span id="recent" class="waves-effect waves-block"><icon id="recent"></icon></span>\
                    </div>\
                    ',
        fileHTML = "";

    function bmListen() {
        $( ".bm-overlay" ).mouseenter( function() {
            $( ".bm" ).css({ "transform": "translateX(0px)", "opacity": 0.8 });
            $( ".bm .files" ).children().length == 0 && $( ".bm .files" ).html( fileHTML );
        });
        $( ".bm" ).mouseleave( function() {
            //$( ".bm" ).css({ "transform": "translateX(-300px)", "opacity": 0 });
        });
    }

    function folderListen() {
        $( "body" ).on( "click", ".bm .folders .folder span", function( event ) {
            var id = event.target.id;
            if ( id == "root" ) {
                fileHTML = "";
                bookmarks.root.forEach( function( bookmark ) {
                    createFilesTmpl( bookmark );
                });
                $( ".bm .files" ).html( fileHTML );
            } else if ( id == "recent" ) {
                // TO-DO
            } else {
                var result = findBookmarks( id );
                fileHTML = "";
                result.forEach( function( bookmark ) {
                    createFilesTmpl( bookmark );
                });
                $( ".bm .files" ).html( fileHTML );
            }
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
                createFoldersTmpl({ id: item.id, title: item.title, children: item.children });
                fmtBookmarks( item.children );
            } else {
                bookmarks.all.push({ id: item.parentId, title: item.title, url: item.url, item: item });
                if ( is_parent ) {
                    var bookmark = { id: item.parentId, title: item.title, url: item.url, item: item };
                    bookmarks.root.push( bookmark );
                    createFilesTmpl( bookmark );
                }
            }
        });
        console.log( bookmarks )
    }

    function createFoldersTmpl( folder ) {
        bookmarks.folders.push( folder );
        var id    = folder.id,
            title = folder.title.substr( 0, 1 ),
            tmpl  = '\
                    <div class="folder normal" data-balloon="' + folder.title + '" data-balloon-pos="right">\
                        <span id="' + id + '" class="waves-effect waves-block" style="background-color: ' + getBgColor( title ) + '">' + title + '</span>\
                    </div>';
        folderHTML += tmpl;
        $( ".bm .folders" ).html( folderHTML );
    }

    function createFilesTmpl( item ) {
        var fileTmpl = '\
                        <div class="file">\
                            <a href="<%- url %>">\
                                <span class="avatar" style="background-color: <%- bgColor %>;"><%- avatar %></span>\
                                <span class="title"><%- title %></span>\
                                <span class="toolbar"></span>\
                            </a>\
                        </div>',
            id      = item.id,
            title   = item.title != "" ? item.title : fmtTitle( item.url ),
            url     = item.url,
            avatar  = title.substr( 0, 1 ),
            bgColor = getBgColor( avatar );
        var compiled= _.template( fileTmpl ),
            html    = compiled({ title: title, url: url, avatar: avatar, bgColor: bgColor });
        fileHTML += html;
    }

    return {
        Render() {
            $( "body" ).append( '<div class="bm-overlay"><div class="bm"><div class="folders"></div><div class="files"></div></div></div>' );
            setTimeout( function() {
                bmListen();
                getBookmarks();
                folderListen();
            }, 10 );
        }
    }
});