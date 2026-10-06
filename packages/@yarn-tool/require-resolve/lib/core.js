"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildResolvePaths = buildResolvePaths;
exports.requireResolveCore = requireResolveCore;
exports.requireResolveExtra = requireResolveExtra;
const util_1 = require("./util");
const error_1 = require("./error");
const get_paths_by_type_1 = require("@yarn-tool/get-paths-by-type");
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
    /**
     * includeGlobal 支援兩種形態：直接給路徑陣列時逐一插入，
     * 給布林值時插入全域符號，交由後續轉換依執行環境解析出實際路徑。
     * includeGlobal has two shapes: a path array is unshifted item by item,
     * a boolean inserts the global symbol for later expansion per environment.
     */
    if (options.includeGlobal) {
        if (Array.isArray(options.includeGlobal)) {
            for (const value of options.includeGlobal) {
                (0, util_1._unshiftArray)(paths, value);
            }
        }
        else {
            (0, util_1._unshiftArray)(paths, get_paths_by_type_1.SymbolGlobal);
        }
    }
    /**
     * 目前目錄在全域路徑之後才插入，因此最終位於陣列最前端、優先被搜尋，
     * 依序為：目前目錄 > 全域路徑 > 使用者提供的 paths。
     * The current directory is inserted last so it ends up at the front of the
     * array and is searched first: current directory > global paths > user paths.
     */
    if (options.includeCurrentDirectory) {
        (0, util_1._unshiftArray)(paths, get_paths_by_type_1.SymbolCurrentDirectory);
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
    /** 允許省略 options，之後一律以空物件存取，避免逐項判斷 undefined / Allow omitting options; an empty object avoids undefined checks later */
    const opts = options !== null && options !== void 0 ? options : {};
    /**
     * 取得目標路徑，優先使用自訂對應表
     * Get target path, prefer custom mapping
     *
     * 自訂 map 優先，其次 defaultMap，最後才用原始名稱，
     * 讓呼叫端可以覆寫內建的入口點對應。
     * The custom map wins over defaultMap and finally the raw name, so callers
     * can override the built-in entry mapping.
     */
    const target = (0, util_1.getTargetName)(name, opts.map);
    /**
     * 建構解析路徑
     * Build resolution paths
     *
     * 將符號展開為實際路徑；cwd 用作展開時的基準目錄。
     * Expands symbols into real paths, using cwd as the base directory.
     */
    const paths = buildResolvePaths(opts);
    /**
     * 使用自訂 require（若有）呼叫 resolve；找不到模組時
     * 會依原生行為丟出 MODULE_NOT_FOUND。
     * Resolves through the custom require (if any); a missing module throws
     * MODULE_NOT_FOUND following the native behavior.
     */
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
        /** 以 void 0 明確帶上 error 欄位（值為 undefined），而非整個省略該欄位 / Uses void 0 to explicitly include the error key as undefined instead of omitting it */
        return { result, error: void 0 };
    }
    catch (e) {
        const error = e;
        /**
         * MODULE_NOT_FOUND 錯誤不拋出，而是返回
         * Don't throw MODULE_NOT_FOUND, return it instead
         *
         * 僅將「模組不存在」視為可回報的結果，
         * 其他錯誤（如權限、語法錯誤）仍照原樣丟出以免被靜默吞掉。
         * Only "module not found" is treated as a reportable result; other
         * errors (permissions, syntax, …) still propagate so they are not
         * swallowed silently.
         */
        if ((0, error_1.isErrorModuleNotFound)(error)) {
            return { error };
        }
        throw error;
    }
}
//# sourceMappingURL=core.js.map