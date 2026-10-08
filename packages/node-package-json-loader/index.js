"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJsonLoader = void 0;
const tslib_1 = require("tslib");
/**
 * npm-package-json-loader
 *
 * 用於載入、處理和寫入 package.json 的工具類別
 * Utility class for loading, processing, and writing package.json
 *
 * 支援自動修復、排序與驗證功能
 * Supports auto-fix, sorting, and verification features
 */
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = require("sort-package-json3");
const bind_decorator_1 = tslib_1.__importDefault(require("bind-decorator"));
const path_1 = tslib_1.__importDefault(require("path"));
const require_resolve_1 = require("@yarn-tool/require-resolve");
const exports_1 = require("@yarn-tool/pkg-entry-util/lib/field/exports");
const fs_json_1 = require("@bluelovers/fs-json");
const publishConfig_1 = require("@yarn-tool/pkg-entry-util/lib/field/publishConfig");
const bin_1 = require("@yarn-tool/pkg-entry-util/lib/field/bin");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const fixEmpty_1 = require("@yarn-tool/pkg-entry-util/lib/field/fixEmpty");
/**
 * package.json 載入器類別
 * Package.json loader class
 *
 * 提供載入、修改、排序、驗證和寫入 package.json 的完整功能
 * Provides complete functionality for loading, modifying, sorting, verifying, and writing package.json
 *
 * @template T - package.json 類型參數 / package.json type parameter
 *
 * @example
 * // 從檔案路徑載入 / Load from file path
 * const pkg = new PackageJsonLoader('/path/to/package.json');
 * pkg.read().autofix().sort().write();
 *
 * @example
 * // 從模組名稱載入 / Load from module name
 * const pkg = PackageJsonLoader.loadByModuleName('lodash');
 */
