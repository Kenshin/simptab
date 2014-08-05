
define([ "jquery" ], function( $ ) {

    i18n = function( value ) {
        return chrome.i18n.getMessage( value );
    }

    controlbar = function () {
        $($( ".controlbar" ).children()[0]).find( ".tooltip" ).text( i18n( "controlbar_bookmarks" ));
        $($( ".controlbar" ).children()[1]).find( ".tooltip" ).text( i18n( "controlbar_history" ));
        $($( ".controlbar" ).children()[2]).find( ".tooltip" ).text( i18n( "controlbar_apps" ));
        $($( ".controlbar" ).children()[3]).find( ".tooltip" ).text( i18n( "controlbar_info" ));
        $($( ".controlbar" ).children()[4]).find( ".tooltip" ).text( i18n( "controlbar_download" ));
        $($( ".controlbar" ).children()[5]).find( ".tooltip" ).text( i18n( "controlbar_setting" ));
    }

    setting = function () {
        $($( ".lineradio" ).find("label")[0]).text( i18n( "setting_background_every_day" ));
        $($( ".lineradio" ).find("label")[1]).text( i18n( "setting_background_every_time" ));
        $($( ".lineradio" ).find("label")[2]).text( i18n( "setting_show_clock" ));
        $($( ".lineradio" ).find("label")[3]).text( i18n( "setting_hide_clock" ));

        $($(".setting .contact").find("a")[0]).attr( "title", i18n( "setting_contact_weibo" ));
        $($(".setting .contact").find("a")[1]).attr( "title", i18n( "setting_contact_me" ));
    }

    return {
        Init: function () {
            controlbar();
            setting();
        },

        GetSettingWidth: function () {
            return i18n( "setting_width" );
        }
    }
});
