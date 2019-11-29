define([ "jquery", "lodash", "waves", "i18n", "message", "guide" ], function( $, _, Waves, i18n, message, guide ) {

    var bookmarks  = { origin: [], root: [], folders: [], recent: [], all: [], search: [] },
        timestart,
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
                    <div class="folder special search" data-balloon="' + i18n.GetLang( "bm_foder_search" ) + '" data-balloon-pos="right">\
                        <span class="name" id="search" class="waves-effect waves-block"><icon id="search"><i class="fas fa-search"></i></icon></span>\
                        <span class="full">' + i18n.GetLang( "bm_foder_search" ) + '</span>\
                    </div>\
                    <div class="folder special recent" data-balloon="' + i18n.GetLang( "bm_foder_recent" ) + '" data-balloon-pos="right">\
                        <span class="name" id="recent" class="waves-effect waves-block"><icon id="recent"><i class="far fa-clock"></i></icon></span>\
                        <span class="full">' + i18n.GetLang( "bm_foder_recent" ) + '</span>\
                    </div>\
                    <div class="folder special root" data-balloon="' + i18n.GetLang( "bm_foder_root" ) + '" data-balloon-pos="right">\
                        <span class="name" id="root" class="active waves-effect waves-block"><icon id="root"><i class="far fa-bookmark"></i></icon></span>\
                        <span class="full">' + i18n.GetLang( "bm_foder_root" ) + '</span>\
                    </div>\
                    ',
        fileHTML = "";

    function open( delay ) {
        timestart = true;
        setTimeout( function() {
            if ( !timestart ) return;
            if ( $( ".bm" ).hasClass( "open" ) ) return;
            $( ".bm" ).css({ "transform": "translateX(0px)", "opacity": 0.8 }).addClass( "open" );
            $( ".bm-overlay" ).width( "50%" );
            $( ".bm .files" ).children().length == 0 && $( ".bm .files" ).html( fileHTML );
            if ( $(".folders").height() < $(".folder").length * $(".folder").height() ) {
                $(".folders").css( "width", "71px" );
            }
            guide.Tips( "bookmarks" );
        }, delay || 500 );
    }

    function close() {
        if ( !$( ".bm" ).hasClass( "open" ) ) return;
        $( ".bm" ).css({ "transform": "translateX(-300px)", "opacity": 0 }).removeClass( "open" );
        $( ".bm-overlay" ).removeAttr( "style" );
    }

    function bmListen() {
        $( ".bm-overlay" ).mouseenter( function() {
            open();
        });
        $( ".bm-overlay" ).mouseleave( function() {
            timestart = false;
        });
        $( ".bm" ).mouseleave( function() {
            close();
        });
        $( ".bm-overlay" ).on( "click", function( event ) {
            event.target.className.toLowerCase() == "bm-overlay" && $( ".bm" ).hasClass( "open" ) &&
                close();
        });
    }

    function folderListen() {
        $( "body" ).on( "click", ".bm .folders .folder", function( event ) {
            var $target = $( event.currentTarget ),
                id      = $target.find( 'span.name' ).attr( "id" ),
                tag     = event.currentTarget.tagName.toLowerCase();

            if ( id != "search" ) {
                $( ".bm .folders .folder span" ).removeClass( "active" );
                $( ".bm .folders .folder" ).removeClass( "active" );
                $target.addClass( 'active' ).find( 'span.name' ).addClass( 'active' );
            }

            if ( id == "search" ) {
                close();
                openQuickbar();
            } else if ( id == "root" ) {
                fileHTML = "";
                bookmarks.root.forEach( function( bookmark ) {
                    createFilesTmpl( bookmark );
                });
                $( ".bm .files" ).html( fileHTML );
            } else if ( id == "recent" ) {
                fileHTML = "";
                getRecent( function() {
                    $( ".bm .files" ).html( fileHTML );
                });
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
                countMaxWith();
            } else {
                new Notify().Render( i18n.GetLang( "notify_bm_empty" ));
                $( ".bm-overlay" ).remove();
            }
        })
    }

    function getRecent( callback ) {
        chrome.bookmarks.getRecent( 40, function( result ) {
            bookmarks.recent = result;
            bookmarks.recent.forEach( function( item, idx ) {
                createFilesTmpl( item );
                if ( idx == bookmarks.recent.length - 1 ) {
                    callback && callback();
                }
            });
        });
    }

    function getSearch( data ) {
        data.length > 1 && data.forEach( function( item ) {
            bookmarks.search.push( JSON.parse( item ));
        });
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
                        <span class="name" id="' + id + '" class="waves-effect waves-block" style="background-color: ' + getBgColor( title ) + '">' + title + '</span>\
                        <span class="full">' + folder.title + '</span>\
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

    function countMaxWith() {
        var width = 0;
        $( '.folders .folder .full' ).map( function( idx, item ) {
            if ( $(item).text().length > width ) {
                width = $(item).text().length;
            }
        });
        var max = $('.folder').width() + width * 26;
        max > 450 && ( max = 450 );
        $( 'head' ).append( '<style type="text/css">.bm .folders:hover{width: '+ max +'px!important;overflow-y: auto!important;}</style>' );
    }

    function bmSearch( value ) {
        var match = [], html = "";
        bookmarks.all.forEach( function( item ) {
            if ( item.title.indexOf( value ) != -1 || item.url.indexOf( value ) != -1 ) {
                match.push( item );
                html += createResultTmpl( item );
            }
        });
        return { match: match, html: html };
    }

    function quickSearch( value, conditions ) {
        var match = [], html = "";
        bookmarks.search.forEach( function( item ) {
            if ( !conditions || ( conditions && item.key.indexOf( conditions ) != -1 )) {
                item.url = item.query.replace( "{query}", value );
                match.push( item );
                html += createResultTmpl( item );
            }
        });
        return { match: match, html: html };
    }

    function quickbarListen() {
        $( ".quickbar-overlay" ).on( "click", function( event ) {
            if ( event.target.className == "quickbar-overlay" ) {
                $( ".quickbar-overlay" ).animate({ opacity: 0 }, 500, function() {
                    $( ".quickbar-overlay" ).remove();
                });
            }
        });
        $( ".quickbar .search input" ).on( "keydown", function( event ) {
            var key     = event.keyCode,
                input   = event.currentTarget,
                cursor  = event.target.selectionStart,
                $target = $( ".quickbar .results" );
            if ( key == 40 ) {
                if ( !$target.find( ".result" ).hasClass( "active" )) {
                    $target.find( ".result:first-child" ).addClass( "active" );
                } else {
                    $target.find( ".result.active" ).removeClass( "active" ).next().addClass( "active" );
                    !$target.find( ".result" ).hasClass( "active" ) && $target.find( ".result:first-child" ).addClass( "active" );
                }
                setTimeout( function() { input.setSelectionRange( cursor, cursor ) }, 5 );
            } else if ( key == 38 ) {
                $target.find( ".result" ).hasClass( "active" ) &&
                    $target.find( ".result.active" ).removeClass( "active" ).prev().addClass( "active" );
                !$target.find( ".result" ).hasClass( "active" ) && $target.find( ".result:last-child" ).addClass( "active" );
                setTimeout( function() { input.setSelectionRange( cursor, cursor ) }, 5 );
            } else if ( key == 13 ) {
                $target.find( ".result" ).hasClass( "active" ) ?
                    $target.find( ".result.active" )[0].click()
                    : $target.find( ".result" )[0].click();
            }
        });
        $( ".quickbar .search input" ).on( "keyup", function( event ) {
            var value  = event.target.value,
                result = { match: [], html: "" },
                searchKey = /^[sS] /,
                subKey = /^\w /,
                key    = event.keyCode;
            if ( key == 38 || key == 40 || key == 13 ) return;
            if ( searchKey.test( value )) {
                var conditions;
                value = value.replace( searchKey, "" );
                if ( subKey.test( value ) ) {
                    var arr = value.match( subKey );
                    if ( arr && arr.length > 0 ) {
                        value      = value.replace( subKey, "" );
                        conditions = arr[0].trim();
                    }
                }
                result = quickSearch( value, conditions );
            } else if ( value != "" ) {
                result = bmSearch( event.target.value );
                $( ".quickbar .search" ).addClass( "fix" );
            } else {
                $( ".quickbar .search" ).removeClass( "fix" );
            }
            $( ".quickbar .results" ).html( result.html );
        });
    }

    function createResultTmpl( item ) {
        var tmpl    = '<a class="result" href="<%- url %>">\
                        <span class="avatar" style="background-color: <%- bgColor %>;"><%- avatar %></span>\
                        <div class="title"><%- title %></div>\
                    </a>',
            title   = item.title != "" ? item.title : item.url,
            url     = item.url,
            avatar  = fmtTitle( title ).substr( 0, 1 ),
            bgColor = item.color ? item.color : getBgColor( avatar );
            compiled= _.template( tmpl ),
            html    = compiled({ title: title, url: url, avatar: avatar, bgColor: bgColor });
        return html;
    }

    function openQuickbar() {
        if ( $( ".quickbar-overlay" ).length > 0 ) return;
        $( "body" ).append( '<div class="quickbar-overlay"><div class="quickbar"></div></div>' );
        setTimeout( function() {
            createQuickbar();
            quickbarListen();
        }, 10 );
    }

    function createQuickbar() {
        var tmpl = '\
                    <div class="search">\
                        <input type="text" placeholder="' + i18n.GetLang( "quickbar_input_placeholder" ) + '"/>\
                    </div>\
                    <div class="results"></div>\
                    ';
        $( ".quickbar" ).html( tmpl ).css( "opacity", 1 ).find( "input" ).focus();
    }

    return {
        Render: function( data ) {
            $( "body" ).append( '<div class="bm-overlay"><div class="bm"><div class="folders"></div><div class="files"></div></div></div>' );
            setTimeout( function() {
                bmListen();
                getSearch( data );
                getBookmarks();
                folderListen();
            }, 300 );
        },

        Listen: function() {
            !$( ".bm" ).hasClass( "open" ) ? open( 1 ) : close();
        },

        QuickbarListen: function() {
            openQuickbar();
        }
    }
});