"use strict";
window.super_html = {
    download: function () {
        console.log("[super-html] game download");
        window.openAppStore() && window.openAppStore();
    },
    game_ready: function () {
        console.log("[super-html] game ready");
        super_check_channel_sdk(window.openAppStore);
        super_boot_engine();
    },
    game_end: function () {
        console.log("[super-html] game end");
    },
    is_hide_download() {
        return false;
    }
};
