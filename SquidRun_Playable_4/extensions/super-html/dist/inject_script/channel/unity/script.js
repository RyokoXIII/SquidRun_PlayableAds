"use strict";
// 实施一个函数以便在广告首次呈现时显示广告：
function onSdkReady() {
    // 广告容器的可见性状态发生变化时将触发 viewableChange 事件。
    // 添加一个 viewabilityChange 事件监听器，以便处理暂停和恢复： 
    mraid.addEventListener('viewableChange', viewableChangeHandler);
    // isViewable 方法返回广告容器是否在屏幕上可见。
    if (mraid.isViewable()) {
        // 如果广告容器可见，则播放广告：
        super_check_game();
    }
}
// 实施一个根据可见性处理暂停和恢复广告的函数：
function viewableChangeHandler(viewable) {
    //todo
    console.log("[super-html] viewableChangeHandler:" + viewable);
    if (viewable) {
        // 如果广告可见，则展示广告：
    }
    else {
        // 否则暂停广告。
    }
}
function super_check_game() {
    console.log("[super-html] game start");
    super_boot_engine();
}
window.super_html = {
    download: function () {
        console.log("[super-html] game download");
        super_check_url();
        var url = super_html.appstore_url;
        var userAgent = navigator.userAgent || navigator.vendor;
        if (/android/i.test(userAgent)) {
            url = super_html.google_play_url;
            ;
        }
        mraid.open(url);
    },
    game_ready: function () {
        console.log("[super-html] game ready");
        super_check_channel_sdk(window.mraid);
        if (mraid.getState() === 'loading') {
            // 如果 SDK 仍在加载，请添加 'ready' 事件监听器：
            mraid.addEventListener('ready', onSdkReady);
            // 否则，如果 SDK 已准备就绪，请执行您的函数：
        }
        else {
            onSdkReady();
        }
    },
    game_end: function () {
        console.log("[super-html] game end");
    },
    is_hide_download() {
        return false;
    }
};
