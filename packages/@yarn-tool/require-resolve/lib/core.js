"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolModuleMain = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = exports.handleOptionsPaths = void 0;
exports.buildResolvePaths = buildResolvePaths;
exports.requireResolveCore = requireResolveCore;
exports.requireResolveExtra = requireResolveExtra;
const util_1 = require("./util");
Object.defineProperty(exports, "SymbolCurrentDirectory", { enumerable: true, get: function () { return util_1.SymbolCurrentDirectory; } });
Object.defineProperty(exports, "SymbolGlobal", { enumerable: true, get: function () { return util_1.SymbolGlobal; } });
Object.defineProperty(exports, "SymbolGlobalNpm", { enumerable: true, get: function () { return util_1.SymbolGlobalNpm; } });
Object.defineProperty(exports, "SymbolGlobalYarn", { enumerable: true, get: function () { return util_1.SymbolGlobalYarn; } });
Object.defineProperty(exports, "SymbolModuleMain", { enumerable: true, get: function () { return util_1.SymbolModuleMain; } });
Object.defineProperty(exports, "handleOptionsPaths", { enumerable: true, get: function () { return util_1.handleOptionsPaths; } });
const error_1 = require("./error");
/**
 * 建構解析路徑陣列
 * Build resolution paths array
 *
 * 根據選項配置建構用於模組解析的路徑陣列。
 * Constructs the paths array for module resolution based on options.
 *
 * @param options - 解析選項 / Resolution options
 * @returns 路徑陣列 / Paths array
 */
function buildResolvePaths(options) {
    var _a;
    const paths = (_a = options.paths) !== null && _a !== void 0 ? _a : [];
    // 處理全域路徑包含選項 / Handle global paths inclusion option
    if (options.includeGlobal) {
        if (Array.isArray(options.includeGlobal)) {
            for (const value of options.includeGlobal) {
                if ((0, util_1.isValidPathSymbol)(value)) {
                    (0, util_1.unshiftArray)(paths, value);
                }
            }
        }
        else {
            (0, util_1.unshiftArray)(paths, util_1.SymbolGlobal);
        }
    }
    // 處理當前目錄包含選項 / Handle current directory inclusion option
    if (options.includeCurrentDirectory) {
        (0, util_1.unshiftArray)(paths, util_1.SymbolCurrentDirectory);
    }
    return paths;
}
/**
 * require.resolve 的核心實作，支援額外搜尋路徑
 * Core implementation of require.resolve with extra search paths support
 *
 * 此函數擴充了原生 require.resolve，允許在全域 npm/yarn 路徑和當前目錄中搜尋模組。
 * This function extends native require.resolve, allowing module search in global npm/yarn paths and current directory.
 *
 * @param name - 要解析的模組名稱 / Module name to resolve
 * @param options - 解析選項 / Resolution options
 * @returns 解析後的模組路徑 / Resolved module path
 *
 * @example
 * ```typescript
 * // 基本用法 / Basic usage
 * const path = requireResolveCore('jest');
 *
 * // 使用全域路徑 / With global paths
 * const path = requireResolveCore('typescript', {
 *   includeGlobal: true,
 * });
 *
 * // 使用自訂對應 / With custom mapping
 * const path = requireResolveCore('my-module', {
 *   map: { 'my-module': 'my-module/dist/index' },
 * });
 * ```
 */
function requireResolveCore(name, options) {
    var _a;
    const opts = options !== null && options !== void 0 ? options : {};
    // 取得目標路徑，優先使用自訂對應表 / Get target path, prefer custom mapping
    const target = (0, util_1.getTargetName)(name, opts.map);
    // 建構解析路徑 / Build resolution paths
    const paths = buildResolvePaths(opts);
    return ((_a = opts.require) !== null && _a !== void 0 ? _a : require).resolve(target, {
        paths: (0, util_1.handleOptionsPaths)(paths, opts.cwd),
    });
}
/**
 * 解析模組並返回結果或錯誤
 * Resolve module and return result or error
 *
 * 此函數不會拋出 MODULE_NOT_FOUND 錯誤，而是將錯誤包含在返回物件中。
 * This function doesn't throw MODULE_NOT_FOUND error, instead includes it in the return object.
 *
 * @param name - 模組名稱 / Module name
 * @param options - 解析選項 / Resolution options
 * @returns 包含結果和錯誤的物件 / Object containing result and error
 *
 * @example
 * ```typescript
 * const { result, error } = requireResolveExtra('some-module');
 *
 * if (error) {
 *   console.log('Module not found:', error.message);
 * } else {
 *   console.log('Module path:', result);
 * }
 * ```
 */
function requireResolveExtra(name, options) {
    try {
        const result = requireResolveCore(name, options);
        return { result, error: void 0 };
    }
    catch (e) {
        const error = e;
        // MODULE_NOT_FOUND 錯誤不拋出，而是返回 / Don't throw MODULE_NOT_FOUND, return it instead
        if ((0, error_1.isErrorModuleNotFound)(error)) {
            return { error };
        }
        throw error;
    }
}
//# sourceMappingURL=core.js.map