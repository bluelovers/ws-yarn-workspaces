"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionByNpmPackageArgWithCache = exports.parseVersionByNpmPackageArg = void 0;
const tslib_1 = require("tslib");
const npm_package_arg_1 = (0, tslib_1.__importDefault)(require("npm-package-arg"));
const queryVersion_1 = (0, tslib_1.__importDefault)(require("./queryVersion"));
function parseVersionByNpmPackageArg(input) {
    const { name, fetchSpec: version } = (0, npm_package_arg_1.default)(input);
    return {
        name,
        version,
    };
}
exports.parseVersionByNpmPackageArg = parseVersionByNpmPackageArg;
function queryVersionByNpmPackageArgWithCache(input, options) {
    const { name, version } = parseVersionByNpmPackageArg(input);
    return (0, queryVersion_1.default)(name, version, options);
}
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArgWithCache;
exports.default = queryVersionByNpmPackageArgWithCache;
//# sourceMappingURL=queryVersionByNpmPackageArg.js.map