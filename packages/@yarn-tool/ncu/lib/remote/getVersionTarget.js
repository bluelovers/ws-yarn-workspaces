"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersionTarget = exports._getVersionTarget = void 0;
const types_1 = require("../types");
function _getVersionTarget(options) {
    // @ts-ignore
    return options.semverLevel || (options.newest ? types_1.EnumPackageManagersNpmMethod.newest :
        options.greatest ? types_1.EnumPackageManagersNpmMethod.greatest :
            types_1.EnumPackageManagersNpmMethod.latest);
}
exports._getVersionTarget = _getVersionTarget;
function getVersionTarget(options) {
    if (typeof options === 'string') {
        // @ts-ignore
        return options;
    }
    else if (options.versionTarget) {
        return options.versionTarget;
    }
    return _getVersionTarget(options);
}
exports.getVersionTarget = getVersionTarget;
//# sourceMappingURL=getVersionTarget.js.map