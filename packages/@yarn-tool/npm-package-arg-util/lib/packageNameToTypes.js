"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageNameToTypes = void 0;
const escapePackageNameToTypes_1 = require("./escapePackageNameToTypes");
const parseArgvPkgName_1 = require("./parseArgvPkgName");
function packageNameToTypes(packageName, prefix) {
    let ret = parseArgvPkgName_1.parsePackageName(packageName);
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    if (prefix[0] !== '@' || prefix.includes('/')) {
        throw new TypeError(`invalid scope '${prefix}'`);
    }
    let { result } = ret;
    let scope = prefix;
    let subname = escapePackageNameToTypes_1.escapePackageNameToTypes(result);
    let name = prefix + '/' + escapePackageNameToTypes_1.escapePackageNameToTypes(result);
    return {
        ...ret,
        name,
        scope,
        subname,
    };
}
exports.packageNameToTypes = packageNameToTypes;
//# sourceMappingURL=packageNameToTypes.js.map