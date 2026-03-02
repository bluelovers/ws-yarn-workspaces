"use strict";
/**
 * Lerna Changelog 工具函數模組
 * Lerna Changelog Utility Functions Module
 *
 * 處理選項的預設值和規範解析
 * Handles option defaults and preset resolution
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
const lodash_1 = require("lodash");
const require_resolve_1 = require("@yarn-tool/require-resolve");
const path_1 = require("path");
/**
 * 處理並標準化選項
 * Process and normalize options
 *
 * 設定預設值並解析 changelog 預設規範
 * Sets defaults and resolves changelog preset
 *
 * @param {IOptionsWithType<T>} [options] - 輸入選項 / Input options
 * @returns {IOptionsWithType<T>} 標準化後的選項 / Normalized options
 */
function handleOptions(options) {
    var _a, _b;
    /**
     * 預設的 Changelog 規範
     * Default changelog preset
     */
    const defaultChangelogPreset = '@bluelovers/conventional-changelog-bluelovers';
    /**
     * 設定預設選項值
     * Set default option values
     */
    options = (0, lodash_1.defaults)(options !== null && options !== void 0 ? options : {}, {
        type: 'independent',
        changelogPreset: void 0,
        tagPrefix: 'v',
    });
    /**
     * 確保 type 有有效值
     * Ensure type has valid value
     */
    if (typeof options.type !== 'string' || !options.type.length) {
        options.type = 'independent';
    }
    /**
     * 確保 tagPrefix 為字串
     * Ensure tagPrefix is string
     */
    if (typeof options.tagPrefix !== 'string') {
        options.tagPrefix = 'v';
    }
    /**
     * 處理空的 changelogPreset
     * Handle empty changelogPreset
     */
    if (typeof options.changelogPreset !== 'string' || !options.changelogPreset.length || !Boolean(options.changelogPreset)) {
        options.changelogPreset = void 0;
    }
    /**
     * 解析預設規範的路徑
     * Resolve default preset path
     */
    if (!options.changelogPreset || options.changelogPreset === defaultChangelogPreset) {
        options.changelogPreset = (_a = (0, require_resolve_1.requireResolveExtra)(defaultChangelogPreset, {
            includeGlobal: true,
            includeCurrentDirectory: true,
            paths: [
                (0, path_1.join)(__dirname, '../..'),
            ],
        }).result) !== null && _a !== void 0 ? _a : options.changelogPreset;
    }
    /**
     * 若仍未設定，使用 angular 作為後備
     * Fallback to angular if still not set
     */
    (_b = options.changelogPreset) !== null && _b !== void 0 ? _b : (options.changelogPreset = 'conventional-changelog-angular');
    return options;
}
/**
 * 嘗試載入指定模組
 * Try to require specified module
 *
 * @param {IChangelogPreset} name - 模組名稱 / Module name
 * @returns {any} 模組導出內容 / Module exports
 */
function tryRequire(name) {
    try {
        return (0, require_resolve_1.requireResolveCore)(name, {
            includeGlobal: true,
            includeCurrentDirectory: true,
        });
    }
    catch (err) {
        if (err.code !== "MODULE_NOT_FOUND") {
            throw new err;
        }
    }
}
//# sourceMappingURL=util.js.map