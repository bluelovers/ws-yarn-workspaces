"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._getVersionTarget = _getVersionTarget;
exports.getVersionTarget = getVersionTarget;
const types_1 = require("../types");
function _getVersionTarget(options) {
    // @ts-ignore
    return options.semverLevel || (options.newest ? types_1.EnumPackageManagersNpmMethod.newest :
        options.greatest ? types_1.EnumPackageManagersNpmMethod.greatest :
            types_1.EnumPackageManagersNpmMethod.latest);
}
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
//# sourceMappingURL=getVersionTarget.js.map