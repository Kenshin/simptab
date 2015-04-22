
define([ "jquery" ], function( $ ) {

    "use strict";

    /*
    * Value:
    * - title   ( string, optional, if value is "" not show.)
    * - content ( string, required)
    * - closed  ( boolean, optional, if value is "" not show.)
    *           ( when value is true, notify box show always, when value is false notify hidden after 1 minute. )
    * - type    ( int, MESSAGE/WARING/ERROR)
    *           ( optional, default is MESSAGE )
    *
    * Param:
    * - string：
    *   - 1：content
    *   - 2：type content
    *   - 3：type title content
    *   - 4：type title content closed
    * - object
    *   - { type: xxx, title: xxx, content: xxx, close: true/false   }
    *
    */
    var VERSION = "1.0",
        num     = 0,
        MESSAGE = 0,
        WARNING = 1,
        ERROR   = 2,
        options = {
            title   : "",
            content : "",
            closed  : false,
            type    : MESSAGE,
            version : VERSION
        },
        $container = $( ".notifygp" ),
        TMPL = '\
        <div class="notify">\
            <a href="#" class="close"><span></span></a>\
            <div class="title">SimpTab has update.</div>\
            <div class="content">New version changlog here.</div>\
        </div>',
        closeHandle = function( event ) {
            var self = $(this).parent();
            $container.undelegate( "." + event.data + " .close", "click", closeHandle );
            self.hide( 500, function() { self.remove(); });
        },
        render = function() {
            var $tmpl    = $( TMPL ),
                $title   = $tmpl.find(".title"),
                $content = $tmpl.find(".content"),
                $close   = $tmpl.find(".close"),
                item     = "notify-item-" + num++;

            this.title   ? $title.text( this.title )     : $title.hide();
            this.content ? $content.text( this.content ) : $content.hide();
            this.closed  ? $container.delegate( "." + item + " .close", "click", item, closeHandle ) :  $close.hide();

            $tmpl.addClass( item );
            $container.append( $tmpl[0].outerHTML );
        };

    function Notify() {}

    Notify.prototype.title   = options.title;
    Notify.prototype.content = options.content;
    Notify.prototype.closed  = options.closed;
    Notify.prototype.type    = options.type;

    Notify.prototype.Render  = function () {

        var self = this;

        if ( arguments.length === 1 && typeof arguments[0] === "object" ) {
            options = arguments[0];

            Object.keys( options ).forEach( function( item ) {
                self[item] = options[item];
            });

            render.bind( self )();
        }
        else if ( typeof arguments[0] !== "object" && arguments.length < 5 ) {
            switch ( arguments.length ) {
                case 1:
                    this.content = arguments[0];
                    break;
                case 2:
                    this.type    = arguments[0];
                    this.content = arguments[1];
                    break;
                case 3:
                    this.type    = arguments[0];
                    this.title   = arguments[1];
                    this.content = arguments[2];
                    break;
                case 4:
                    this.type    = arguments[0];
                    this.title   = arguments[1];
                    this.content = arguments[2];
                    this.closed  = arguments[3];
                    break;
            }
            render.bind( self )();
        }
        else {
            console.error( "Arguments not empty." );
        }
    };

    return Notify;

});
