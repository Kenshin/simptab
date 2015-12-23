
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
    }

    function setting() {
        $($( ".lineradio" ).find("label")[0]).text( i18n( "setting_background_every_day" ));
        $($( ".lineradio" ).find("label")[1]).text( i18n( "setting_background_every_time" ));
        $($( ".lineradio" ).find("label")[2]).text( i18n( "setting_show_clock" ));
        $($( ".lineradio" ).find("label")[3]).text( i18n( "setting_hide_clock" ));

        $($( ".lineradio" ).find("label")[4]).text( i18n( "setting_multi_origin_0" ));
        $($( ".lineradio" ).find("label")[5]).text( i18n( "setting_multi_origin_1" ));
        $($( ".lineradio" ).find("label")[6]).text( i18n( "setting_multi_origin_2" ));
        $($( ".lineradio" ).find("label")[7]).text( i18n( "setting_multi_origin_3" ));
        $($( ".lineradio" ).find("label")[8]).text( i18n( "setting_multi_origin_4" ));
        $($( ".lineradio" ).find("label")[9]).text( i18n( "setting_multi_origin_5" ));
        $($( ".lineradio" ).find("label")[10]).text( i18n( "setting_multi_origin_6" ));
        $($( ".lineradio" ).find("label")[11]).text( i18n( "setting_multi_origin_7" ));
        $($( ".lineradio" ).find("label")[12]).text( i18n( "setting_multi_origin_8" ));

        $($( ".lineradio" ).find("label")[13]).text( i18n( "setting_ts_state_normal" ));
        $($( ".lineradio" ).find("label")[14]).text( i18n( "setting_ts_state_simple" ));
        $($( ".lineradio" ).find("label")[15]).text( i18n( "setting_ts_state_senior" ));

        $($(".setting .contact").find("a")[0]).attr( "title", i18n( "setting_contact_weibo" ));
        $($(".setting .contact").find("a")[1]).attr( "title", i18n( "setting_contact_twitter" ));
        $($(".setting .contact").find("a")[2]).attr( "title", i18n( "setting_contact_facebook" ));
        $($(".setting .contact").find("a")[3]).attr( "title", i18n( "setting_contact_gplus" ));
        $($(".setting .contact").find("a")[4]).attr( "title", i18n( "setting_contact_me" ));
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
