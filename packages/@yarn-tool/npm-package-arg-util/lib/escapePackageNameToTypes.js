"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapePackageNameToTypes = void 0;
const stripScope_1 = require("./stripScope");
function escapePackageNameToTypes(options) {
    var _a;
    const name = stripScope_1.stripScope(options.name);
    if (((_a = options.scope) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        return options.scope.replace('@', '') + '__' + name;
    }
    return name;
}
exports.escapePackageNameToTypes = escapePackageNameToTypes;
//# sourceMappingURL=escapePackageNameToTypes.js.map