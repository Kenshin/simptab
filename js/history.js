define([ "jquery", "lodash", "notify", "i18n", "files", "vo", "message" ], function( $, _, Notify, i18n, files, vo, message ) {

    var current, base64;

    return {
        DataURI: function( value ) {
            base64 = value;
        },

        Add: function () {
            var MAX     = 5,
                history = JSON.parse( localStorage[ "simptab-history" ] || '[]' ),
                idx     = vo.new.enddate;
            if ( history.length == MAX ) {
                var del = history[0].enddate;
                history = history.slice( 1 );
                files.DeleteAny( "history-" + del + ".jpg", function( url ) {
                    console.log( "History old background removed complete.", url )
                });
            }
            history.push( vo.new );
            localStorage[ "simptab-history" ] = JSON.stringify( history );
            files
                .SaveBgfromURI( "history-" + vo.new.enddate, base64 )
                .progress( function( result ) { console.log( "Write process:", result ); })
                .fail(     function( result ) { console.log( "Write error: ", result );  })
                .done( function( result ) {
                    console.log( "History background saved complete." )
                });
        },

        Get: function( type ) {
            var MAX       = 5,
                history   = JSON.parse( localStorage[ "simptab-history" ] ),
                idx       = current == undefined ? MAX : current,
                saveImg   = function( url, info ) {
                    files.GetDataURI( url ).then( function( result ) {
                        files.DataURI( result );
                        files.Add( vo.constructor.BACKGROUND, result )
                            .progress( function( result ) { console.log( "Write process:", result ); })
                            .fail(     function( result ) { console.log( "Write error: ", result );  })
                            .done( function( result ) {
                                console.log( "Write completed: ", result );
                                message.Publish( message.TYPE.UPDATE_CONTROLBAR, { url: url, info: info });
                                console.log( "======= Current background download success.", vo )
                            });
                    });
                };
            type == "left" ? idx-- : idx++;
            if ( idx < 0 ) {
                current = 0;
                new Notify().Render( "当前已经是最后一张了。" );
                return;
            }
            if ( idx > 4 ) {
                current = 4;
                new Notify().Render( "当前已经是最新一张了。" );
                return;
            }
            var item = history[ idx ],
                url  = 'filesystem:' + chrome.extension.getURL( "/" ) + 'temporary/history-' + item.enddate + '.jpg';
            saveImg( url, item.info );
            current = idx;
        }
    }
});