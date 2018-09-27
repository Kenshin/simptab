
define([ "jquery" ], function( $ ) {

    "use strict";

    function i18n( value ) {
        return chrome.i18n.getMessage( value );
    }

    function controlbar() {
        $($( ".controlbar" ).children()[0]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_new_tab" ));
        $($( ".controlbar" ).children()[1]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_bookmarks" ));
        $($( ".controlbar" ).children()[2]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_history" ));
        $($( ".controlbar" ).children()[3]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_apps" ));
        $($( ".controlbar" ).children()[4]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_info" ));
        $($( ".controlbar" ).children()[5]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_download" ));
        $($( ".controlbar" ).children()[6]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_upload" ));
        $($( ".controlbar" ).children()[7]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_refresh" ));
        $($( ".controlbar" ).children()[8]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_setting" ));
        $( ".controlbar" ).find( "a[url=manage]" ).attr("data-balloon", i18n( "controlbar_manage" ));
        $( ".controlbar" ).find( "a[url=about]" ).attr("data-balloon", i18n( "controlbar_about" ));
        $($( ".controlbar" ).children()[9]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_favorite" ));
        $($( ".controlbar" ).children()[10]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_pin" ));
        $($( ".controlbar" ).children()[11]).find( "a[data-balloon]" ).attr("data-balloon", i18n( "controlbar_dislike" ));
    }

    function setting() {

        $($( ".changestate" ).find("label")[0]).text( i18n( "setting_background_every_day" ));
        $($( ".changestate" ).find("label" )[1]).text( i18n( "setting_background_every_time" ));
        $($( ".changestate" ).find("label" )[2]).text( i18n( "setting_background_forever" ));

        $($( ".positionstate" ).find("label:first")).text( i18n( "setting_background_position_center" ));
        $($( ".positionstate" ).find("label" )[1]).text( i18n( "setting_background_position_corner" ));
        $($( ".positionstate" ).find("label" )[2]).text( i18n( "setting_background_position_mask" ));

        $($( ".clockstate" ).find("label:first")).text( i18n( "setting_show_clock" ));
        $($( ".clockstate" ).find("label:last" )).text( i18n( "setting_hide_clock" ));

        $.each( $(".originstate .lineradio").find("label"), function( idx, item ) {
            $(item).text( i18n( "setting_multi_origin_" + idx ));
        });

        $($( ".bmstate" ).find("label")).text( i18n( "setting_bm_state" ));

        $($( ".tsstate" ).find("label:eq(0)")).text( i18n( "setting_ts_state_normal" ));
        $($( ".tsstate" ).find("label:eq(1)")).text( i18n( "setting_ts_state_simple" ));
        $($( ".tsstate" ).find("label:eq(2)")).text( i18n( "setting_ts_state_senior" ));

        $($(".setting .contact").find("a")[0]).attr( "title", i18n( "setting_contact_weibo" ));
        $($(".setting .contact").find("a")[1]).attr( "title", i18n( "setting_contact_twitter" ));
        $($(".setting .contact").find("a")[2]).attr( "title", i18n( "setting_contact_facebook" ));
        $($(".setting .contact").find("a")[3]).attr( "title", i18n( "setting_contact_gplus" ));
        $($(".setting .contact").find("a")[4]).attr( "title", i18n( "setting_contact_me" ));

        $.each( $(".pinstate section"), function( idx, item ) {
            $(item).attr( "data-balloon", i18n( "setting_pin_tooltip" ).replace( "#1", $(item).attr( "data-balloon" ) ) );
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

        GetShort: function() {
            return i18n( "lang" );
        },

        GetControlbarLang: function( lang ) {
            return i18n( "controlbar_" + lang );
        },

        GetLang: function( key ) {
            return i18n( key );
        }

    };
});
