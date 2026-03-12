"use strict";
/**
 * @yarn-tool/require-resolve
 *
 * 擴充版 require.resolve，支援在額外路徑中搜尋模組
 * An extended require.resolve with support for searching modules in extra paths
 *
 * @module @yarn-tool/require-resolve
 * @author bluelovers
 * @license ISC
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports._unshiftArray = exports.resolvePackage = exports.readModulePackageJson = exports.createResolveLocationFn = exports.resolvePackageJsonLocation = exports.resolvePackageRoot = exports.resolvePackageCore = exports.tryImportExtra = exports.tryRequireExtra = exports.importExtra = exports.requireExtra = exports.buildResolvePaths = exports.requireResolveExtra = exports.requireResolveCore = exports.createModuleNotFoundError = exports.isErrorModuleNotFound = exports.unshiftArray = exports.getTargetName = exports.handleOptionsPaths = exports.defaultMap = void 0;
var util_1 = require("./lib/util");
Object.defineProperty(exports, "defaultMap", { enumerable: true, get: function () { return util_1.defaultMap; } });
Object.defineProperty(exports, "handleOptionsPaths", { enumerable: true, get: function () { return util_1.handleOptionsPaths; } });
Object.defineProperty(exports, "getTargetName", { enumerable: true, get: function () { return util_1.getTargetName; } });
Object.defineProperty(exports, "unshiftArray", { enumerable: true, get: function () { return util_1.unshiftArray; } });
// 匯入 unshiftArray 以建立向後相容的別名 / Import unshiftArray for backward compatible alias
const util_2 = require("./lib/util");
Object.defineProperty(exports, "_unshiftArray", { enumerable: true, get: function () { return util_2.unshiftArray; } });
var error_1 = require("./lib/error");
Object.defineProperty(exports, "isErrorModuleNotFound", { enumerable: true, get: function () { return error_1.isErrorModuleNotFound; } });
Object.defineProperty(exports, "createModuleNotFoundError", { enumerable: true, get: function () { return error_1.createModuleNotFoundError; } });
var core_1 = require("./lib/core");
Object.defineProperty(exports, "requireResolveCore", { enumerable: true, get: function () { return core_1.requireResolveCore; } });
Object.defineProperty(exports, "requireResolveExtra", { enumerable: true, get: function () { return core_1.requireResolveExtra; } });
Object.defineProperty(exports, "buildResolvePaths", { enumerable: true, get: function () { return core_1.buildResolvePaths; } });
var loader_1 = require("./lib/loader");
Object.defineProperty(exports, "requireExtra", { enumerable: true, get: function () { return loader_1.requireExtra; } });
Object.defineProperty(exports, "importExtra", { enumerable: true, get: function () { return loader_1.importExtra; } });
Object.defineProperty(exports, "tryRequireExtra", { enumerable: true, get: function () { return loader_1.tryRequireExtra; } });
Object.defineProperty(exports, "tryImportExtra", { enumerable: true, get: function () { return loader_1.tryImportExtra; } });
var package_1 = require("./lib/package");
Object.defineProperty(exports, "resolvePackageCore", { enumerable: true, get: function () { return package_1.resolvePackageCore; } });
Object.defineProperty(exports, "resolvePackageRoot", { enumerable: true, get: function () { return package_1.resolvePackageRoot; } });
Object.defineProperty(exports, "resolvePackageJsonLocation", { enumerable: true, get: function () { return package_1.resolvePackageJsonLocation; } });
Object.defineProperty(exports, "createResolveLocationFn", { enumerable: true, get: function () { return package_1.createResolveLocationFn; } });
Object.defineProperty(exports, "readModulePackageJson", { enumerable: true, get: function () { return package_1.readModulePackageJson; } });
Object.defineProperty(exports, "resolvePackage", { enumerable: true, get: function () { return package_1.resolvePackage; } });
// ============================================================================
// 預設匯出 / Default export
// ============================================================================
var core_2 = require("./lib/core");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return core_2.requireResolveExtra; } });
//# sourceMappingURL=index.js.map