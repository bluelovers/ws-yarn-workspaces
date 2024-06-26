"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._fillDummyScriptsCore = _fillDummyScriptsCore;
exports.fillDummyScripts = fillDummyScripts;
const dummy_1 = require("../../util/scripts/dummy");
function _fillDummyScriptsCore(scripts, prefix, fields) {
    // @ts-ignore
    scripts !== null && scripts !== void 0 ? scripts : (scripts = {});
    let text = (0, dummy_1._dummyEchoPrefix)(prefix);
    fields.forEach(k => {
        var _a;
        // @ts-ignore
        (_a = scripts[k]) !== null && _a !== void 0 ? _a : (scripts[k] = `${text} ${k}`);
    });
    return scripts;
}
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
//# sourceMappingURL=dummy.js.map