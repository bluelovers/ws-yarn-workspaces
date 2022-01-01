"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillDummyScripts = void 0;
function fillDummyScripts(scripts, prefix) {
    // @ts-ignore
    scripts !== null && scripts !== void 0 ? scripts : (scripts = {});
    let text = `echo ${prefix !== null && prefix !== void 0 ? prefix : ''}`.trim();
    [
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
    ].forEach(k => {
        var _a;
        // @ts-ignore
        (_a = scripts[k]) !== null && _a !== void 0 ? _a : (scripts[k] = `${text} ${k}`);
    });
    return scripts;
}
exports.fillDummyScripts = fillDummyScripts;
//# sourceMappingURL=dummy.js.map