class PackageJsonLoader {
    /**
     * 建立 PackageJsonLoader 實例的工廠方法
     * Factory method to create PackageJsonLoader instance
     *
     * @template T - package.json 類型參數 / package.json type parameter
     * @param {IFileOrJson} file - 檔案路徑或 JSON 物件 / File path or JSON object
     * @param {any[]} argv - 額外參數 / Additional arguments
     * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
     */
    static create(file, ...argv) {
        return new this(file, ...argv);
    }
    /**
     * 從 JSON 物件建立實例
     * Create instance from JSON object
     *
     * @template T - package.json 類型參數 / package.json type parameter
     * @param {T} json - JSON 物件 / JSON object
     * @param {any[]} argv - 額外參數 / Additional arguments
     * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
     */
    static createByJson(json, ...argv) {
        return new this(json, ...argv);
    }
    /**
     * 透過模組名稱尋找 package.json 路徑
     * Find package.json path by module name
     *
     * @param {string} name - 模組名稱 / Module name
     * @returns {string} package.json 的絕對路徑 / Absolute path to package.json
     */
    static findPackageJsonPath(name) {
        return (0, require_resolve_1.resolvePackageJsonLocation)(name);
    }
    /**
     * 透過模組名稱載入 package.json
     * Load package.json by module name
     *
     * @template T - package.json 類型參數 / package.json type parameter
     * @param {string} name - 模組名稱 / Module name
     * @returns {PackageJsonLoader<T>} PackageJsonLoader 實例 / PackageJsonLoader instance
     * @throws {TypeError} 當套件名稱不符時拋出錯誤 / Throws when package name doesn't match
     */
    static loadByModuleName(name) {
        let file = this.findPackageJsonPath(name);
        let pkg = this.create(file);
        /**
         * 驗證載入的套件名稱是否與請求的名稱相符
         * Verify loaded package name matches requested name
         *
         * 名稱不符代表解析到同名的不同套件（例如 monorepo 內的重複名稱），應及早失敗
         * A mismatch means a different package with the same name was resolved (e.g. duplicates in a monorepo), so fail early
         */
        if (pkg.data.name !== name) {
            throw new TypeError(`package name not match, '${pkg.data.name}' != '${name}'`);
        }
        return pkg;
    }
    /**
     * 建構子
     * Constructor
     *
     * @param {IFileOrJson} fileOrJson - 檔案路徑、Buffer 或 JSON 物件 / File path, Buffer, or JSON object
     * @param {any[]} argv - 額外參數 / Additional arguments
     */
    constructor(fileOrJson, ...argv) {
        /**
         * 自訂處理函式佇列
         * Queue of custom processing functions
         */
        this._use = [];
        /**
         * 依輸入型別分流初始化
         * Dispatch initialization by input type
         *
         * 字串視為檔案路徑；Buffer 與物件皆以 toString() 後交給 JSON.parse 解析，
         * 因此傳入的內容必須能轉成合法的 JSON 字串
         * A string is treated as a file path; Buffer and object are parsed via JSON.parse after toString(),
         * so the input must convert to valid JSON text
         */
        if (typeof fileOrJson === 'string') {
            this.setFilename(fileOrJson);
        }
        else if (Buffer.isBuffer(fileOrJson)) {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (typeof fileOrJson === 'object') {
            /**
             * 此分支先於 null 檢查執行（typeof null === 'object'），
             * 因此傳入 null 會在 .toString() 拋出原生錯誤而非靜默忽略
             * This branch runs before the null check (typeof null === 'object'),
             * so passing null throws a native error at .toString() instead of being ignored
             */
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (fileOrJson != null) {
            /**
             * 只有 null / undefined 會靜默通過（建立空實例），
             * 其餘非預期型別（數值、布林值等）一律拒絕
             * Only null / undefined pass silently (empty instance);
             * other unexpected types (number, boolean, …) are always rejected
             */
            throw new TypeError(`fileOrJson is not valid`);
        }
    }
    /**
     * 註冊自訂處理函式
     * Register custom processing function
     *
     * @param {IItemOrItemArray<(json: IPackageJsonLike<T>) => void>} ls - 處理函式或函式陣列 / Processing function or array of functions
     */
    use(ls) {
        /**
         * 單一函式與陣列分流，兩者統一推入同一佇列，
         * 以保持 run() 執行順序不受輸入形式影響
         * Split single function vs array, both pushed into the same queue,
         * so run() execution order is unaffected by input form
         */
        if (Array.isArray(ls)) {
            this._use.push(...ls);
        }
        else {
            this._use.push(ls);
        }
    }
    /**
     * 設定檔案名稱
     * Set filename
     *
     * @param {string} file - 檔案路徑 / File path
     * @returns {this} 当前實例 / Current instance
     */
    setFilename(file) {
        // @ts-ignore
        this.file = file;
        return this;
    }
    /**
     * 設定 JSON 資料
     * Set JSON data
     *
     * @param {object | T} json - JSON 物件 / JSON object
     * @returns {this} 当前實例 / Current instance
     */
    setJson(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    /**
     * 讀取 package.json 檔案
     * Read package.json file
     *
     * @param {boolean} reload - 是否強制重新載入 / Whether to force reload
     * @returns {this} 当前實例 / Current instance
     */
    read(reload) {
        /**
         * 已載入時預設不重讀，避免後續 autofix / sort 的結果被靜默覆蓋；
         * 只有明確傳入 reload=true 才強制重新讀取
         * Once loaded, skip re-reading by default so later autofix / sort results are not silently overwritten;
         * only an explicit reload=true forces a fresh read
         */
        if (!this.loaded || reload) {
            this.json = (0, fs_json_1.readJSONSync)(this.file);
        }
        this.loaded = true;
        return this;
    }
    /**
     * 重新載入 package.json
     * Reload package.json
     *
     * @returns {this} 当前實例 / Current instance
     */
    reload() {
        return this.read(true);
    }
    /**
     * 取得 package.json 所在目錄
     * Get directory of package.json
     *
     * @returns {string} 目錄路徑 / Directory path
     */
    get dir() {
        return path_1.default.dirname(this.file);
    }
    /**
     * 取得跳過 TypeScript 類型檢查的資料
     * Get data without TypeScript type checking
     *
     * 用於需要靈活操作 JSON 資料的場景
     * Use when flexible JSON data manipulation is needed
     */
    get unsafeTypeData() {
        return this.data;
    }
    /**
     * 設定跳過 TypeScript 類型檢查的資料
     * Set data without TypeScript type checking
     */
    set unsafeTypeData(json) {
        this.data = json;
    }
    /**
     * 設定 package.json 資料
     * Set package.json data
     */
    set data(json) {
        this.overwrite(json);
    }
    /**
     * 取得 package.json 資料
     * Get package.json data
     *
     * 若尚未載入會自動讀取檔案
     * Automatically reads file if not loaded yet
     *
     * @returns {T} package.json 資料 / package.json data
     */
    get data() {
        /**
         * 惰性讀取：僅在尚未載入且已知檔案路徑時才讀檔，
         * 讓以 JSON 物件建立的實例不必依賴檔案系統
         * Lazy read: only reads when not yet loaded and a file path is known,
         * so instances created from a JSON object never depend on the file system
         */
        if (!this.loaded && this.file) {
            this.read();
        }
        return this.json;
    }
    /**
     * 覆寫 JSON 資料
     * Overwrite JSON data
     *
     * @param {object | T} json - 新的 JSON 資料 / New JSON data
     * @returns {this} 当前實例 / Current instance
     */
    overwrite(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    /**
     * 自動修復 package.json 欄位
     * Auto-fix package.json fields
     *
     * 執行以下修復操作：
     * 1. 修復 bin 欄位路徑
     * 2. 修復 publishConfig 欄位
     * 3. 添加 exports 中的 package.json entry
     * 4. 清理空欄位
     *
     * Performs the following fix operations:
     * 1. Fix bin field paths
     * 2. Fix publishConfig field
     * 3. Add package.json entry in exports
     * 4. Clean empty fields
     */
    autofix() {
        var _a;
        let self = this;
        let dir;
        /**
         * 只有已知檔案路徑且目錄實際存在時才做路徑相關修復，
         * 因為 bin 與 publishConfig 的修正需要真實目錄來解析相對路徑
         * Only perform path-related fixes when a file path is known and the directory really exists,
         * because fixing bin and publishConfig requires a real directory to resolve relative paths
         */
        if (self.file && (0, fs_extra_1.pathExistsSync)(dir = self.dir)) {
            if (self.data) {
                (0, bin_1.fixPkgBinField)(self.data, dir);
                (0, publishConfig_1.fixPublishConfig)(self.data);
            }
        }
        /**
         * exports 的 package.json entry 與空欄位清理不依賴實體目錄，
         * 因此放在條件之外執行，讓純 JSON 實例也能修復
         * The exports package.json entry and empty-field cleanup do not rely on a physical directory,
         * so they run outside the guard to let JSON-only instances be fixed too
         */
        (0, exports_1._pkgExportsAddPJsonEntryCore)((_a = self.data) === null || _a === void 0 ? void 0 : _a.exports);
        (0, fixEmpty_1.fixEmptyFields)(self.data, dir);
    }
    /**
     * 執行處理流程
     * Run processing pipeline
     *
     * @param {object} options - 選項 / Options
     * @param {boolean} options.autofix - 是否執行自動修復 / Whether to run auto-fix
     * @returns {this} 当前實例 / Current instance
     */
    run(options = {}) {
        /**
         * autofix 未指定或為 truthy 時執行自動修復，
         * 讓「不傳選項」與「明確開啟」行為一致
         * Auto-fix runs when autofix is unspecified or truthy,
         * so "no options" and "explicitly enabled" behave the same
         */
        if (options.autofix == null || options.autofix) {
            this.autofix();
        }
        /**
         * 依註冊順序執行處理函式；以 call(this, data) 綁定實例，
         * 使函式內可用 this 取得檔路徑等上下文
         * Run handlers in registration order; bound via call(this, data)
         * so handlers can access instance context such as the file path
         */
        this._use.forEach(fn => fn.call(this, this.data));
        return this;
    }
    /**
     * 檢查檔案是否存在
     * Check if file exists
     *
     * @returns {boolean} 檔案是否存在 / Whether file exists
     */
    exists() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    /**
     * 將 JSON 資料轉換為字串
     * Convert JSON data to string
     *
     * @returns {string} 格式化的 JSON 字串 / Formatted JSON string
     */
    stringify() {
        return JSON.stringify(this.json, null, 2);
    }
    /**
     * 排序 package.json 欄位
     * Sort package.json fields
     *
     * 使用 sort-package-json3 套件進行標準化排序
     * Use sort-package-json3 package for standardized sorting
     *
     * @returns {this} 当前實例 / Current instance
     * @throws {Error} 當資料為 undefined 或 null 時拋出錯誤 / Throws when data is undefined or null
     */
    sort() {
        /**
         * 先行檢查資料狀態：sortPackageJson 對 undefined / null 會產生難懂的錯誤，
         * 於此轉為明確訊息，方便呼叫端辨識「尚未載入」的情況
         * Guard the data state first: sortPackageJson fails with an obscure error on undefined / null,
         * so throw a clear message instead to reveal the "not loaded yet" case
         */
        if (typeof this.data === 'undefined' || this.data === null) {
            throw new Error(`data is undefined`);
        }
        this.data = (0, sort_package_json3_1.sortPackageJson)(this.data);
        return this;
    }
    /**
     * 寫入 package.json 檔案
     * Write package.json file
     *
     * @returns {this} 当前實例 / Current instance
     * @throws {Error} 當檔案路徑未設定時拋出錯誤 / Throws when file path is not set
     */
    write() {
        /**
         * 未設定檔路徑時拒絕寫入：以 JSON 物件建立的實例沒有目標檔案，
         * 直接寫入會覆寫到不明位置
         * Refuse to write without a file path: instances built from a JSON object have no target file,
         * and writing would overwrite an unknown location
         */
        if (!this.file) {
            throw new Error(`file is undefined`);
        }
        (0, write_package_json_1.outputPackageJSONSync)(this.file, this.json);
        return this;
    }
    /**
     * 僅在已載入時寫入
     * Write only when loaded
     *
     * @returns {boolean} 是否已寫入 / Whether written
     */
    writeOnlyWhenLoaded() {
        /**
         * 只有真正載入過資料才寫檔，避免把空的 / 未初始化的內容覆蓋原檔
         * Write only when data was actually loaded, to avoid overwriting the original file with empty / uninitialized content
         */
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
exports.PackageJsonLoader = PackageJsonLoader;
tslib_1.__decorate([
    bind_decorator_1.default,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], PackageJsonLoader, "create", null);
tslib_1.__decorate([
    bind_decorator_1.default,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
exports.default = PackageJsonLoader;
//# sourceMappingURL=index.js.map