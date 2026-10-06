"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports._createAble = _createAble;
exports._check = _check;
const finder_1 = require("./finder");
const array_hyper_unique_1 = require("array-hyper-unique");
const findPkgModuleCachePath_1 = require("./finder/findPkgModuleCachePath");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const is_writeable_path_1 = require("@lazy-node/is-writeable-path");
const upath2_1 = require("upath2");
/**
 * 整理並補齊快取選項，讓呼叫端可以只傳字串（視為 cwd）或部分選項
 * Normalize and fill in cache options so callers may pass only a string (treated as cwd) or a partial object
 *
 * @param {IOptions | string} [options] - 選項物件或單一字串 cwd / Options object or a plain cwd string
 * @returns {IOptions} 已補齊預設值的選項 / Options with defaults resolved
 */
function handleOptions(options) {
    var _a;
    /**
     * 字串形式是為了讓 `getCacheRoot('/some/dir')` 這類呼叫不必包一層物件
     * A string is wrapped so calls like `getCacheRoot('/some/dir')` need no object literal
     */
    if (typeof options === 'string') {
        options = {
            cwd: options,
        };
    }
    /**
     * 參數可能完全省略，退回空物件以避免後續解構失敗
     * The argument may be omitted entirely; fall back to an empty object so later destructuring is safe
     */
    options !== null && options !== void 0 ? options : (options = {});
    let { cwd = process.cwd(), fnOrder = finder_1.defaultOrder, } = options;
    /**
     * 自訂順序找不到結果時仍需預設順序兜底，否則專案外的環境會直接失敗；
     * disableDefaultFailback 可關閉這個行為
     * Custom order still needs the default order as a fallback, otherwise non-project environments fail outright;
     * disableDefaultFailback turns that behavior off
     */
    if (!options.disableDefaultFailback && options.fnOrder && fnOrder !== finder_1.defaultOrder) {
        /**
         * fnOrder 的型別為互斥的函式聯集，concat 會推導出不相容的陣列型別，
         * 此處執行期安全，故以 @ts-ignore 壓過
         * fnOrder is a union of mutually exclusive function types, so concat infers an incompatible array type;
         * it is safe at runtime, hence the @ts-ignore
         */
        // @ts-ignore
        fnOrder = fnOrder.concat(finder_1.defaultOrder);
        /**
         * 重複來源只會浪費 spawn 呼叫，去重後保留首次出現的順序
         * Duplicated sources only waste spawn calls; dedupe while keeping first-seen order
         */
        (0, array_hyper_unique_1.array_unique_overwrite)(fnOrder);
    }
    /**
     * 統一轉為絕對路徑，避免各 finder 以相對路徑比較目錄
     * Resolve to an absolute path so finders never compare directories as relative paths
     */
    options.cwd = (0, upath2_1.resolve)(cwd);
    options.fnOrder = fnOrder;
    (_a = options.processEnv) !== null && _a !== void 0 ? _a : (options.processEnv = process.env);
    /**
     * 明確布林化，讓呼叫端不必自己處理 truthy/falsy 混用
     * Explicitly coerce to boolean so callers need not juggle truthy/falsy values
     */
    options.create = !!options.create;
    return options;
}
/**
 * 判斷該快取來源是否允許建立目錄
 * Whether the given cache source is allowed to create its directory
 *
 * 專案內的 node_modules 來源必定可建立；其餘來源需明確設定 create，
 * 以免在唯讀或系統級位置擅自開目錄。
 * The in-project node_modules source is always creatable; other sources require an explicit create,
 * to avoid creating directories in read-only or system-wide locations.
 *
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @param {Function} fn - 目前嘗試的快取來源函式 / Cache source function currently being tried
 * @returns {boolean} 是否可建立目錄 / Whether the directory may be created
 */
function _createAble(options, fn) {
    return ((options === null || options === void 0 ? void 0 : options.create) === true || fn === finder_1.findPkgModuleCachePath || fn === findPkgModuleCachePath_1.findPkgModulePath || fn === findPkgModuleCachePath_1.findPkgPath);
}
/**
 * 驗證快取路徑可用性，必要時建立目錄
 * Validate that the cache path is usable, creating it when required
 *
 * 依序檢查「有回傳值」、「型別為字串」、「存在與可寫入」，
 * 每一層都給出不同的錯誤訊息，方便呼叫端分辨是找不到來源還是來源不可寫。
 * Checks value presence, string type, then existence/writability in order;
 * each layer yields a distinct error so callers can tell "no source" from "not writable".
 *
 * @param {string} dir - 待驗證的路徑 / Path to validate
 * @param {IOptions} options - 已整理的選項 / Normalized options
 * @returns {boolean} 驗證通過時回傳 true / True when validation passes
 * @throws {Error} 路徑無效、不存在或不可寫入時 / When the path is missing, absent, or read-only
 */
function _check(dir, options) {
    /**
     * 未找到任何來源時 dir 會是 undefined 或空字串，
     * 與「找到但不存在」需用不同錯誤區分
     * When no source matched, dir is undefined or empty; this must be distinguished
     * from "found but missing" so callers know whether to widen fnOrder
     */
    if (!(dir === null || dir === void 0 ? void 0 : dir.length)) {
        throw new Error(`can't found cache path`);
    }
    /**
     * 回傳非字串代表來源實作有誤（例如指令輸出未轉型），
     * 提早拋錯避免下游把數字當路徑使用
     * A non-string return indicates a broken source (e.g. uncoerced command output);
     * fail early so downstream code never treats a number as a path
     */
    else if (typeof dir !== 'string') {
        throw new Error(`not a path '${dir}'`);
    }
    /**
     * 目錄尚未存在時依 create 決定建立或報錯，
     * 預設不建立是為了避免在無意間污染使用者的檔案系統
     * A missing directory is either created or reported based on create;
     * defaulting to not creating avoids polluting the user's filesystem unexpectedly
     */
    else if (!(0, fs_1.existsSync)(dir)) {
        if (options.create) {
            (0, fs_extra_1.ensureDirSync)(dir);
        }
        else {
            throw new Error(`path not exists '${dir}'`);
        }
    }
    /**
     * 只讀目錄會讓後續寫入快取失敗，因此即使存在也視為不可用
     * A read-only directory would break later cache writes, so it counts as unusable even when it exists
     */
    if (!(0, is_writeable_path_1.isWritableDirectorySync)(dir)) {
        throw new Error(`path is not writeable '${dir}'`);
    }
    return true;
}
//# sourceMappingURL=util.js.map