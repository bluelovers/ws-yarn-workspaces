"use strict";
/**
 * @fileoverview Scope YAML Handler - YAML 範圍處理器
 *
 * Provides functionality for managing workspace scope arrays in YAML configuration files.
 * Handles reading, writing, and modifying YAML files like pnpm-workspace.yaml
 * while preserving original formatting and comments.
 * 提供管理 YAML 設定檔中工作區範圍陣列的功能；
 * 讀取、寫入與修改 pnpm-workspace.yaml 等 YAML 檔時保留原有格式與註解。
 *
 * @module @yarn-tool/ws-scope/format/yaml
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeYaml = exports.SymRaw = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
const yawn_yaml_1 = tslib_1.__importDefault(require("yawn-yaml"));
/**
 * Symbol for storing the raw YAWN instance
 *
 * @constant {symbol}
 * @description Used to store the YAWN YAML parser instance privately
 */
const SymRaw = Symbol.for('raw');
exports.SymRaw = SymRaw;
/**
 * YAML file scope handler for workspace configuration
 * 工作區設定的 YAML 檔案範圍處理器
 *
 * @class ScopeYaml
 * @extends ScopeJsonObject<K>
 * @template K - The field name key (default: 'packages') / 欄位名稱鍵（預設：'packages'）
 * @description
 * Extends ScopeJsonObject to provide YAML-specific file operations.
 * Uses YAWN (YAML AST) to preserve original formatting, comments,
 * and structure when modifying YAML files.
 * 繼承 ScopeJsonObject 以提供 YAML 專屬的檔案操作；
 * 透過 YAWN（YAML AST）在修改時保留原有格式、註解與結構。
 *
 * This is particularly useful for pnpm-workspace.yaml files where
 * preserving the original format is important.
 * 這對 pnpm-workspace.yaml 尤其重要，因為保留原始格式是必要需求。
 *
 * @example
 * ```typescript
 * const handler = new ScopeYaml<'packages'>('/path/to/pnpm-workspace.yaml', {
 *   field: 'packages'
 * });
 * handler.loadFileLazy();
 * handler.add('packages/*');
 * handler.saveFile();
 * ```
 */
