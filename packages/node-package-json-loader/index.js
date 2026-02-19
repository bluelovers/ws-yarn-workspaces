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
const resolve_package_1 = require("@yarn-tool/resolve-package");
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
        return (0, resolve_package_1.resolvePackageJsonLocation)(name);
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
        // 驗證載入的套件名稱是否與請求的名稱相符
        // Verify loaded package name matches requested name
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
        // 根據輸入類型初始化實例 / Initialize instance based on input type
        if (typeof fileOrJson === 'string') {
            this.setFilename(fileOrJson);
        }
        else if (Buffer.isBuffer(fileOrJson)) {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (typeof fileOrJson === 'object') {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (fileOrJson != null) {
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
        // 檢查檔案和目錄是否存在
        // Check if file and directory exist
        if (self.file && (0, fs_extra_1.pathExistsSync)(dir = self.dir)) {
            if (self.data) {
                // 修復 bin 欄位路徑 / Fix bin field paths
                (0, bin_1.fixPkgBinField)(self.data, dir);
                // 修復 publishConfig 欄位 / Fix publishConfig field
                (0, publishConfig_1.fixPublishConfig)(self.data);
            }
        }
        // 在 exports 中添加 package.json entry / Add package.json entry in exports
        (0, exports_1._pkgExportsAddPJsonEntryCore)((_a = self.data) === null || _a === void 0 ? void 0 : _a.exports);
        // 清理空欄位 / Clean empty fields
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
        // 預設執行自動修復 / Default to run auto-fix
        if (options.autofix == null || options.autofix) {
            this.autofix();
        }
        // 執行所有註冊的處理函式 / Execute all registered processing functions
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