"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireExtra = requireExtra;
exports.importExtra = importExtra;
exports.tryRequireExtra = tryRequireExtra;
exports.tryImportExtra = tryImportExtra;
const core_1 = require("./core");
/**
 * 解析並載入模組
 * Resolve and load module
 *
 * 此函數結合模組路徑解析和 require 載入，提供一站式模組載入功能。
 * This function combines module path resolution and require loading,
 * providing a one-stop module loading solution.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 載入的模組 / Loaded module
 *
 * @example
 * ```typescript
 * // 載入 jest 模組 / Load jest module
 * const jest = requireExtra<typeof import('jest')>('jest');
 *
 * // 使用全域路徑載入 / Load with global paths
 * const ts = requireExtra('typescript', { includeGlobal: true });
 * ```
 */
function requireExtra(name, options) {
    return require((0, core_1.requireResolveCore)(name, options));
}
/**
 * 解析並動態導入模組
 * Resolve and dynamically import module
 *
 * 此函數使用 ES Module 動態導入語法載入模組，適用於非同步載入場景。
 * This function uses ES Module dynamic import syntax to load modules,
 * suitable for asynchronous loading scenarios.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 模組的 Promise / Promise of the module
 *
 * @example
 * ```typescript
 * // 非同步載入模組 / Asynchronously load module
 * const jest = await importExtra<typeof import('jest')>('jest');
 *
 * // 使用全域路徑載入 / Load with global paths
 * const ts = await importExtra('typescript', { includeGlobal: true });
 * ```
 */
function importExtra(name, options) {
    return Promise.resolve(`${__rewriteRelativeImportExtension((0, core_1.requireResolveCore)(name, options), true)}`).then(s => __importStar(require(s)));
}
/**
 * 嘗試載入模組，失敗時返回 null
 * Try to load module, return null on failure
 *
 * 此函數嘗試載入模組，若模組不存在或其他錯誤發生時返回 null 而非拋出錯誤。
 * This function attempts to load a module, returning null instead of throwing
 * when the module doesn't exist or other errors occur.
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 載入的模組或 null / Loaded module or null
 *
 * @example
 * ```typescript
 * const module = tryRequireExtra('optional-module');
 * if (module) {
 *   // 模組載入成功 / Module loaded successfully
 * } else {
 *   // 模組不存在 / Module doesn't exist
 * }
 * ```
 */
function tryRequireExtra(name, options) {
    try {
        return requireExtra(name, options);
    }
    catch {
        return null;
    }
}
/**
 * 嘗試非同步載入模組，失敗時返回 null
 * Try to asynchronously load module, return null on failure
 *
 * @typeParam T - 模組的預期類型 / Expected type of the module
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 模組的 Promise 或 null / Promise of the module or null
 *
 * @example
 * ```typescript
 * const module = await tryImportExtra('optional-module');
 * ```
 */
async function tryImportExtra(name, options) {
    try {
        return await importExtra(name, options);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=loader.js.map