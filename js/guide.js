
define([ "jquery", "mousetrap", "lodash", "notify", "i18n" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    var firstload = {
            bookmarks: true,
            noise    : true,
            setting  : true,
            zenmode  : true,
            history  : true,
            favorite : true,
            earth    : true,
        },
        intros,
        steps = {
            all : [
                {
                    intro: i18n.GetLang( "guide_all_start" )
                },
                {
                    intro: i18n.GetLang( "guide_all_intro" )
                },
                {
                    intro: i18n.GetLang( "guide_all_feature" )
                },
                {
                    element: $( '.controlbar' )[0],
                    intro: i18n.GetLang( "guide_all_controlbar" )
                },
                {
                    element: $( ".clock" )[0],
                    intro: i18n.GetLang( "guide_all_clock" )
                },
                {
                    intro: i18n.GetLang( "guide_all_setting" )
                },
                {
                    intro: i18n.GetLang( "guide_all_topsite" )
                },
                {
                    intro: i18n.GetLang( "guide_all_noise" )
                },
                {
                    intro: i18n.GetLang( "guide_all_bookmarks" )
                },
                {
                    intro: i18n.GetLang( "guide_all_quickbar" )
                },
                {
                    intro: i18n.GetLang( "guide_all_options" )
                },
                {
                    intro: i18n.GetLang( "guide_all_zenmode" )
                },
                {
                    intro: i18n.GetLang( "guide_all_end" )
                },
            ],
            noise: [
                {
                    intro: i18n.GetLang( "guide_noise" )
                },
            ],
            bookmarks: [
                {
                    intro: i18n.GetLang( "guide_bookmarks" )
                },
                {
                    intro: i18n.GetLang( "guide_quickbar" )
                },
            ],
            setting: [
                {
                    intro: i18n.GetLang( "guide_setting" )
                },
            ],
            favorite: [
                {
                    intro: i18n.GetLang( "guide_favorite" )
                },
            ],
            zenmode: [
                {
                    intro: i18n.GetLang( "guide_zenmode" )
                },
            ],
            earth: [
                {
                    intro: i18n.GetLang( "guide_earth" )
                },
            ],
            history: [
                {
                    intro: i18n.GetLang( "guide_history" )
                },
            ]
        };

    function init( introJs ) {
        intros = introJs();
        $( ".controlbar" ).attr( "data-hits", "controlbar" );
        $( ".clock"      ).attr( "data-hits", "clock" );
        $( ".bottom"     ).attr( "data-hits", "bottom" );
    }

    function render( id, auto_close ) {
        if ( i18n.GetShort() == "en" ) return;
        intros.setOptions({
            hintButtonLabel: "确认",
            nextLabel: "下一条 →",
            prevLabel: "← 上一条",
            skipLabel: "",
            doneLabel: "完成",
            hidePrev: true,
            hideNext: true,
            tooltipPosition: "auto",
            exitOnEsc: auto_close || false,
            exitOnOverlayClick: auto_close || false,
            overlayOpacity: 0.8,
            steps: steps[ id || "all" ],
        });
        intros.onbeforechange( function( target ) {
            var id = $( target ).data().hits;
            if ( id == "controlbar" ) {
                $(target).css({ "opacity": 1, width: "initial" });
            } else if ( id == "clock" ) {
                $( ".controlbar" ).removeAttr( "style" );
            } else if ( id == "bottom" ) {
                $(target).css({ "opacity": 1 });
            }
        });
        intros.onexit( function() {
            $( ".controlbar" ).removeAttr( "style" );
            $( ".bottom"     ).removeAttr( "style" );
        });
        /*
        intros.onchange( function( target ) {
            const id = $( target ).data().hits;
            if ( id == "controlbar" ) {
                $(target).css( "opacity", 1 );
            } else {
                $( '.controlbar[data-hits="controlbar"]' ).removeAttr( "style" );
            }
        });
        */
        intros.start();
    }

    function tips( id ) {
        if ( i18n.GetShort() == "en" ) return;
        if ( !firstload[id] ) return;
        if ( $( ".introjs-overlay" ).length > 0 ) return;
        if ( localStorage[ "simptab-" + id + "-notify" ] == "false" ) return;

        setTimeout( function() {
            render( id );
            $( ".introjs-tooltipbuttons" ).append( '<a class="introjs-button introjs-notshowbutton" role="button" tabindex="0">' + i18n.GetLang( "tips_confirm" ) + '</a>' );
            $( ".introjs-tooltipbuttons .introjs-notshowbutton" ).on( "click", function( evnt ) {
                localStorage[ "simptab-" + id + "-notify" ] = false;
                intros.exit();
            })
        }, 500 );
        firstload[id] = false;
    }

    function hints( root ) {
        if ( i18n.GetShort() == "en" ) return;
        var details = JSON.parse( localStorage["simptab-version-details"] || "{}" );
        if (  details.first ) return;
        if ( !details.items ) {
            details.items = [];
        }

        $( root ).find( 'div[version="' + details.update + '"]' ).map( function( idx, item ) {
            var $target = $( item ),
                id      = $target.attr( "version-item" );
            !details.items.includes( id ) &&
                $target.addClass( "new" ).append( '<a role="button" tabindex="0" class="introjs-hint"><div class="introjs-hint-dot"></div><div class="introjs-hint-pulse"></div></a>' );
        });
        $( root ).find( 'div[version="' + details.update + '"]' ).on( "click", function( event ) {
            var $target = $( event.currentTarget );
            if ( !$target.hasClass( "new" ) ) return;
            var id      = $target.attr( "version-item" );
            $target.removeClass( "new" ).find( "a[role=button]" ).remove();

            details.items.push( id );
            localStorage["simptab-version-details"] = JSON.stringify( details );
        });
    }

    return {
        Init      : init,
        Render    : render,
        Tips      : tips,
        Hints     : hints,
        FirstLoad : firstload,
    }

});