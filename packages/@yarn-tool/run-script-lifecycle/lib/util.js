"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOutput = formatOutput;
exports._options = _options;
exports._hook = _hook;
exports.runLifecycleScriptCore = runLifecycleScriptCore;
exports.runLifecycleScriptList = runLifecycleScriptList;
const tslib_1 = require("tslib");
/**
 * Created by user on 2020/4/9.
 */
const run_script_1 = tslib_1.__importDefault(require("@npmcli/run-script"));
const run_script_pkg_1 = tslib_1.__importDefault(require("@npmcli/run-script/lib/run-script-pkg"));
function formatOutput(result) {
    return `> ${result.pkgid} ${result.event}\n> ${result.script}\n${result.stdout}`;
}
function _options(options) {
    return {
        args: [],
        //stdioString: true,
        ...options,
        stdio: 'inherit',
    };
}
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
function runLifecycleScriptCore(options, fn) {
    return _hook(_options(options), fn);
}
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
//# sourceMappingURL=util.js.map