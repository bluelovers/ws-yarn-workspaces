"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillDummyScripts = exports._fillDummyScriptsCore = void 0;
function _fillDummyScriptsCore(scripts, prefix, fields) {
    // @ts-ignore
    scripts !== null && scripts !== void 0 ? scripts : (scripts = {});
    let text = `echo ${prefix !== null && prefix !== void 0 ? prefix : ''}`.trim();
    fields.forEach(k => {
        var _a;
        // @ts-ignore
        (_a = scripts[k]) !== null && _a !== void 0 ? _a : (scripts[k] = `${text} ${k}`);
    });
    return scripts;
}
exports._fillDummyScriptsCore = _fillDummyScriptsCore;
function fillDummyScripts(scripts, prefix) {
    return _fillDummyScriptsCore(scripts, prefix, [
        'preversion',
        'version',
        'prepublishOnly',
        'postversion',
        'publish',
        'prepublish',
        'postpublish',
        'postpublishOnly',
        'prepare',
        'prepack',
        'pack',
        'postpack',
        'pretest',
        'ci:build',
        'ci:install',
    ]);
}
exports.fillDummyScripts = fillDummyScripts;
//# sourceMappingURL=dummy.js.map