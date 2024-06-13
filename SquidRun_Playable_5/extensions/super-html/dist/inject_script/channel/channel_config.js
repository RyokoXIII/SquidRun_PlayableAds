"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class {
    constructor() {
        // 注入渠道适配相关
        this.inject_channel_adapter = [
            {
                s_name: "default",
                b_enable: true,
            },
            {
                s_name: "default_min",
                b_enable: true,
                b_html_compression: true
            },
            {
                s_name: "applovin",
                b_enable: true,
                b_html_compression: true
            },
            {
                s_name: "ironsource",
                b_enable: true,
                b_html_compression: true
            },
            {
                s_name: "mintegral",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "index.zip",
            },
            {
                s_name: "unity",
                b_enable: true,
                b_html_compression: true
            },
            {
                s_name: "google",
                s_config_name: "google_portrait",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "google_portrait.zip",
            },
            {
                s_name: "google",
                s_config_name: "google_landscape",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "google_landscape.zip",
            },
            {
                s_name: "facebook",
                s_config_name: "facebook",
                b_enable: true,
                b_html_compression: true,
                s_html_name: "index.html",
            },
            {
                s_name: "pangle",
                s_config_name: "pangle",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "pangle.zip",
            },
            {
                s_name: "pangle",
                s_config_name: "pangle_portrait",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "pangle_portrait.zip",
            },
            {
                s_name: "pangle",
                s_config_name: "pangle_landscape",
                b_enable: true,
                b_html_compression: false,
                s_html_name: "index.html",
                b_out_zip: true,
                s_zip_name: "pangle_landscape.zip",
            },
        ];
    }
};
