"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePackage = exports.readModulePackageJson = exports.createResolveLocationFn = exports.resolvePackageJsonLocation = exports.resolvePackageRoot = exports.resolvePackageCore = exports.tryImportExtra = exports.tryRequireExtra = exports.importExtra = exports.requireExtra = exports.buildResolvePaths = exports.requireResolveExtra = exports.requireResolveCore = exports.createModuleNotFoundError = exports.isErrorModuleNotFound = exports.validSymbols = exports.isValidPathSymbol = exports.unshiftArray = exports.getTargetName = exports.handleOptionsPaths = exports.defaultMap = exports.SymbolModuleMain = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = void 0;
// Symbols 和工具函數 / Symbols and utility functions
var util_1 = require("./util");
Object.defineProperty(exports, "SymbolCurrentDirectory", { enumerable: true, get: function () { return util_1.SymbolCurrentDirectory; } });
Object.defineProperty(exports, "SymbolGlobal", { enumerable: true, get: function () { return util_1.SymbolGlobal; } });
Object.defineProperty(exports, "SymbolGlobalNpm", { enumerable: true, get: function () { return util_1.SymbolGlobalNpm; } });
Object.defineProperty(exports, "SymbolGlobalYarn", { enumerable: true, get: function () { return util_1.SymbolGlobalYarn; } });
Object.defineProperty(exports, "SymbolModuleMain", { enumerable: true, get: function () { return util_1.SymbolModuleMain; } });
Object.defineProperty(exports, "defaultMap", { enumerable: true, get: function () { return util_1.defaultMap; } });
Object.defineProperty(exports, "handleOptionsPaths", { enumerable: true, get: function () { return util_1.handleOptionsPaths; } });
Object.defineProperty(exports, "getTargetName", { enumerable: true, get: function () { return util_1.getTargetName; } });
Object.defineProperty(exports, "unshiftArray", { enumerable: true, get: function () { return util_1.unshiftArray; } });
Object.defineProperty(exports, "isValidPathSymbol", { enumerable: true, get: function () { return util_1.isValidPathSymbol; } });
Object.defineProperty(exports, "validSymbols", { enumerable: true, get: function () { return util_1.validSymbols; } });
// 錯誤處理 / Error handling
var error_1 = require("./error");
Object.defineProperty(exports, "isErrorModuleNotFound", { enumerable: true, get: function () { return error_1.isErrorModuleNotFound; } });
Object.defineProperty(exports, "createModuleNotFoundError", { enumerable: true, get: function () { return error_1.createModuleNotFoundError; } });
// 核心解析功能 / Core resolution functions
var core_1 = require("./core");
Object.defineProperty(exports, "requireResolveCore", { enumerable: true, get: function () { return core_1.requireResolveCore; } });
Object.defineProperty(exports, "requireResolveExtra", { enumerable: true, get: function () { return core_1.requireResolveExtra; } });
Object.defineProperty(exports, "buildResolvePaths", { enumerable: true, get: function () { return core_1.buildResolvePaths; } });
// 模組載入 / Module loading
var loader_1 = require("./loader");
Object.defineProperty(exports, "requireExtra", { enumerable: true, get: function () { return loader_1.requireExtra; } });
Object.defineProperty(exports, "importExtra", { enumerable: true, get: function () { return loader_1.importExtra; } });
Object.defineProperty(exports, "tryRequireExtra", { enumerable: true, get: function () { return loader_1.tryRequireExtra; } });
Object.defineProperty(exports, "tryImportExtra", { enumerable: true, get: function () { return loader_1.tryImportExtra; } });
// 套件解析 / Package resolution
var package_1 = require("./package");
Object.defineProperty(exports, "resolvePackageCore", { enumerable: true, get: function () { return package_1.resolvePackageCore; } });
Object.defineProperty(exports, "resolvePackageRoot", { enumerable: true, get: function () { return package_1.resolvePackageRoot; } });
Object.defineProperty(exports, "resolvePackageJsonLocation", { enumerable: true, get: function () { return package_1.resolvePackageJsonLocation; } });
Object.defineProperty(exports, "createResolveLocationFn", { enumerable: true, get: function () { return package_1.createResolveLocationFn; } });
Object.defineProperty(exports, "readModulePackageJson", { enumerable: true, get: function () { return package_1.readModulePackageJson; } });
Object.defineProperty(exports, "resolvePackage", { enumerable: true, get: function () { return package_1.resolvePackage; } });
//# sourceMappingURL=index.js.map