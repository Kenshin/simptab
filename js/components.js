
define([ "jquery", "mousetrap", "lodash", "notify", "i18n", "vo", "date" ], function( $, Mousetrap, _, Notify, i18n, vo, date ) {

    return {
        Switches: function( cls ) {
            return '<div class="' + cls + '">\
                        <input type="checkbox" id="' + cls + '" style="display:none;"/>\
                        <label for="' + cls + '" class="toggle"><span></span></label>\
                    </div>';
        },

        Dropdown: function( target, cls, items, label ) {
            var tmpl     = '<div class="list-filed" value="<%- item.value %>"><%- item.name %></div>',
                compiled = _.template( '<% jq.each( items, function( idx, item ) { %>' + tmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
                html     = compiled({ 'items': items }),
                current  = items.find( function( item ) { return item.value == label });

            target = target + " ." + cls;
            $( document ).on( "click", target, function( event ) {
                $( target ).find( ".downlist" ).css({ "opacity": 1, transform: "scaleY(1)" });
            });
            $( document ).on( "click", target + " .downlist .list-filed", function( event ) {
                var name  = event.target.textContent,
                    value = $(event.target).attr( "value" );
                $( target ).find( ".drop .label" ).text( name );
                $( target ).find( ".downlist" ).css({ "opacity": 0, transform: "scaleY(0)" });
                var evt  = new Event( "dropdown" );
                evt.data = { name: name, value: value };
                $( target )[0].dispatchEvent( evt );
                event.stopPropagation();
            });

            return '<div class="dropdown ' + cls + '">\
                        <div class="drop">\
                            <div class="label">' + current.name + '</div>\
                            <div class="arrow"></div>\
                        </div>\
                        <div class="downlist">\
                            ' + html + '\
                        </div>\
                    </div>';
        },

        Slider: function( min, max, value, cls ) {
            var target   = ".md-slider-root ." + cls,
                tmpl     = '<input type="range" min="<%- min %>" max="<%- max %>" value="<%- value %>" class="md-slider <%- cls %>" id="<%- cls %>">',
                compiled = _.template( tmpl );
                html     = compiled({ min: min, max: max, value: value, cls: cls }),
                lineWidth= function ( $target, value ) {
                    var maxWidth = $target.width(),
                        perc     = ( max - value ) / ( max - min ),
                        width    = maxWidth - ( maxWidth * perc );
                    value == max && ( width = maxWidth - 20 );
                    $target.next().width( width );
                },
                isDrag = false;

            setTimeout( function () {
                lineWidth( $( target ), value );
            }, 100 );

            $( document ).on( "mousedown", target, function( event ) { isDrag = true  });
            $( document ).on( "mouseup",   target, function( event ) { isDrag = false });
            $( document ).on( "mousemove", target, function( event ) {
                isDrag && lineWidth( $( target ), $( target ).val() );
            });
            $( document ).on( "change",    target, function( event ) {
                lineWidth( $( event.target ), event.target.value );

                var evt  = new Event( "slider" );
                evt.data = event.target.value;
                $( target )[0].dispatchEvent( evt );
                event.stopPropagation();
            });

            return '<div class="md-slider-root">\
                       ' + html + '\
                       <div class="md-slider-bar"></div>\
                   </div>';
        }
    }
});