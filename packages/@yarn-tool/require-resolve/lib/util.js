"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validSymbols = exports.defaultMap = exports.SymbolModuleMain = exports.SymbolGlobalYarn = exports.SymbolGlobalNpm = exports.SymbolGlobal = exports.SymbolCurrentDirectory = void 0;
exports.unshiftArray = unshiftArray;
exports.handleOptionsPaths = handleOptionsPaths;
exports.getTargetName = getTargetName;
exports.isValidPathSymbol = isValidPathSymbol;
const get_paths_by_type_1 = require("@yarn-tool/get-paths-by-type");
Object.defineProperty(exports, "SymbolCurrentDirectory", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolCurrentDirectory; } });
Object.defineProperty(exports, "SymbolGlobal", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobal; } });
Object.defineProperty(exports, "SymbolGlobalNpm", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobalNpm; } });
Object.defineProperty(exports, "SymbolGlobalYarn", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolGlobalYarn; } });
Object.defineProperty(exports, "SymbolModuleMain", { enumerable: true, get: function () { return get_paths_by_type_1.SymbolModuleMain; } });
/**
 * 預設的模組名稱對應表
 * Default module name mapping
 *
 * 某些模組的入口點與模組名稱不同，此對應表用於轉換。
 * Some modules have entry points different from their names, this mapping handles the conversion.
 */
exports.defaultMap = {
    tsdx: 'tsdx/dist/index',
};
/**
 * 將元素插入陣列開頭（若不存在）
 * Unshift item to array if not already at beginning
 *
 * @typeParam T - 陣列元素類型 / Array element type
 * @param array - 目標陣列 / Target array
 * @param item - 要插入的元素 / Item to insert
 * @returns 修改後的陣列 / Modified array
 */
function unshiftArray(array, item) {
    if (array[0] !== item) {
        array.unshift(item);
    }
    return array;
}
/**
 * 處理選項中的路徑陣列，將符號轉換為實際路徑
 * Process paths array in options, converting symbols to actual paths
 *
 * @param paths - 路徑陣列，可包含符號或實際路徑 / Path array, can contain symbols or actual paths
 * @param cwd - 工作目錄 / Working directory
 * @returns 轉換後的實際路徑陣列 / Converted actual path array
 */
function handleOptionsPaths(paths, cwd) {
    if (paths === null || paths === void 0 ? void 0 : paths.length) {
        const result = paths.reduce((acc, value) => {
            switch (value) {
                case get_paths_by_type_1.SymbolGlobal:
                case get_paths_by_type_1.SymbolCurrentDirectory:
                case get_paths_by_type_1.SymbolGlobalNpm:
                case get_paths_by_type_1.SymbolGlobalYarn:
                case get_paths_by_type_1.SymbolModuleMain:
                    // 將符號轉換為實際路徑 / Convert symbol to actual paths
                    acc.push(...(0, get_paths_by_type_1.getPathsByType)(value, cwd));
                    break;
                default:
                    // 處理字串路徑 / Handle string path
                    if (value !== null && value !== void 0 ? value : false) {
                        acc.push(value);
                    }
            }
            return acc;
        }, []);
        return result.length ? result : undefined;
    }
    return undefined;
}
/**
 * 取得目標模組名稱
 * Get target module name
 *
 * 優先使用自訂對應表，其次使用預設對應表，最後使用原始名稱。
 * Prefers custom mapping, then default mapping, finally uses original name.
 *
 * @param name - 原始模組名稱 / Original module name
 * @param map - 自訂對應表 / Custom mapping table
 * @returns 目標模組名稱 / Target module name
 */
function getTargetName(name, map) {
    var _a, _b;
    return (_b = (_a = map === null || map === void 0 ? void 0 : map[name]) !== null && _a !== void 0 ? _a : exports.defaultMap[name]) !== null && _b !== void 0 ? _b : name;
}
/**
 * Symbol 類型陣列，用於驗證 includeGlobal 陣列中的元素
 * Array of Symbol types for validation in includeGlobal array
 */
exports.validSymbols = [
    get_paths_by_type_1.SymbolGlobalYarn,
    get_paths_by_type_1.SymbolGlobalNpm,
    get_paths_by_type_1.SymbolCurrentDirectory,
    get_paths_by_type_1.SymbolGlobal,
    get_paths_by_type_1.SymbolModuleMain,
];
/**
 * 檢查值是否為有效的 Symbol 路徑類型
 * Check if value is a valid Symbol path type
 *
 * @param value - 要檢查的值 / Value to check
 * @returns 是否為有效的 Symbol / Whether it's a valid Symbol
 */
function isValidPathSymbol(value) {
    return exports.validSymbols.includes(value);
}
//# sourceMappingURL=util.js.map