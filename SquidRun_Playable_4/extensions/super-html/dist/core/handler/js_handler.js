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
const js_obfuscator = require("../javascript-obfuscator.js");
const uglify = __importStar(require("uglify-js"));
const utils_1 = __importDefault(require("../common/utils"));
const log_1 = __importDefault(require("../common/log"));
class js_handler {
    /** 将js文件转化为html文件内容(包括压缩过程) */
    run(s_file_path, b_obfuscator, b_min, bReplaceJs = true) {
        let js = utils_1.default.read_file_toString(s_file_path);
        while (true) {
            if (bReplaceJs) {
                //如果是项目自己去请求资源等，不做替换
                if (s_file_path.indexOf("bundle.js") == -1) {
                    js = js.replace(/new XMLHttpRequest/g, "new _XMLLocalRequest");
                }
                js = js.replace(/[A-Za-z$0-9]*\.createElement\(['"]script['"]\)/g, "_createLocalJSElement()");
            }
            if (js.length > 1024 * 500) {
                break;
            }
            if (s_file_path.indexOf("min.js") != -1) {
                break;
            }
            if (b_obfuscator) {
                log_1.default.debug("obfuscator", s_file_path, js.length);
                const result = js_obfuscator.obfuscate(js, {
                    compact: true,
                    controlFlowFlattening: false,
                    deadCodeInjection: false,
                    debugProtection: false,
                    debugProtectionInterval: false,
                    disableConsoleOutput: false,
                    identifierNamesGenerator: 'mangled',
                    log: false,
                    numbersToExpressions: false,
                    renameGlobals: false,
                    /** 保留标识符，让其不被混淆，支持正则表达式。 */
                    reservedNames: [],
                    rotateStringArray: true,
                    selfDefending: false,
                    shuffleStringArray: true,
                    simplify: true,
                    splitStrings: false,
                    stringArray: true,
                    stringArrayEncoding: [],
                    stringArrayIndexShift: true,
                    stringArrayWrappersCount: 1,
                    stringArrayWrappersChainedCalls: true,
                    stringArrayWrappersParametersMaxCount: 2,
                    stringArrayWrappersType: 'variable',
                    stringArrayThreshold: 0.75,
                    unicodeEscapeSequence: false
                });
                js = result.getObfuscatedCode();
            }
            else {
                if (b_min) {
                    log_1.default.debug("minify", s_file_path, js.length);
                    var options = {};
                    js = uglify.minify(js, options).code;
                }
            }
            break;
        }
        return js;
    }
}
exports.default = new js_handler();
