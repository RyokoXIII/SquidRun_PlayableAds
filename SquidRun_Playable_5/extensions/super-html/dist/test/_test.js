"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const build_1 = __importDefault(require("../core/build"));
const config_1 = __importDefault(require("../core/config"));
// let _path = "D:/project/tool/super-html/ccc_project/";
// let _out = "D:/project/tool/super-html/build/";
let _path = "D:/Project/all-in-cocos/dev/private-super-html/ccc_project/";
let _out = "D:/Project/all-in-cocos/dev/private-super-html/build/";
// run("2.3.4","234_example-cases/build/web-mobile", "234_example/");
// run("2.4.0","247_example-cases/build/web-mobile", "247_example/");
// run("3.4.1", "341_example/build/web-mobile", "341_example/");
run("3.8.0", "380_example/build/web-mobile", "380_example/");
// run("2.4.11", "super-html-gui/build/web-mobile", "super_ui_example/");
config_1.default.obfuscator = false;
config_1.default.is_debug = false;
function run(engine_version, input, out) {
    config_1.default.obfuscator = false;
    let path = _path + input;
    new build_1.default(engine_version, path, _out + out, () => {
        console.log("success");
    });
}
// import path from "path"
// let list = utils.get_dir_all_file_ext("D:/Project/tool/super-i18n/ccc_project/351_example/assets/resources/i18n", new Set([".json"]));
// console.log(list);
// console.log(path.basename(list[0]))
