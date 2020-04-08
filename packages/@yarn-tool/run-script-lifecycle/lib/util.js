"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLifecycleScriptList = exports.runLifecycleScriptCore = exports._hook = exports._options = exports.formatOutput = void 0;
/**
 * Created by user on 2020/4/9.
 */
const run_script_1 = __importDefault(require("@npmcli/run-script"));
const run_script_pkg_1 = __importDefault(require("@npmcli/run-script/lib/run-script-pkg"));
function formatOutput(result) {
    return `> ${result.pkgid} ${result.event}\n> ${result.script}\n${result.stdout}`;
}
exports.formatOutput = formatOutput;
function _options(options) {
    return {
        args: [],
        //stdioString: true,
        ...options,
        stdio: 'inherit',
    };
}
exports._options = _options;
function _hook(options, fn = run_script_1.default) {
    return fn(options)
        .then((result) => {
        result.stdio = options.stdio;
        return result;
    })
        .catch((e) => {
        e.stdio = options.stdio;
        return Promise.reject(e);
    });
}
exports._hook = _hook;
function runLifecycleScriptCore(options, fn) {
    return _hook(_options(options), fn);
}
exports.runLifecycleScriptCore = runLifecycleScriptCore;
async function runLifecycleScriptList(options) {
    const { tmpOptions, eventList, pkg } = options;
    const results = [];
    for (const event of eventList) {
        if (event in pkg.scripts) {
            let result = await _hook({
                ...tmpOptions,
                event,
            }, run_script_pkg_1.default);
            results.push(result);
        }
    }
    return results;
}
exports.runLifecycleScriptList = runLifecycleScriptList;
//# sourceMappingURL=util.js.map