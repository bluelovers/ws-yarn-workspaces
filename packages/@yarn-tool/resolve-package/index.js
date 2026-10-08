"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.resolvePackage = exports.readModulePackageJson = exports.createResolveLocationFn = exports.resolvePackageJsonLocation = exports.resolvePackageRoot = exports.resolvePackageCore = void 0;
/**
 * @deprecated This package is deprecated, use @yarn-tool/require-resolve instead
 *
 * 從 @yarn-tool/require-resolve 重新匯出所有套件解析功能
 *
 * 本套件僅為相容層 (Compatibility layer)，實際實作維持在來源套件以避免重複定義
 */
var require_resolve_1 = require("@yarn-tool/require-resolve");
Object.defineProperty(exports, "resolvePackageCore", { enumerable: true, get: function () { return require_resolve_1.resolvePackageCore; } });
Object.defineProperty(exports, "resolvePackageRoot", { enumerable: true, get: function () { return require_resolve_1.resolvePackageRoot; } });
Object.defineProperty(exports, "resolvePackageJsonLocation", { enumerable: true, get: function () { return require_resolve_1.resolvePackageJsonLocation; } });
Object.defineProperty(exports, "createResolveLocationFn", { enumerable: true, get: function () { return require_resolve_1.createResolveLocationFn; } });
Object.defineProperty(exports, "readModulePackageJson", { enumerable: true, get: function () { return require_resolve_1.readModulePackageJson; } });
Object.defineProperty(exports, "resolvePackage", { enumerable: true, get: function () { return require_resolve_1.resolvePackage; } });
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return require_resolve_1.resolvePackage; } });
//# sourceMappingURL=index.js.map