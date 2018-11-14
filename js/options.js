
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    var rTmpl = '\
                <div class="close"><span class="close"></span></div>\
                <div class="options">\
                    <div class="title">自定义站点（ Topsites ）</div>\
                    <div class="group custom-tp">' + customTpView() + '</div>\
                </div>\
                ';

    function customTpView() {
        var tmpl = '<div class="switche">\
                        <div class="label">是否启用自定义站点功能？</div>\
                        ' + comps.Switches( "custom-tp-cbx" ) + '\
                   </div>\
                   <textarea class="md-textarea custom-tp-fields"></textarea>\
                   ';

        return tmpl;
    }

    function customTpModel() {
        //$( ".options .custom-tp" ).find( "input[id=custom-tp-cbx]" ).prop( "checked", true );
        $( ".options" ).on( "change", ".custom-tp input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            value ? $( ".options .custom-tp-fields" ).slideDown() : $( ".options .custom-tp-fields" ).slideUp();
        });
    }

    function close() {
        $( ".dialog .close" ).click( function( event ) {
            $( ".dialog-bg" ).removeClass( "dialog-bg-show" );
            setTimeout( function() {
                $( ".dialog-overlay" ).remove();
            }, 400 );
        });
    }

    return {
        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                $( ".dialog" ).html( rTmpl );
                customTpModel();
                close();
            }, 10 );
        }
    }

});