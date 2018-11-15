
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "comps" ], function( $, Mousetrap, _, Notify, i18n, comps ) {

    "use strict";

    /*********************************************
     * Data Structure
     *********************************************/

    var rTmpl = '\
                <div class="close"><span class="close"></span></div>\
                <div class="options">\
                    <div class="content">\
                        <div class="title">自定义样式（ 全局 ）</div>\
                        <div class="group custom-style">' + customStyleView() + '</div>\
                        <div class="title">自定义站点（ Topsites ）</div>\
                        <div class="group custom-tp">' + customTpView() + '</div>\
                    </div>\
                    ' + footerView() + '\
            </div>\
                ',
        storage = ( function () {
            var key      = "simptab-options",
                _storage = {
                    version: chrome.runtime.getManifest().version,
                    topsites: {
                        enable: false,
                        custom: "",
                    },
                    css: ""
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

    /*********************************************
     * Custom style
     *********************************************/

    function customStyleView() {
        var tmpl = '<textarea class="md-textarea"></textarea>';
        return tmpl;
    }

    function customStyleModel() {
        $( ".options .custom-style" ).find( "textarea" ).text( storage.db.css );
        $( ".options" ).on( "keyup", ".custom-style textarea", function( event ) {
            storage.db.css = event.target.value;
            storage.Set();
            custom();
        });
    }

    function custom() {
        if ( $( "#simptab-options" ).length >= 0 ) $( "#simptab-options" ).remove();
        $( "head" ).append( '<style id="simptab-options" type="text/css">' + storage.db.css + '</style>' );
    }

    /*********************************************
     * Custom topsites
     *********************************************/

    function customTpView() {
        var tmpl = '<div class="switche">\
                        <div class="label">是否启用自定义站点功能？</div>\
                        ' + comps.Switches( "custom-tp-cbx" ) + '\
                   </div>\
                   <div class="custom-tp-fields">\
                        <textarea class="md-textarea"></textarea>\
                        <div class="notice">目前仅支持最多九个网址，每行一个用小写 , 分隔 → simptab, http://ksria.com/simptab</div>\
                   </div>\
                   ';
        return tmpl;
    }

    function customTpModel() {
        var textareaState = function( state ) {
            state ? $( ".options .custom-tp-fields" ).removeClass( "hide" ).addClass( "show" ) : $( ".options .custom-tp-fields" ).removeClass( "show" ).addClass( "hide" );
        };
        $( ".options .custom-tp" ).find( "input[id=custom-tp-cbx]" ).prop( "checked", storage.db.topsites.enable );
        $( ".options .custom-tp" ).find( "textarea" ).text( storage.db.topsites.custom );
        textareaState( storage.db.topsites.enable );
        $( ".options" ).on( "change", ".custom-tp input", function( event ) {
            var $cb   = $(this),
                value = $cb.prop( "checked" );
            $cb.val( value );
            textareaState( value );
            storage.db.topsites.enable = value;
            storage.Set();
        });
        $( ".options" ).on( "keyup", ".custom-tp textarea", function( event ) {
            storage.db.topsites.custom = event.target.value;
            storage.Set();
        });
    }

    /*********************************************
     * Footer
     *********************************************/

    function footerView() {
        var tmpl = '<div class="footer">\
                        <div class="waves-effect button import">' + i18n.GetLang( "zen_mode_setting_import" ) + '</div>\
                        <div class="waves-effect button export">' + i18n.GetLang( "zen_mode_setting_export" ) + '</div>\
                        <div class="waves-effect button clear">恢复初始值</div>\
                   </div>\
                   ';
        return tmpl;
    }

    /*********************************************
     * Dialog
     *********************************************/

    function render() {
        $( ".dialog" ).html( rTmpl );
        customTpModel();
        customStyleModel();
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
        Init: function() {
            storage.db.css != "" && custom();
        },

        Render: function() {
            $( "body" ).append( '<div class="dialog-overlay"><div class="dialog-bg"><div class="dialog"></div></div></div>' );
            setTimeout( function() {
                $( ".dialog-bg" ).addClass( "dialog-bg-show" );
                render();
                close();
            }, 10 );
        },

        Storage: storage,
    }

});