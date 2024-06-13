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
Object.defineProperty(exports, "__esModule", { value: true });
const jszip = __importStar(require("jszip"));
class res_handler {
    async run(d_hot) {
        await new Promise(async (resolve, reject) => {
            var zips = new jszip.default();
            const d_res_mapping = d_hot.d_res_mapping;
            for (let s_relative_path in d_res_mapping) {
                const s_value = d_res_mapping[s_relative_path];
                if (!d_hot.d_res_zip_ratio[s_relative_path].enable_zip) {
                    d_hot.d_res_no_zip[s_relative_path] = s_value;
                }
                else {
                    await zips.file(s_relative_path, s_value, { compression: "DEFLATE" });
                }
            }
            ;
            if (Object.keys(zips.files).length) {
                zips.generateAsync({ type: "nodebuffer" }).then((content) => {
                    let str_base64 = Buffer.from(content).toString("base64");
                    d_hot.s_zip_base64_res = str_base64;
                    resolve({});
                });
            }
            else {
                resolve({});
            }
        });
    }
}
exports.default = new res_handler();
