
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    var rTmpl = '\
                <div class="close"><span class="close"></span></div>\
                <div class="options">\
                    <div class="title">自定义站点（ Topsites ）</div>\
                    <div class="group custom-tp">' + customTpView() + '</div>\
                </div>\
                ',
        storage = ( function () {
            var key      = "simptab-options",
                _storage = {
                    version: "1.0.0",
                    topsites: {
                        enable: false,
                        custom: {},
                    }
                };

            function Storage() {
                this.db = localStorage[ key ];
                if ( !this.db ) {
                    this.db = $.extend( {}, _storage );
                    localStorage.setItem( key, JSON.stringify( this.db ));
                } else this.db = JSON.parse( this.db );
                this.key = key;
            }

            Storage.prototype.Set = function() {
                localStorage.setItem( key, JSON.stringify( this.db ));
            }

            Storage.prototype.Get = function() {
                return this.db;
            }

            Storage.prototype.Clear = function() {
                localStorage.removeItem( key );
            }

            return new Storage();

        })();

    function customTpView() {
        var tmpl = '<div class="switche">\
                        <div class="label">是否启用自定义站点功能？</div>\
                        ' + comps.Switches( "custom-tp-cbx" ) + '\
                   </div>\
                   <div class="custom-tp-fields">\
                        <textarea class="md-textarea"></textarea>\
                        <div class="notice">目前仅支持最大 9个网址，每行一个用小写 , 分隔 → simptab, http://ksria.com/simptab</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function customTpModel() {
        $( ".options .custom-tp" ).find( "input[id=custom-tp-cbx]" ).prop( "checked", storage.db.topsites.enable );
        storage.db.topsites.enable && $( ".options .custom-tp-fields" ).show();
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