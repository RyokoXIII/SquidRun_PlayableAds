"use strict";
(function () {
    function super_load_zip() {
        console.log("[super-html] unzip");
        console.time("[super-html] unzip");
        window.__res = window.__res || {};
        const zip = new JSZip();
        let progress = 0;
        zip.loadAsync(window.__zip, {
            base64: true
        }).then(function (zip) {
            for (var filePath in zip.files) {
                if (zip.files[filePath].dir)
                    continue;
                progress++;
                // console.log(filePath, type);
                let key = filePath;
                zip.file(key).async("string").then(function (data) {
                    window.__res[key] = data;
                    progress--;
                    if (progress == 0) {
                        console.timeEnd("[super-html] unzip");
                        super_load_res();
                    }
                });
            }
            ;
        }).catch((err) => {
            throw err;
        });
    }
    function super_load_res() {
        window.__js = {};
        for (var filePath in window.__res) {
            let suffix = filePath.split(".");
            suffix = "." + suffix[suffix.length - 1];
            if (suffix == ".js") {
                window.__js[filePath] = window.__res[filePath];
            }
        }
        super_boot();
    }
    //资源准备就绪，准备启动
    function super_boot() {
        console.log("[super-html] boot ");
        super_load_vconsole();
        if (window.super_html && super_html.game_ready) {
            //等待平台回调开始回调
            super_html.game_ready();
        }
        else {
            super_boot_engine();
        }
    }
    //准备资源
    function super_pre_res() {
        console.timeEnd("[super-html] load html");
        console.log("[super-html] load res");
        if (!window["JSZip"]) {
            super_load_res();
            return;
        }
        super_load_zip();
    }
    super_pre_res();
})();
