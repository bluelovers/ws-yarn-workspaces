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
Object.defineProperty(exports, "__esModule", { value: true });
exports.importExtra = importExtra;
const url_1 = require("url");
const core_1 = require("./core");
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
async function importExtra(name, options) {
    const path = (0, core_1.requireResolveCore)(name, options);
    return Promise.resolve(`${path}`).then(s => __importStar(require(s))).catch(() => { var _a; return Promise.resolve(`${(_a = (0, url_1.pathToFileURL)(path)) === null || _a === void 0 ? void 0 : _a.href}`).then(s => __importStar(require(s))); });
}
//# sourceMappingURL=loader-import.cjs.map