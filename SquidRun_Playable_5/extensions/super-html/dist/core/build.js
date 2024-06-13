"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const log_1 = __importDefault(require("./common/log"));
const task_1 = __importDefault(require("./task"));
const cache_1 = __importDefault(require("./common/cache"));
class build {
    constructor(engine_version, path_input_dir, path_out_dir, cb) {
        log_1.default.log("-- start --");
        log_1.default.log("engine version " + engine_version);
        let version = "";
        if (engine_version.search(/3.[0-9].[0-9]/) == 0) {
            if (engine_version.search(/3.[0-3]/) == 0) {
                throw Error(`This engine version is not supported. Please contact the developer`);
            }
            version = "34x";
        }
        else if (engine_version.search(/2.4.[0-9]/) == 0) {
            version = "24x";
        }
        else if (engine_version.search(/2.[0-9].[0-9]/) == 0) {
            version = "23x";
        }
        else {
            throw Error(`This engine version is not supported. Please contact the developer`);
        }
        if (config_1.default.is_debug) {
            config_1.default.is_min_js = false;
            config_1.default.is_min_css = false;
        }
        this.build(version, path_input_dir, path_out_dir, cb);
    }
    async build(version, path_input_dir, path_out_dir, cb) {
        let _task = new task_1.default({
            version: version,
            path_input_dir: path_input_dir,
            path_out_dir: path_out_dir,
            enable_obfuscator: cache_1.default.get().enable_obfuscator,
        });
        let i_time = new Date().getTime();
        await _task.build();
        log_1.default.log(`run time ${(new Date().getTime() - i_time) / 1000}S`);
        log_1.default.log("-- end -- ");
        cb && cb();
    }
}
exports.default = build;
