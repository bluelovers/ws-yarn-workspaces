"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryVersionByNpmPackageArgWithCache = exports.parseVersionByNpmPackageArg = void 0;
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const queryVersion_1 = __importDefault(require("./queryVersion"));
function parseVersionByNpmPackageArg(input) {
    const { name, fetchSpec: version } = npm_package_arg_1.default(input);
    return {
        name,
        version,
    };
}
exports.parseVersionByNpmPackageArg = parseVersionByNpmPackageArg;
function queryVersionByNpmPackageArgWithCache(input, options) {
    const { name, version } = parseVersionByNpmPackageArg(input);
    return queryVersion_1.default(name, version, options);
}
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArgWithCache;
exports.default = queryVersionByNpmPackageArgWithCache;
//# sourceMappingURL=queryVersionByNpmPackageArg.js.map