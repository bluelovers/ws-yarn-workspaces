"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBuiltinModule = exports.builtins = void 0;
exports.createNewIsBuiltinModule = createNewIsBuiltinModule;
const tslib_1 = require("tslib");
/**
 * 檢查名稱是否為 Node.js 內建模組 (Builtin Module)
 * Check whether a module name is a Node.js builtin module
 *
 * @module @yarn-tool/is-builtin-module
 */
const builtins_1 = tslib_1.__importDefault(require("builtins"));
/**
 * 依選項建立獨立的內建模組清單與檢查函式
 * Create an independent builtin module list and checker from the given options
 *
 * 每次呼叫都會重新向 `builtins` 取得清單，
 * 因此不同工廠實例可各自對應不同的目標 Node.js 版本
 * Each call asks `builtins` for a fresh list, so separate factory
 * instances can target different Node.js versions independently
 *
 * @param options - 建立選項（可省略）/ Creation options (optional)
 * @param options.targetNodeJSVersion - 比對清單所對應的 Node.js 版本，會傳給 `builtins` 套件 / Target Node.js version of the list, forwarded to the `builtins` package
 * @returns 包含清單與檢查函式的物件 / Object containing the list and the checker
 *
 * @example
 * ```ts
 * const { builtins, isBuiltinModule } = createNewIsBuiltinModule();
 * isBuiltinModule('fs'); // true
 * ```
 */
function createNewIsBuiltinModule(options) {
    /**
     * 內建模組清單；以 `?.` 容許未傳入 options 的呼叫方式
     * Builtin module list; `?.` allows the call to omit options entirely
     */
    const builtins = (0, builtins_1.default)(options === null || options === void 0 ? void 0 : options.targetNodeJSVersion);
    /**
     * 同時回傳清單與綁定該清單的檢查函式，
     * 讓使用者不必自行保存狀態
     * Returns both the list and a checker bound to it,
     * so callers do not have to keep state themselves
     */
    return {
        builtins,
        /**
         * 檢查名稱是否為內建模組 / Check whether a name is a builtin module
         *
         * @param moduleName - 模組名稱 / Module name
         * @returns 是否為內建模組 / Whether it is a builtin module
         * @throws {TypeError} 非字串輸入時拋出，避免 `includes` 回傳誤導的 false / Thrown on non-string input so `includes` cannot return a misleading false
         */
        isBuiltinModule(moduleName) {
            /**
             * 型別守衛 (Type guard)：`includes` 對非字串一律回傳 false，
             * 主動丟錯才能讓呼叫端立即發現傳參錯誤
             * Type guard: `includes` always returns false for non-strings, so
             * throwing surfaces caller mistakes immediately
             */
            if (typeof moduleName !== 'string') {
                throw new TypeError('Expected a string');
            }
            return builtins.includes(moduleName);
        },
    };
}
/**
 * 預建執行個體 (Pre-built instance)：模組載入時以預設選項建立一次，
 * 讓常用情境不必重複呼叫工廠
 * Pre-built instance created once with default options at module load,
 * so common usage does not have to invoke the factory repeatedly
 */
const { builtins, isBuiltinModule, } = createNewIsBuiltinModule();
exports.builtins = builtins;
exports.isBuiltinModule = isBuiltinModule;
/**
 * 預設匯出檢查函式 / Default export is the checker function
 */
exports.default = isBuiltinModule;
//# sourceMappingURL=index.js.map