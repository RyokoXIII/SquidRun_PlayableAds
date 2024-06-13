"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    package_name: "super-html",
    // debug = true 会让 min_css和min_js 都变为false
    is_debug: false,
    //混淆
    obfuscator: true,
    //这两个是默认开启的不给用户选
    is_min_css: true,
    is_min_js: true,
    // #### 静态配置
    // 注入jszip库
    inject_jszip_script: "inject_script/pako.js",
    // 注入通用脚本
    inject_common_script: "inject_script/common.js",
    // 注入版本适配相关
    inject_version_adapter: {
        "23x": [
            "inject_script/23x/custom-23x.js",
            "inject_script/23x/index-23x.js",
        ],
        "24x": [
            "inject_script/24x/custom-24x.js",
            "inject_script/24x/index-24x.js",
        ],
        "34x": [
            "inject_script/34x/custom-34x.js",
            "inject_script/34x/index-34x.js",
        ]
    },
    // 需要使用string编码的资源后缀
    string_type_extname_set: new Set([
        '.txt',
        '.xml',
        '.vsh',
        '.fsh',
        '.atlas',
        '.tmx',
        '.tsx',
        '.json',
        '.ExportJson',
        '.plist',
        '.fnt',
        '.js',
        ".zip"
    ]),
    // 打包，过滤的文件格式
    pack_filter_extname_set: new Set([
        ".ico",
        ".html",
        ".css",
        ".wasm"
    ]),
};
