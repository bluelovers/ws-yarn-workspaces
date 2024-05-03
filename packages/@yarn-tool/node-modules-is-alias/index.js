"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsAbsolutePath = assertIsAbsolutePath;
exports.parseModulePath = parseModulePath;
exports.parseModulePathIsAlias = parseModulePathIsAlias;
exports.parseModulePathIsAliasUnsafe = parseModulePathIsAliasUnsafe;
exports.modulePathIsAlias = modulePathIsAlias;
const pkg_dir_1 = require("pkg-dir");
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
const resolve_package_1 = require("@yarn-tool/resolve-package");
const upath2_1 = require("upath2");
function assertIsAbsolutePath(absolutePath) {
    if (!(0, upath2_1.isAbsolute)(absolutePath)) {
        throw new RangeError(`Input path should be absolute path: ${absolutePath}`);
    }
}
function parseModulePath(absolutePath) {
    assertIsAbsolutePath(absolutePath);
    const root = (0, upath2_1.normalize)((0, pkg_dir_1.sync)(absolutePath));
    const moduleBasename = (0, upath2_1.basename)(root);
    const parentBasename = (0, upath2_1.basename)((0, upath2_1.dirname)(root));
    const isTypes = parentBasename === '@types';
    const inNodeModules = parentBasename === 'node_modules';
    return {
        root,
        moduleBasename,
        parentBasename,
        isTypes,
        inNodeModules,
    };
}
function parseModulePathIsAlias(absolutePath) {
    const data = parseModulePath(absolutePath);
    const resolveData = (0, resolve_package_1.resolvePackage)(absolutePath);
    const parsed = (0, parseArgvPkgName_1.parsePackageName)(resolveData.pkg.name);
    const isAlias = !!(data.moduleBasename !== parsed.subname || data.isTypes && parsed.scope !== '@types' || parsed.scope && parsed.scope !== data.parentBasename);
    return {
        ...data,
        parsed,
        resolveData,
        isAlias,
    };
}
function parseModulePathIsAliasUnsafe(absolutePath) {
    return parseModulePathIsAlias((0, resolve_package_1.resolvePackageCore)(absolutePath).pkgRoot);
}
function modulePathIsAlias(dir) {
    return parseModulePathIsAlias(dir).isAlias;
}
exports.default = modulePathIsAlias;
//# sourceMappingURL=index.js.map