"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
const util_1 = require("./util");
function handleOptions(opts) {
    var _a, _b, _c;
    return {
        ...(opts !== null && opts !== void 0 ? opts : {}),
        otherScriptNames: (_a = opts === null || opts === void 0 ? void 0 : opts.otherScriptNames) !== null && _a !== void 0 ? _a : util_1.otherScriptNames,
        defaultNpmScriptsOrder: (_b = opts === null || opts === void 0 ? void 0 : opts.defaultNpmScriptsOrder) !== null && _b !== void 0 ? _b : util_1.defaultNpmScriptsOrder,
        omitKeyFn: (_c = opts === null || opts === void 0 ? void 0 : opts.omitKeyFn) !== null && _c !== void 0 ? _c : util_1.omitKey,
        sortKeyFn: opts === null || opts === void 0 ? void 0 : opts.sortKeyFn,
    };
}
exports.default = handleOptions;
//# sourceMappingURL=handleOptions.js.map