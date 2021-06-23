"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapePackageNameToTypes = void 0;
const stripScope_1 = require("./stripScope");
function escapePackageNameToTypes(options, prefix) {
    var _a;
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    const name = (0, stripScope_1.stripScope)(options.name);
    if (((_a = options.scope) === null || _a === void 0 ? void 0 : _a.length) > 0 && options.scope !== prefix) {
        return options.scope.replace('@', '') + '__' + name;
    }
    return name;
}
exports.escapePackageNameToTypes = escapePackageNameToTypes;
//# sourceMappingURL=escapePackageNameToTypes.js.map