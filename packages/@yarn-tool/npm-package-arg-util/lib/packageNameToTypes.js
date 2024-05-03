"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageNameToTypes = packageNameToTypes;
const escapePackageNameToTypes_1 = require("./escapePackageNameToTypes");
const parseArgvPkgName_1 = require("./parseArgvPkgName");
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
function packageNameToTypes(packageName, prefix) {
    let ret = (0, parseArgvPkgName_1.parsePackageName)(packageName);
    prefix !== null && prefix !== void 0 ? prefix : (prefix = '@types');
    (0, pkg_name_util_1.assertScope)(prefix, true);
    let { result } = ret;
    let scope = prefix;
    let subname = (0, escapePackageNameToTypes_1.escapePackageNameToTypes)(result, prefix);
    let name = (0, pkg_name_util_1.formatPackageName)({
        scope: prefix,
        name: subname,
    });
    return {
        ...ret,
        name,
        scope,
        subname,
    };
}
//# sourceMappingURL=packageNameToTypes.js.map