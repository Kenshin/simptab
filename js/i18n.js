
define([ "jquery" ], function( $ ) {

    "use strict";

    function i18n( value ) {
        return chrome.i18n.getMessage( value );
    }

    function controlbar() {
        $($( ".controlbar" ).children()[0]).find( ".tooltip" ).text( i18n( "controlbar_bookmarks" ));
        $($( ".controlbar" ).children()[1]).find( ".tooltip" ).text( i18n( "controlbar_history" ));
        $($( ".controlbar" ).children()[2]).find( ".tooltip" ).text( i18n( "controlbar_apps" ));
        $($( ".controlbar" ).children()[3]).find( ".tooltip" ).text( i18n( "controlbar_info" ));
        $($( ".controlbar" ).children()[4]).find( ".tooltip" ).text( i18n( "controlbar_download" ));
        $($( ".controlbar" ).children()[5]).find( ".tooltip" ).text( i18n( "controlbar_upload" ));
        $($( ".controlbar" ).children()[6]).find( ".tooltip" ).text( i18n( "controlbar_setting" ));
        $($( ".controlbar" ).children()[7]).find( ".tooltip" ).text( i18n( "controlbar_favorite" ));
        $($( ".controlbar" ).children()[8]).find( ".tooltip" ).text( i18n( "controlbar_dislike" ));
        $($( ".controlbar" ).children()[9]).find( ".tooltip" ).text( i18n( "controlbar_pin" ));
    }

    function setting() {

        $($( ".changestate" ).find("label:first")).text( i18n( "setting_background_every_day" ));
        $($( ".changestate" ).find("label:last" )).text( i18n( "setting_background_every_time" ));

        $($( ".positionstate" ).find("label:first")).text( i18n( "setting_background_position_center" ));
        $($( ".positionstate" ).find("label:last" )).text( i18n( "setting_background_position_corner" ));

        $($( ".clockstate" ).find("label:first")).text( i18n( "setting_show_clock" ));
        $($( ".clockstate" ).find("label:last" )).text( i18n( "setting_hide_clock" ));

        $.each( $(".originstate .lineradio").find("label"), function( idx, item ) {
            $(item).text( i18n( "setting_multi_origin_" + idx ));
        });

        $($( ".tsstate" ).find("label:eq(0)")).text( i18n( "setting_ts_state_normal" ));
        $($( ".tsstate" ).find("label:eq(1)")).text( i18n( "setting_ts_state_simple" ));
        $($( ".tsstate" ).find("label:eq(2)")).text( i18n( "setting_ts_state_senior" ));

        $($(".setting .contact").find("a")[0]).attr( "title", i18n( "setting_contact_weibo" ));
        $($(".setting .contact").find("a")[1]).attr( "title", i18n( "setting_contact_twitter" ));
        $($(".setting .contact").find("a")[2]).attr( "title", i18n( "setting_contact_facebook" ));
        $($(".setting .contact").find("a")[3]).attr( "title", i18n( "setting_contact_gplus" ));
        $($(".setting .contact").find("a")[4]).attr( "title", i18n( "setting_contact_me" ));

        $.each( $(".pinstate .tooltip-top").find("input"), function( idx, item ) {
            $(item).parent().parent().attr( "data-tooltip", i18n( "setting_pin_tooltip" ).replace( "#1", $(item).val() / 60 ) );
        });

    }

    function main() {
        document.title = i18n( "title" );
    }

    return {
        Init: function () {
            controlbar();
            setting();
            main();
        },

        GetSettingWidth: function () {
            return i18n( "setting_width" );
        },

        GetLocale: function() {
            return i18n( "locales" );
        },

        GetControlbarLang: function( lang ) {
            return i18n( "controlbar_" + lang );
        },

        GetLang: function( key ) {
            return i18n( key );
        }

    };
});
