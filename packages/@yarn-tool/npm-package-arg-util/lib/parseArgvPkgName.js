"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePackageName = exports.parseArgvPkgName = void 0;
const index_1 = require("../index");
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
/**
 * @deprecated
 */
function parseArgvPkgName(input) {
    const result = (0, index_1.npa)(input);
    if (result) {
        return {
            input,
            namespace: result.scope,
            name: (0, pkg_name_util_1.stripScope)(result.name),
            version: (0, index_1.getSemverFromNpaResult)(result),
            result,
        };
    }
}
exports.parseArgvPkgName = parseArgvPkgName;
function parsePackageName(packageName) {
    const result = (0, index_1.npa)(packageName);
    const subname = (0, pkg_name_util_1.stripScope)(result.name);
    let semver = (0, index_1.getSemverFromNpaResult)(result);
    if (!(semver === null || semver === void 0 ? void 0 : semver.length)) {
        semver = void 0;
    }
    return {
        type: result.type,
        name: result.name,
        scope: result.scope,
        subname,
        semver,
        result,
    };
}
exports.parsePackageName = parsePackageName;
//# sourceMappingURL=parseArgvPkgName.js.map