
define([ "jquery", "lodash", "i18n", "vo", "date", "error", "files" ], function( $, _, i18n, vo, date, SimpError, files ) {

    "use strict";

    var tmpl = '<div class="tabs">\
                    <div class="tab tab-active" idx="0">' + i18n.GetLang( "manage_tab_fav" ) + '</div>\
                    <div class="tab" idx="1">' + i18n.GetLang( "manage_tab_sub" ) + '</div>\
                </div>\
                <div class="albums">\
                    <div class="album favorite album-active">Loading...</div>\
                    <div class="album subscribe"></div>\
                </div>\
               ',
        album = '<div class="photograph">\
                    <img src=<%- album %>>\
                    <ul class="toolbox">\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_use"    ) + '" data-balloon-pos="up" class="useicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_down"   ) + '" data-balloon-pos="up" class="downicon"></span></li>\
                        <li><span data-balloon="' + i18n.GetLang( "manage_toolbar_remove" ) + '" data-balloon-pos="up" class="removeicon"></span></li>\
                    </ul>\
                </div>';

    function tabListenEvent() {
        $( ".manage .tab" ).click( function( event ) {
            var $target = $( event.target ),
                idx     = $target.attr( "idx" );
            $( ".manage .tab" ).removeClass( "tab-active" );
            $target.addClass( "tab-active" );

            $( ".manage .album" ).removeClass( "album-active" );
            $( $( ".manage .album" )[idx] ).addClass( "album-active" );
        });
    }

    function getFavoriteTmpl() {
        files.List( function( result ) {
            var compiled = _.template( '<% jq.each( albums, function( idx, album ) { %>' + album + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                html     = compiled({ 'albums': result });
            $( ".manage .albums .favorite" ).html( html );
        });
    }

    return {
        Render: function () {
            var compiled = _.template( tmpl ),
                html     = compiled();

            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( html );
                tabListenEvent();
                getFavoriteTmpl();
            }, 10 );
        }
    };
});