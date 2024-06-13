"use strict";
function super_load_vconsole() {
    var s_file = "vconsole.min.js";
    if (window.__js[s_file]) {
        eval(window.__js[s_file]);
        delete window.__js[s_file];
        window.VConsole && (window.vConsole = new VConsole());
    }
}
;
function super_check_channel_sdk(sdk) {
    if (!sdk) {
        console.error("[super-html] Unable to run, please run on {" + window.super_html_channel + "}");
    }
}
function super_check_url() {
    if (!super_html.appstore_url) {
        console.error("[super-html] not set appstore_url");
    }
    if (!super_html.google_play_url) {
        console.error("[super-html] not set google_play_url");
    }
}
