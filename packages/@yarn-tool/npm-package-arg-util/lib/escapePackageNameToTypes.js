"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapePackageNameToTypes = escapePackageNameToTypes;
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
function escapePackageNameToTypes(options, prefix) {
    var _a;
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    const name = (0, pkg_name_util_1.stripScope)(options.name);
    if (((_a = options.scope) === null || _a === void 0 ? void 0 : _a.length) > 0 && options.scope !== prefix) {
        return options.scope.replace('@', '') + '__' + name;
    }
    return name;
}
//# sourceMappingURL=escapePackageNameToTypes.js.map