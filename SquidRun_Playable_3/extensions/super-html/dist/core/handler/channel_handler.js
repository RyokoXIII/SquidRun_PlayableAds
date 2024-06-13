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
const jszip = __importStar(require("jszip"));
const fs = __importStar(require("fs"));
const log_1 = __importDefault(require("../common/log"));
const path = __importStar(require("path"));
const channel_config_1 = __importDefault(require("../../inject_script/channel/channel_config"));
const utils_1 = __importDefault(require("../common/utils"));
const js_handler_1 = __importDefault(require("./js_handler"));
const config_1 = __importDefault(require("../config"));
class channel_handler {
    async run(d_hot, s_dir_path, s_version) {
        const s_base_body = `console.time("[super-html] load html");`;
        // #### 资源 
        //导入不带压缩的资源
        const s_res_body = `window.__res=${JSON.stringify(d_hot.d_res_mapping)};`;
        // #### 带压缩的资源
        let s_zip_res_body = "";
        {
            //导入带压缩的zip资源
            if (d_hot.s_zip_base64_res) {
                s_zip_res_body += `window.__zip = "${d_hot.s_zip_base64_res}";`;
                //导入库
                s_zip_res_body += this._get_zip_script();
            }
            //导入常规资源
            s_zip_res_body += `window.__res=${JSON.stringify(d_hot.d_res_no_zip)};`;
        }
        // #### 各个版本适配文件
        const s_version_adapter_body = this._get_version_script(s_version);
        // #### 通用脚本
        const s_common_body = this._get_common_script();
        const inject_channel_adapter = channel_config_1.default.inject_channel_adapter;
        for (let key in inject_channel_adapter) {
            let d_channel = inject_channel_adapter[key];
            const s_channel_name = d_channel.s_name;
            const s_channel_config_name = d_channel.s_config_name || s_channel_name;
            if (!d_channel.b_enable) {
                continue;
            }
            const s_body = s_base_body + `window.super_html_channel = "${s_channel_name}";console.log("[super-html] channel: ${s_channel_name}");`;
            // 有配置是生成zip
            d_channel.b_out_zip = d_channel.b_out_zip || false;
            // html文件名
            d_channel.s_html_name = d_channel.s_html_name || "index.html";
            // 是否开启html压缩
            d_channel.b_html_compression = d_channel.b_html_compression || false;
            // zip文件名
            d_channel.s_zip_name = d_channel.s_zip_name || "index.zip";
            // #### 渠道脚本
            const s_channel_meta = this._get_channel_script(s_channel_config_name, "meta.html");
            const s_channel_head = this._get_channel_script(s_channel_config_name, "head.js");
            const s_channel_body = this._get_channel_script(s_channel_config_name, "script.js");
            const s_channel_json = this._get_channel_script(s_channel_config_name, "script.js");
            let s_out_body = null;
            let l_body = [];
            if (d_channel.b_html_compression) {
                l_body = [s_body, s_channel_body, s_zip_res_body, s_version_adapter_body, s_common_body];
            }
            else {
                l_body = [s_body, s_channel_body, s_res_body, s_version_adapter_body, s_common_body];
            }
            s_out_body = l_body.join("\n");
            let s_html_content = this._add_meta_to_meta(d_hot.s_html_content, s_channel_meta);
            s_html_content = this._add_script_to_head(s_html_content, s_channel_head);
            s_html_content = this._add_script_to_body(s_html_content, s_out_body);
            let s_out_file_name = "";
            let out_data = null;
            // console.log(d_channel)
            if (d_channel.b_out_zip) {
                s_out_file_name = d_channel.s_zip_name;
                //生成zip的文件，使用不带压缩的
                s_out_body = s_html_content;
                var zip = new jszip.default();
                zip.file(d_channel.s_html_name, s_out_body, { compression: "DEFLATE" });
                // 生成更新后的zip文件
                out_data = await zip.generateAsync({
                    type: 'nodebuffer',
                    compression: "DEFLATE",
                    // compressionOptions: {
                    //     level: 5
                    // }
                });
            }
            else {
                s_out_file_name = d_channel.s_html_name;
                out_data = s_html_content;
            }
            let s_out_path = path.join(s_dir_path, s_channel_name, s_out_file_name);
            utils_1.default.writeFileSync(s_out_path, out_data);
            log_1.default.log(`[${s_channel_name}] [${utils_1.default.b_to_kb(out_data.length)}] \n${s_out_path}`);
        }
    }
    _add_meta_to_meta(s_html_content, s_content) {
        return s_html_content.replace("<style>", () => `${s_content}\n<style>`);
    }
    _add_script_to_head(s_html_content, s_content) {
        s_content = `<script type="text/javascript">\n${s_content}\n</script>`;
        return s_html_content.replace("</head>", () => `${s_content}\n</head>`);
    }
    _add_script_to_body(s_html_content, s_content) {
        s_content = `<script type="text/javascript">\n${s_content}\n</script>`;
        return s_html_content.replace("</body>", () => `${s_content}\n</body>`);
    }
    //获得压缩库脚本
    _get_zip_script() {
        return utils_1.default.read_file_toString(utils_1.default.get_abs_path(config_1.default.inject_jszip_script));
    }
    //获得通用脚本
    _get_common_script() {
        return this._read_script_file(utils_1.default.get_abs_path(config_1.default.inject_common_script));
    }
    //获得渠道脚本
    _get_channel_script(s_channel_name, s_file_name) {
        // 有配置脚本
        let s_script_path = `inject_script/channel/${s_channel_name}/${s_file_name}`;
        s_script_path = utils_1.default.get_abs_path(s_script_path);
        if (fs.existsSync(s_script_path)) {
            //渠道脚本
            return this._read_script_file(s_script_path);
        }
        return "";
    }
    _read_script_file(s_script_path) {
        return js_handler_1.default.run(s_script_path, false, true, false);
    }
    //获得自定义脚本
    _get_version_script(s_version) {
        let contents = "";
        let l_custom_script = config_1.default.inject_version_adapter[s_version];
        l_custom_script.forEach(s_path => {
            s_path = utils_1.default.get_abs_path(s_path);
            const content = this._read_script_file(s_path);
            contents += "(function(){" + content + "})();";
        });
        return contents;
    }
}
exports.default = new channel_handler();
