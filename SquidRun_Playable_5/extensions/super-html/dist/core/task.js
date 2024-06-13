"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const log_1 = __importDefault(require("./common/log"));
const html_handler_1 = __importDefault(require("./handler/html_handler"));
const compression_handler_1 = __importDefault(require("./handler/compression_handler"));
const file_handler_1 = __importDefault(require("./handler/file_handler"));
const res_handler_1 = __importDefault(require("./handler/res_handler"));
const channel_handler_1 = __importDefault(require("./handler/channel_handler"));
let d_hot;
class task {
    constructor(_config) {
        this._config = _config;
        d_hot = {
            s_html_content: "",
            d_res_no_zip: {},
            d_res_zip_ratio: {},
            i_cut_size: 0,
            s_zip_base64_res: "",
            d_res_mapping: {}
        };
        //对路径进行处理，防止出现奇奇怪怪的
        this._config.path_input_dir = this._config.path_input_dir.replace(/\\/g, "/").replace("./", "");
        log_1.default.log("task config", _config);
    }
    async build() {
        return new Promise(async (resolve, reject) => {
            d_hot.s_html_content = html_handler_1.default.run(this._config.path_input_dir, config_1.default.is_min_css);
            d_hot.d_res_mapping = file_handler_1.default.run(this._config.path_input_dir, this._config.enable_obfuscator);
            // 计算压缩率
            await compression_handler_1.default.call_ratio(d_hot);
            // 计算出满足条件的最大压缩效率
            await compression_handler_1.default.call_cut(d_hot, 0);
            // 执行资源处理
            await res_handler_1.default.run(d_hot);
            // 生成各渠道文件
            await channel_handler_1.default.run(d_hot, this._config.path_out_dir, this._config.version);
            resolve({});
        }).catch((err) => {
            log_1.default.error(err, err.message);
            throw err;
        });
    }
}
exports.default = task;
