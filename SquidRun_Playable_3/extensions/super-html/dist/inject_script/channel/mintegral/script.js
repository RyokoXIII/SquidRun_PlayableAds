"use strict";
function gameStart() {
    console.log("[super-html] game start");
    super_boot_engine();
}
function gameClose() {
    //todo
}
window.super_html = {
    download: function () {
        console.log("[super-html] game download");
        window.install && window.install();
    },
    game_ready: function () {
        console.log("[super-html] game ready");
        window.gameReady && window.gameReady();
    },
    game_end: function () {
        console.log("[super-html] game end");
        window.gameEnd && window.gameEnd();
    },
    is_hide_download() {
        return false;
    }
};