class ScopeYaml extends json_object_1.ScopeJsonObject {
    /**
     * Initializes the instance with YAML-specific defaults
     * 以 YAML 專屬預設值初始化實例
     *
     * @protected
     * @override
     * @description Sets the default field name to 'packages' for YAML files /
     * 將 YAML 檔案的預設欄位名稱設為 'packages'
     */
    _init() {
        var _a, _b;
        /**
         * options 為 protected 可選參數，TS 無法收窄其存在性，故以 @ts-ignore 維持寬鬆賦值；
         * 預設值改為 'packages'，與 pnpm-workspace.yaml 的欄位慣例一致
         * options is an optional protected parameter so TS cannot narrow its presence;
         * @ts-ignore keeps the lenient assignment. The default changes to 'packages'
         * to match the pnpm-workspace.yaml field convention
         */
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'packages';
    }
    /**
     * Gets the JSON representation of the YAML content
     * 取得 YAML 內容的 JSON 表示
     *
     * @override
     * @type {IJsonObject<K>}
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 解析後作為 JSON 物件的 YAML
     */
    // @ts-ignore
    get json() {
        var _a;
        /**
         * 以可選鏈回傳：檔案尚未載入時 this[SymRaw] 為 undefined，
         * 此時應回傳 undefined 而非拋錯，讓 opened 判斷得以成立
         * Optional chaining: before the file is loaded this[SymRaw] is undefined,
         * and we must return undefined instead of throwing so `opened` works
         */
        return (_a = this[SymRaw]) === null || _a === void 0 ? void 0 : _a.json;
    }
    /**
     * Sets the JSON content and updates the YAML representation
     * 設定 JSON 內容並更新 YAML 表示
     *
     * @override
     * @param {IJsonObject<K>} json - The JSON object to set / 要設定的 JSON 物件
     */
    set json(json) {
        /**
         * 透過 YAWN 的 json setter 寫入：YAWN 會同步更新底層 YAML 文字，
         * 才能在存檔時保留未變動區段的格式與註解
         * Write through YAWN's json setter: YAWN updates the underlying YAML text
         * in sync, so untouched sections keep their formatting and comments on save
         */
        this[SymRaw].json = json;
    }
    /**
     * Gets the scope array from the YAML content
     * 從 YAML 內容取得範圍陣列
     *
     * @override
     * @type {string[] | undefined}
     * @returns {string[] | undefined} The scope array or undefined / 範圍陣列或 undefined
     */
    get value() {
        var _a;
        return (_a = this.json) === null || _a === void 0 ? void 0 : _a[this.field];
    }
    /**
     * Sets the scope array in the YAML content
     * 設定 YAML 內容中的範圍陣列
     *
     * @override
     * @param {string[]} value - New scope array value / 新的範圍陣列值
     */
    set value(value) {
        /**
         * 先取回整個 json 再改欄位並回寫：透過自訂 setter 觸發 YAWN 更新，
         * 若直接操作 this.json[field] 會繞過攔截，導致格式保留機制失效
         * Fetch the whole json, mutate the field, then write back: going through the
         * custom setter triggers YAWN; mutating this.json[field] directly would bypass
         * the interception and break format preservation
         */
        const json = this.json;
        json[this.field] = value;
        this.json = json;
    }
    /**
     * Checks if the YAML file exists on disk
     * 檢查 YAML 檔案是否存在於磁碟上
     *
     * @returns {boolean} True if file exists / 若檔案存在則為 true
     */
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    /**
     * Checks if the YAML file has been loaded
     * 檢查 YAML 檔案是否已載入
     *
     * @override
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if YAWN instance exists / 若 YAWN 實例存在則為 true
     */
    get opened() {
        return !!this[SymRaw];
    }
    /**
     * Loads the YAML file content into memory
     * 將 YAML 檔案內容載入記憶體
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 解析後作為 JSON 物件的 YAML
     */
    loadFile(reload) {
        /**
         * 僅在強制重載或尚未載入時讀取：重複 load 會以磁碟舊內容
         * 蓋掉已變更但未儲存的修改
         * Read only on forced reload or first load: re-loading would overwrite
         * modified-but-unsaved content with the stale on-disk version
         */
        if (reload || !this.opened) {
            /**
             * 每次都建立全新 YAWN 實例：YAWN 以「首次解析」的樣式為基準保留格式，
             * 複用舊實例會讓已放棄的修改殘留在輸出中
             * Create a fresh YAWN each time: YAWN preserves formatting against the
             * initially parsed snapshot, so reusing an old instance would leak
             * already-discarded modifications into the output
             */
            let input = (0, fs_extra_1.readFileSync)(this.file).toString();
            let raw = new yawn_yaml_1.default(input);
            this[SymRaw] = raw;
        }
        return this.json;
    }
    /**
     * Saves the YAML content back to disk
     * 將 YAML 內容存回磁碟
     *
     * @description
     * Uses YAWN's yaml property to maintain original formatting
     * and comments when writing back to the file.
     * 寫回檔案時使用 YAWN 的 yaml 屬性，以保留原有格式與註解。
     */
    saveFile() {
        /**
         * 僅在已載入時寫入：未載入代表檔案不存在，寫入會憑空建立空檔
         * Write only when loaded: not loaded means the file is absent,
         * and writing would fabricate an empty file out of nowhere
         */
        if (this.opened) {
            (0, fs_extra_1.writeFileSync)(this.file, this[SymRaw].yaml);
        }
    }
    /**
     * Loads the YAML file only if it exists
     * 僅在檔案存在時載入 YAML 檔案
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 強制重新載入
     * @returns {IJsonObject<K>|false} The parsed YAML or false if file doesn't exist / 解析後的 YAML，或若檔案不存在則為 false
     */
    loadFileLazy(reload) {
        /**
         * 先檢查存在性：readFileSync 對缺檔會直接拋錯，
         * 而 pnpm-workspace.yaml 缺檔在此情境屬正常情況
         * Check existence first: readFileSync throws on a missing file, but a
         * missing pnpm-workspace.yaml is an expected situation here
         */
        return this.existsFile() && this.loadFile(reload);
    }
}
exports.ScopeYaml = ScopeYaml;
//# sourceMappingURL=yaml.js.map