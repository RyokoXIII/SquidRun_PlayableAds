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
const utils_1 = __importDefault(require("../common/utils"));
const log_1 = __importDefault(require("../common/log"));
class compression_handler {
    /** 计算压缩率 */
    async call_ratio(d_hot) {
        return new Promise((resolve, reject) => {
            let i_task = 0;
            const d_res_mapping = d_hot.d_res_mapping;
            for (let s_relative_path in d_res_mapping) {
                i_task++;
                var zips = new jszip.default();
                const s_value = d_res_mapping[s_relative_path];
                zips.file(s_relative_path, s_value, { compression: "DEFLATE" });
                zips.generateAsync({ type: "nodebuffer" }).then((content) => {
                    let str_base64 = Buffer.from(content).toString("base64");
                    let ratio = Number((str_base64.length / s_value.length).toFixed(2));
                    d_hot.d_res_zip_ratio[s_relative_path] = {
                        key: s_relative_path,
                        ratio: ratio,
                        org_size: s_value.length,
                        zip_size: str_base64.length,
                        cut_size: s_value.length - str_base64.length,
                        enable_zip: false,
                        value: s_value
                    };
                    i_task--;
                    if (i_task <= 0) {
                        resolve({});
                    }
                });
            }
            ;
        });
    }
    // 计算出需要压缩的文件
    call_cut(d_hot, i_max_size) {
        d_hot.i_cut_size = 0;
        //计算哪些文件需要压缩
        let list = [];
        for (let k in d_hot.d_res_zip_ratio) {
            if (d_hot.d_res_zip_ratio[k].ratio >= 1) {
                d_hot.d_res_zip_ratio[k].enable_zip = false;
            }
            else {
                list.push(d_hot.d_res_zip_ratio[k]);
            }
        }
        list.sort((a, b) => {
            return a.ratio < b.ratio ? -1 : 1;
        });
        function get_size(i, temp_size) {
            for (let j = i + 1; j < list.length; j++) {
                temp_size -= list[j].org_size;
            }
            return temp_size;
        }
        // if (get_size(-1, i_max_size) < 0) {
        //每次寻找压缩率最大的文件
        for (let i = 0; i < list.length; i++) {
            i_max_size -= list[i].zip_size;
            list[i].enable_zip = true;
            // if (get_size(i, i_max_size) >= 0) {
            //     break;
            // }
        }
        // }
        let len = 0;
        let cut_all_size = 0;
        for (let k in list) {
            if (list[k].enable_zip) {
                len++;
                d_hot.i_cut_size += list[k].cut_size;
                log_1.default.debug("enable_zip", list[k].enable_zip, list[k].key);
            }
            cut_all_size += list[k].org_size;
        }
        log_1.default.log(`zip file count ` + len);
        log_1.default.log("zip cut size " + utils_1.default.b_to_kb(d_hot.i_cut_size));
    }
}
exports.default = new compression_handler();
