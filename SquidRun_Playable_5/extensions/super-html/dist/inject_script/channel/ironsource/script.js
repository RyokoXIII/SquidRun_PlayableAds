"use strict";
//LOAD the game, but do not start it until the ad is visible
window.addEventListener("load", function () {
    super_check_channel_sdk(window.dapi);
    (dapi.isReady()) ? onReadyCallback() : dapi.addEventListener("ready", onReadyCallback);
    //here you can put other code that not related to presenting any media information - do not play any audio/video/images at this moment
    //use this to prepare your creative to be shown(i.e. do necessary calculations or pre-loads)
});
function onReadyCallback() {
    //no need to listen to this event anymore
    dapi.removeEventListener("ready", onReadyCallback);
    let isAudioEnabled = !!dapi.getAudioVolume();
    if (dapi.isViewable()) {
        adVisibleCallback({
            isViewable: true
        });
    }
    dapi.addEventListener("viewableChange", adVisibleCallback); //this event is used to know when the ad was visible/hidden
    dapi.addEventListener("adResized", adResizeCallback); //this event is used recalculate ad UI items(mostly upon rotation)
    dapi.addEventListener("audioVolumeChange", audioVolumeChangeCallback); //this event is used to get info about any volume state change
}
function startGame() {
    //start your game here
    var screenSize = dapi.getScreenSize();
    //(add your own code here)
    super_check_game();
}
function pauseGame() {
    //pause your game here(add your own code here)
}
function adVisibleCallback(event) {
    console.log("isViewable " + event.isViewable);
    if (event.isViewable) {
        screenSize = dapi.getScreenSize();
        //START or RESUME the ad (add your own code here)
        startGame(); //example of function that can be called to start game
    }
    else {
        //PAUSE the ad and MUTE sounds or DO nothing if creative hasnât been launched yet (add your own code here)
        pauseGame(); //example of function that can be called to pause game
    }
}
function adResizeCallback(event) {
    screenSize = event;
    console.log("ad was resized width " + event.width + " height " + event.height);
}
function audioVolumeChangeCallback(volume) {
    let isAudioEnabled = !!volume;
    if (isAudioEnabled) {
        //START or turn on the sound(add your own code here)
    }
    else {
        //PAUSE the turn off the sound(add your own code here)
    }
}
var super_ready_game = false;
function super_check_game() {
    if (super_ready_game) {
        console.log("[super-html] game start");
        super_boot_engine();
    }
    else {
        super_ready_game = true;
    }
}
window.super_html = {
    download: function () {
        console.log("[super-html] game download");
        dapi.openStoreUrl && dapi.openStoreUrl();
        ;
    },
    game_ready: function () {
        console.log("[super-html] game ready");
        super_check_game();
    },
    game_end: function () {
        console.log("[super-html] game end");
        window.gameEnd && window.gameEnd();
    },
    is_hide_download() {
        return false;
    }
};
