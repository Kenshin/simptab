define([ "jquery", "lodash", "notify", "i18n", "files", "vo", "message", "options" ], function( $, _, Notify, i18n, files, vo, message, options ) {

    var current, base64,
        MAX     = 5,
        saveImg = function( url, cur_vo ) {
            files.GetDataURI( url ).then( function( result ) {
                files.DataURI( result );
                files.Add( vo.constructor.BACKGROUND, result )
                    .progress( function( result ) { console.log( "Write process:", result ); })
                    .fail(     function( result ) { console.log( "Write error: ", result );  })
                    .done( function( result ) {
                        console.log( "Write completed: ", result );
                        message.Publish( message.TYPE.UPDATE_CONTROLBAR, { url: url, info: cur_vo.info });
                        vo.cur = vo.Clone( cur_vo );
                        vo.Set( vo.cur );
                        console.log( "======= Current background download success.", vo )
                    });
            });
        };

    function open() {
        $( ".history" ).css({ "transform": "translateY(0px)", "opacity": 0.8 }).addClass( "open" );
    }

    function close() {
        $( ".history" ).css({ "transform": "translateY(-300px)", "opacity": 0 }).removeClass( "open" );
    }

    function listen() {
        $( ".history-overlay" ).mouseenter( function() {
            open();
        });
        $( ".history" ).mouseleave( function() {
            close();
        });
        $( ".history" ).on( "click", "img", function( event ) {
            var history = JSON.parse( localStorage[ "simptab-history" ] ),
                idx     = event.target.dataset.idx,
                item    = history[ idx ],
                url     = 'filesystem:' + chrome.extension.getURL( "/" ) + 'temporary/history-' + item.enddate + '.jpg';
            saveImg( url, item );
            current = idx;
            $( ".history img" ).removeClass( "active" );
            $( event.target ).addClass( "active" );
        });
    }

    function render() {
        var history  = JSON.parse( localStorage[ "simptab-history" ] || '[]' ),
            tmpl     = '<img data-idx="<%=idx%>" id="<%= history.enddate%>" src="filesystem:' + chrome.extension.getURL( "/" ) + 'temporary/history-' + '<%= history.enddate %>.jpg">',
            compiled = _.template( '<% jq.each( historys, function( idx, history ) { %>' + tmpl + '<% }); %>', { 'imports': { 'jq': jQuery }} ),
            html     = compiled({ 'historys': history });
        history.length == 0 && ( html = i18n.GetLang( "history_empty" ) )
        $( ".history" ).html( html );
    }

    return {
        DataURI: function( value ) {
            base64 = value;
        },

        Add: function( cur_vo ) {
            if ( !options.Storage.db.history ) { return; }
            var history = JSON.parse( localStorage[ "simptab-history" ] || '[]' );
            if ( history.length == MAX ) {
                var del = history[0].enddate;
                history = history.slice( 1 );
                files.DeleteAny( "history-" + del + ".jpg", function( url ) {
                    console.log( "History old background removed complete.", url )
                });
            }
            history.push( cur_vo );
            localStorage[ "simptab-history" ] = JSON.stringify( history );
            files
                .SaveBgfromURI( "history-" + cur_vo.enddate, base64 )
                .progress( function( result ) { console.log( "Write process:", result ); })
                .fail(     function( result ) { console.log( "Write error: ", result );  })
                .done( function() {
                    console.log( "History background saved complete." )
                    render();
                });
        },

        Get: function( type ) {
            if ( $( ".introjs-overlay, .welcome-overlay" ).length > 0 ) return;
            current  = $( ".history" ).find( "img.active" ).attr( "data-idx" );
            !current && ( current = $( ".history" ).find( "img[id=" + vo.cur.enddate + "]" ).attr("data-idx") );
            !current && ( current = 0 );
            type == "left" ? current-- : current++;
            console.log( "History current is ", current )
            if ( current < 0 ) {
                new Notify().Render( i18n.GetLang( "notify_history_min" ) );
                return;
            }
            if ( current > $( ".history" ).find( "img" ).length - 1 ) {
                new Notify().Render( i18n.GetLang( "notify_history_max" ) );
                return;
            }
            $( ".history img" )[current].click();
        },

        Init: function () {
            $( "body" ).append( '<div class="history-overlay"><div class="history"></div></div>' );
            setTimeout( function() {
                render();
                listen();
            }, 10 );
            message.Subscribe( message.TYPE.OPEN_HISTORY, function( event ) {
                !$( ".history" ).hasClass( "open" ) ? open() : close();
            });
        }
    }
});