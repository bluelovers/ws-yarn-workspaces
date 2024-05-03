"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersionByNpmPackageArg = parseVersionByNpmPackageArg;
exports._parseVersionByNpmPackageArgCore = _parseVersionByNpmPackageArgCore;
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArgWithCache;
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const queryVersion_1 = require("./queryVersion");
function parseVersionByNpmPackageArg(input) {
    return _parseVersionByNpmPackageArgCore((0, npm_package_arg_util_1.npa)(input));
}
function _parseVersionByNpmPackageArgCore(result) {
    const { name, fetchSpec: version } = result;
    return {
        name,
        version,
    };
}
function queryVersionByNpmPackageArgWithCache(input, options) {
    const { name, version } = parseVersionByNpmPackageArg(input);
    return (0, queryVersion_1.queryVersionWithCache)(name, version, options);
}
exports.default = queryVersionByNpmPackageArgWithCache;
//# sourceMappingURL=queryVersionByNpmPackageArg.js.map