
define([ "jquery" ], function( $ ) {

    "use strict";

    /*
    *
    *
    */
    var VERSION = "1.0",
        MESSAGE = 0,
        WARING  = 1,
        ERROR   = 2,
        options = {
            title   : "",
            content : "",
            closed  : false,
            type    : MESSAGE,
            version : VERSION
        },
        TMPL = '\
        <div class="notify">\
            <a href="#" class="close"><span></span></a>\
            <div class="title">SimpTab has update.</div>\
            <div class="content">New version changlog here.</div>\
        </div>',
        render = function() {
            var $tmpl    = $( TMPL ),
                $title   = $tmpl.find(".title"),
                $content = $tmpl.find(".content"),
                $close   = $tmpl.find(".close");

            this.title   ? $title.text( this.title )     : $title.hide();
            this.content ? $content.text( this.content ) : $content.hide();
            if ( !this.closed ) $close.hide();

            $( ".message" ).append( $tmpl[0].outerHTML );
        };

    function Notify() {}

    Notify.prototype.title   = options.title;
    Notify.prototype.content = options.content;
    Notify.prototype.closed  = options.closed;
    Notify.prototype.type    = options.type;

    Notify.prototype.Render  = function () {

        if ( arguments.length === 1 && typeof arguments[0] === "object" && arguments[0].length === 4 ) {
            options = arguments[0];
            render.bind( this )();
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
            render.bind( this )();
        }
        else {
            console.error( "Arguments not empty." );
        }
    };

    return Notify;

});
