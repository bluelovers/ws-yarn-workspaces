"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKnownLifecycleKey = exports.entryToList = exports.getLifecycleList = exports.getLifecycle = exports.getLifecycleCore = void 0;
const tslib_1 = require("tslib");
const lifecycle_1 = tslib_1.__importDefault(require("./lib/lifecycle"));
function getLifecycleCore(scriptName) {
    if (isKnownLifecycleKey(scriptName)) {
        return lifecycle_1.default[scriptName];
    }
    //return (lifecycleMap as ILifecycleMap)[scriptName]
}
exports.getLifecycleCore = getLifecycleCore;
function getLifecycle(scriptName, currentScriptOnly) {
    let entry;
    if (!currentScriptOnly) {
        entry = getLifecycleCore(scriptName);
    }
    return entry !== null && entry !== void 0 ? entry : {
        name: scriptName,
        ignoreSelf: false,
        before: [
            `pre${scriptName}`,
        ],
        after: [
            `post${scriptName}`,
        ],
    };
}
exports.getLifecycle = getLifecycle;
function getLifecycleList(scriptName, includeSelf, currentScriptOnly) {
    return entryToList(getLifecycle(scriptName, currentScriptOnly), includeSelf);
}
exports.getLifecycleList = getLifecycleList;
function entryToList(entry, includeSelf) {
    var _a, _b;
    let result = [];
    if ((_a = entry.before) === null || _a === void 0 ? void 0 : _a.length) {
        result.push(...entry.before);
    }
    if (includeSelf === true || entry.ignoreSelf !== true) {
        result.push(entry.name);
    }
    if ((_b = entry.after) === null || _b === void 0 ? void 0 : _b.length) {
        result.push(...entry.after);
    }
    return result;
}
exports.entryToList = entryToList;
function isKnownLifecycleKey(scriptName) {
    return scriptName in lifecycle_1.default;
}
exports.isKnownLifecycleKey = isKnownLifecycleKey;
//# sourceMappingURL=index.js.map