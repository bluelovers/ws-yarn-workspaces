"use strict";
/**
 * @fileoverview Scope JSON Object Base Class - JSON/JSON/YAML
 *
 * Provides base functionality for managing workspace scope arrays in JSON-like objects.
 * This is the parent class for both JSON and YAML scope handlers.
 *
 * @module @yarn-tool/ws-scope/format/json-object
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJsonObject = void 0;
const arrayAdd_1 = require("../util/arrayAdd");
/**
 * Base class for managing workspace scope arrays in configuration files
 *
 * @class ScopeJsonObject
 * @template K - The field name key for the scope array
 * @description
 * Provides common functionality for adding, removing, and tracking changes
 * to workspace scope arrays in JSON-like configuration objects.
 *
 * This class serves as the foundation for both JSON and YAML scope handlers,
 * offering a unified interface for workspace scope management.
 *
 * @example
 * ```typescript
 * const scope = new ScopeJsonObject<'workspaces'>('/path/to/package.json', {
 *   field: 'workspaces'
 * });
 * scope.add('packages/*');
 * console.log(scope.changed); // true
 * ```
 */
class ScopeJsonObject {
    /**
     * Creates a new ScopeJsonObject instance
     * 建立新的 ScopeJsonObject 實例
     *
     * @constructor
     * @param {string} file - Path to the configuration file / 設定檔路徑
     * @param {Object} [options] - Configuration options / 設定選項
     * @param {K} [options.field] - The field name for scope array / 範圍陣列的欄位名稱
     */
    constructor(file, options) {
        this.file = file;
        this.options = options;
        /**
         * Flag indicating whether the scope array has been modified
         * 標示範圍陣列是否已被修改；採累積（不自動歸零），供 save() 決定是否寫檔
         * Accumulative flag (never auto-reset) indicating whether the scope array
         * was modified; used by save() to decide whether a write is needed
         *
         * @type {boolean}
         */
        this.changed = false;
        this._init();
    }
    /**
     * Initializes the instance with default values
     * 以預設值初始化實例
     *
     * @protected
     * @description Sets the field name from options or defaults to 'workspaces' /
     * 從 options 取得欄位名稱，未提供時預設為 'workspaces'
     */
    _init() {
        var _a, _b;
        /**
         * options 為 protected 可選參數，TS 無法收窄其存在性，故以 @ts-ignore 維持寬鬆賦值
         * options is an optional protected parameter, so TS cannot narrow its
         * presence; @ts-ignore keeps the lenient assignment
         */
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'workspaces';
    }
    /**
     * Checks if the JSON object has been loaded
     * 檢查 JSON 物件是否已載入
     *
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if JSON object is loaded / 若 JSON 物件已載入則為 true
     */
    get opened() {
        return !!this.json;
    }
    /**
     * Adds a scope path to the array
     * 將範圍路徑新增至陣列
     *
     * @param {string} scope - Scope path to add / 要新增的範圍路徑
     * @returns {boolean} True if the array was modified / 若陣列已被修改則為 true
     */
    add(scope) {
        let { changed, value } = (0, arrayAdd_1.arrayAdd)(scope, this.value);
        this.value = value;
        /**
         * 以 ||= 累積變更狀態：一旦任何一次新增生效，就必須保留「已變更」結果，
         * 不能被後續無變動的呼叫覆寫回 false
         * Accumulate with ||= : once any add took effect, the "changed" result must
         * persist and must not be overwritten back to false by later no-op calls
         */
        this.changed || (this.changed = changed);
        return this.changed;
    }
    /**
     * Adds a scope path only if the file has been opened
     * 僅在檔案已載入時新增範圍路徑
     *
     * @param {string} scope - Scope path to add / 要新增的範圍路徑
     * @returns {boolean|undefined} True if modified, undefined if not opened /
     * 若已修改則為 true，未載入則為 undefined
     */
    addLazy(scope) {
        /**
         * 設定檔可能不存在（lazy 語意）；對未載入的空殼寫入會憑空建立無效資料，
         * 因此以 opened 短路略過
         * The config file may be absent (lazy semantics); writing into an unloaded
         * shell would fabricate invalid data, so short-circuit on `opened`
         */
        return this.opened && this.add(scope);
    }
    /**
     * Removes a scope path from the array
     * 從陣列移除範圍路徑
     *
     * @param {string} scope - Scope path to remove / 要移除的範圍路徑
     * @returns {boolean} True if the array was modified / 若陣列已被修改則為 true
     */
    remove(scope) {
        /**
         * 與 addLazy 相同理由：未載入的檔案不做任何修改
         * Same rationale as addLazy: never modify an unloaded file
         */
        if (this.opened) {
            let { changed, value } = (0, arrayAdd_1.arrayRemove)(scope, this.value);
            this.value = value;
            this.changed || (this.changed = changed);
        }
        return this.changed;
    }
    /**
     * Removes a scope path only if the file has been opened
     * 僅在檔案已載入時移除範圍路徑
     *
     * @param {string} scope - Scope path to remove / 要移除的範圍路徑
     * @returns {boolean|undefined} True if modified, undefined if not opened /
     * 若已修改則為 true，未載入則為 undefined
     */
    removeLazy(scope) {
        return this.opened && this.remove(scope);
    }
    /**
     * Gets the scope array from the JSON object
     * 從 JSON 物件取得範圍陣列
     *
     * @readonly
     * @type {string[] | undefined}
     * @returns {string[] | undefined} The scope array or undefined if not loaded /
     * 範圍陣列，未載入時為 undefined
     */
    get value() {
        var _a;
        return (_a = this.json) === null || _a === void 0 ? void 0 : _a[this.field];
    }
    /**
     * Sets the scope array in the JSON object
     * 設定 JSON 物件中的範圍陣列
     *
     * @param {string[]} value - New scope array value / 新的範圍陣列值
     */
    set value(value) {
        /**
         * 直接指派而非替換整個 json：讓子類別（如 YAML 的 YAWN parser）
         * 可在 setter 中攔截變更並保留原有格式
         * Assign in place instead of replacing the whole json: lets subclasses
         * (e.g. YAWN parser for YAML) intercept changes in the setter and preserve formatting
         */
        this.json[this.field] = value;
    }
}
exports.ScopeJsonObject = ScopeJsonObject;
//# sourceMappingURL=json-object.js.map