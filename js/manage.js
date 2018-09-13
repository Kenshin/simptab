
define([ "jquery", "lodash", "i18n", "vo", "date", "error" ], function( $, _, i18n, vo, date, SimpError ) {

    "use strict";

    var tmpl = '<div class="tabs">\
                    <div class="tab tab-active">收藏</div>\
                    <div class="tab">订阅</div>\
                </div>\
                <div class="album"></div>\
               ';

    return {
        Render: function () {
            var compiled = _.template( tmpl );
            $( "body" ).append( '<div class="manage-overlay"><div class="manage-bg"><div class="manage"></div></div></div>' );
            setTimeout( function() {
                $( ".manage-bg" ).addClass( "manage-bg-show" );
                $( ".manage" ).html( compiled );
            }, 10 );
        }
    };
});