"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const utils_1 = __importDefault(require("../common/utils"));
const log_1 = __importDefault(require("../common/log"));
const clean_css = require("clean-css");
class html_handler {
    // 步骤：处理 html
    run(s_dir_path, b_min_css) {
        const s_html_path = path.join(s_dir_path, "index.html");
        // html
        let s_html_content = utils_1.default.read_file_toString(s_html_path);
        //提取html中的css文件
        var reg = /type="text\/css" href="(.*)"/;
        let path_css = null;
        try {
            const list = reg.exec(s_html_content);
            if (list && list[1]) {
                path_css = path.join(s_dir_path, list[1].trim());
            }
        }
        catch (error) {
            log_1.default.error("未识别到html中的css文件，可能会有异常");
        }
        s_html_content = s_html_content.replace(/ *<!--.*-->/g, "");
        s_html_content = s_html_content.replace(/<link rel="stylesheet".*\/>/gs, "");
        s_html_content = s_html_content.replace(/<script.*<\/script>/gs, "");
        //正则删除空行
        s_html_content = s_html_content.replace(/\n\s*\n/g, "\n");
        // css
        if (path_css) {
            let s_css_content = this.red_css(s_dir_path, path_css);
            if (b_min_css) {
                s_css_content = new clean_css().minify(s_css_content).styles;
            }
            s_css_content = `<style>\n${s_css_content}</style>`;
            s_html_content = s_html_content.replace(/<\/head>/, `${s_css_content}\n</head>`);
        }
        return s_html_content;
    }
    red_css(s_dir_path, s_css_path) {
        let s_css = utils_1.default.read_file_toString(s_css_path);
        //提取html中的css文件
        var reg = /url\((.*)\)/;
        try {
            const list = reg.exec(s_css);
            if (list && list[1]) {
                const trim = list[1].trim();
                const base64 = utils_1.default.read_file_base64(path.join(s_dir_path, trim));
                s_css = s_css.replace(trim, base64);
            }
        }
        catch (error) {
            log_1.default.log("no find css", error);
        }
        return s_css;
    }
}
exports.default = new html_handler();
