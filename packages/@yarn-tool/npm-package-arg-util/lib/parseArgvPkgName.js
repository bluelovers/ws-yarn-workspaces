"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePackageName = exports.parseArgvPkgName = void 0;
const index_1 = require("../index");
const stripScope_1 = require("./stripScope");
/**
 * @deprecated
 */
function parseArgvPkgName(input) {
    const result = index_1.npa(input);
    if (result) {
        return {
            input,
            namespace: result.scope,
            name: stripScope_1.stripScope(result.name),
            version: index_1.getSemverFromNpaResult(result),
            result,
        };
    }
}
exports.parseArgvPkgName = parseArgvPkgName;
function parsePackageName(packageName) {
    const result = index_1.npa(packageName);
    const subname = stripScope_1.stripScope(result.name);
    let semver = index_1.getSemverFromNpaResult(result);
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