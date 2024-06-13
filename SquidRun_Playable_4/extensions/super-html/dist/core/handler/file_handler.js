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
const config_1 = __importDefault(require("../config"));
const js_handler_1 = __importDefault(require("./js_handler"));
class file_handler {
    /** 计算压缩率 */
    run(s_dir_path, b_obfuscator) {
        const l_path = this.get_all_file_path(s_dir_path, config_1.default.pack_filter_extname_set);
        let d_res_mapping = {};
        for (let i = 0; i < l_path.length; i++) {
            let filePath = l_path[i];
            filePath = filePath.replace(/\\/g, "/");
            // 注意,存储时删除BASE_PATH前置
            let s_relative_path = filePath.replace(new RegExp(`[.]*${s_dir_path}/`), "");
            //特殊处理。适配md5
            s_relative_path = this.html_use_md5_path(s_relative_path);
            let s_value = "";
            if (path.extname(filePath) == ".js") {
                s_value = js_handler_1.default.run(filePath, b_obfuscator, config_1.default.is_min_js);
            }
            else if (config_1.default.string_type_extname_set.has(path.extname(filePath))) {
                s_value = utils_1.default.read_file_toString(filePath);
            }
            else {
                s_value = utils_1.default.read_file_base64(filePath);
            }
            d_res_mapping[s_relative_path] = s_value;
        }
        return d_res_mapping;
    }
    //读取获取所有文件
    get_all_file_path(s_dir_path, filter_extname_set) {
        let l_file_path = utils_1.default.get_dir_all_file(s_dir_path);
        for (let i = 0; i < l_file_path.length; i++) {
            let filePath = l_file_path[i];
            // 注意,存储时删除BASE_PATH前置
            filePath = filePath.replace(/\\/g, "/");
            if (filter_extname_set.has(path.extname(filePath))) {
                // log.log("过滤", filePath)
                l_file_path.splice(i, 1);
                i--;
            }
        }
        log_1.default.log("file count " + l_file_path.length);
        return l_file_path;
    }
    // 对md5路径进行处理，仅处理html直接引用的文件(3.x版本)
    html_use_md5_path(s_path) {
        // index.ce2e5.js
        // src/polyfills.bundle.5adbf.js
        // src/system.bundle.543e6.js
        // src/import-map.c7009.json
        if (s_path.search(/index\.[a-zA-Z0-9]*.js/) == 0) {
            return "index.js";
        }
        else if (s_path.search(/src\/polyfills\.bundle\.[a-zA-Z0-9]*.js/) == 0) {
            return "src/polyfills.bundle.js";
        }
        else if (s_path.search(/src\/system\.bundle\.[a-zA-Z0-9]*.js/) == 0) {
            return "src/system.bundle.js";
        }
        else if (s_path.search(/src\/import-map\.[a-zA-Z0-9]*.json/) == 0) {
            return "src/import-map.json";
        }
        else {
            return s_path;
        }
    }
}
exports.default = new file_handler();
