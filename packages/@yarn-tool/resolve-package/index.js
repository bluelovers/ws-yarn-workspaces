"use strict";
/**
 * @fileoverview 套件解析模組 - 重新匯出 @yarn-tool/require-resolve 的套件解析功能
 * Package resolution module - Re-exports package resolution functions from @yarn-tool/require-resolve
 *
 * 此模組提供解析 Node.js 套件的根目錄與 package.json 路徑的功能。
 * This module provides functionality to resolve Node.js package root and package.json paths.
 *
 * @module @yarn-tool/resolve-package
 * @deprecated
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.resolvePackage = exports.readModulePackageJson = exports.createResolveLocationFn = exports.resolvePackageJsonLocation = exports.resolvePackageRoot = exports.resolvePackageCore = void 0;
// 從 @yarn-tool/require-resolve 重新匯出所有套件解析功能
// Re-export all package resolution functions from @yarn-tool/require-resolve
var require_resolve_1 = require("@yarn-tool/require-resolve");
Object.defineProperty(exports, "resolvePackageCore", { enumerable: true, get: function () { return require_resolve_1.resolvePackageCore; } });
Object.defineProperty(exports, "resolvePackageRoot", { enumerable: true, get: function () { return require_resolve_1.resolvePackageRoot; } });
Object.defineProperty(exports, "resolvePackageJsonLocation", { enumerable: true, get: function () { return require_resolve_1.resolvePackageJsonLocation; } });
Object.defineProperty(exports, "createResolveLocationFn", { enumerable: true, get: function () { return require_resolve_1.createResolveLocationFn; } });
Object.defineProperty(exports, "readModulePackageJson", { enumerable: true, get: function () { return require_resolve_1.readModulePackageJson; } });
Object.defineProperty(exports, "resolvePackage", { enumerable: true, get: function () { return require_resolve_1.resolvePackage; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return require_resolve_1.resolvePackage; } });
//# sourceMappingURL=index.js.map