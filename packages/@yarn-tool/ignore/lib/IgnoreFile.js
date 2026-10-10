"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreFile = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const fs_iconv_1 = require("fs-iconv");
const ignore_1 = tslib_1.__importDefault(require("ignore"));
const lines_1 = require("./lines");
const filter_1 = require("./filter");
const find_1 = require("./find");
const normalize_1 = require("./normalize");
/**
 * ignore 檔案編碼 (Encoding)，預設 utf8
 */
const ENCODING = 'utf8';
/**
 * 單一 ignore 檔案的封裝類別
 *
 * 組合「搜尋 / 讀取 / 編輯 / 保存 / 比對」各項邏輯，但只負責一個檔案。
 * composes find / read / edit / save / match logic, while handling only one file.
 */
class IgnoreFile {
    /**
     * 以檔案路徑建立實例（檔案不存在時視為空白檔案）
     *
     * @param path - ignore 檔案路徑
     * @param options - 實例設定，控管 {@link finalize}
     */
    static from = (path, options) => {
        const content = (0, fs_extra_1.pathExistsSync)(path) ? (0, fs_iconv_1.readFileSync)(path).toString() : '';
        return new this(path, content, options);
    };
    /**
     * 從目前目錄向上搜尋指定的 ignore 檔案並建立實例
     * Search upward from the current directory for the given ignore file
     *
     * 必須明確指定檔名：ignore 檔案有多種（`.gitignore`、`.npmignore`…），
     * 若只取搜尋結果的第一筆，會無法確定開的是 git 還是 npm 的 ignore 檔案。
     *
     * 找不到時回傳 `undefined`。
     *
     * @param fileName - 要搜尋的 ignore 檔名
     * @param cwd - 目前工作目錄或搜尋選項
     * @param opts - 搜尋選項與實例設定，見 {@link IFindIgnoreFileOptions}
     */
    static find(fileName, cwd, opts) {
        /**
         * `optimizations` 屬於實例設定而非搜尋選項，先取出，避免混進搜尋選項
         */
        const { optimizations, ...findOpts } = opts ?? {};
        /**
         * 逐層產生，找到第一個符合的目錄即可中斷，不必展開全部父層
         * Produced layer by layer, so the search can stop at the first matching
         * directory instead of materializing every parent directory
         */
        for (const { list } of (0, find_1.findIgnoreFilesGenerator)(cwd, {
            ...findOpts,
            fileNames: fileName,
        })) {
            const path = list[0]?.path;
            if (path) {
                return IgnoreFile.from(path, { optimizations });
            }
        }
        return undefined;
    }
    /**
     * ignore 檔案路徑
     */
    path;
    /**
     * 實例設定，控管 {@link finalize}
     */
    options;
    /**
     * 行陣列內容
     */
    _lines;
    _ignore;
    constructor(path, content, options) {
        this.path = path;
        this.options = options ?? {};
        this._lines = (0, lines_1.processToLines)(content ?? '');
        if (typeof this.options.endCount !== 'number' || typeof this.options.startCount !== 'number') {
            const { lines, startCount, endCount } = (0, normalize_1._omitBlankLines)(this._lines);
            this._lines = lines;
            if (this.options.startCount !== false)
                this.options.startCount = startCount;
            if (this.options.endCount !== false)
                this.options.endCount = endCount;
        }
    }
    /**
     * 目前的行陣列
     */
    get lines() {
        return this._lines;
    }
    /**
     * 目前的內容（LF 行尾）
     */
    get content() {
        return (0, normalize_1._stringifyEndOfLine)(this.options.startCount) + (0, lines_1.serializeLines)(this._lines) + (0, normalize_1._stringifyEndOfLine)(this.options.endCount);
    }
    /**
     * 目前所有規則
     */
    get patterns() {
        return (0, lines_1.listPatternsOnly)(this._lines);
    }
    /**
     * 是否已存在指定規則
     *
     * @param pattern - 規則
     */
    has(pattern) {
        return (0, filter_1.hasPattern)(this._lines, pattern);
    }
    /**
     * 新增規則（保留註解與空行）
     * Add rules (comments and blank lines are kept)
     *
     * 只與插入位置前方最近的一條規則比對，相同即略過；
     * 遠處的重複交由 {@link finalize} 在輸出前統一處理。
     *
     * @param patterns - 一條或多條規則
     */
    add(...patterns) {
        this._lines = (0, lines_1.addPatterns)(this._lines, patterns);
        this._ignore?.add(patterns);
        return this;
    }
    /**
     * 移除規則（保留註解與空行）
     * Remove rules (comments and blank lines are kept)
     *
     * @param patterns - 一條或多條規則
     */
    remove(...patterns) {
        this._lines = (0, lines_1.removePatterns)(this._lines, patterns);
        this._ignore = void 0;
        return this;
    }
    /**
     * 輸出前優化：移除重複規則（只保留最後一筆）並收合超過上限的空行
     *
     * 註解不參與去重，位置與數量都不會被更動。
     *
     * 以 {@link this.options.optimizations} 為預設值，`options` 參數覆寫之。
     *
     * @param options - 優化選項
     */
    finalize(options) {
        this._lines = (0, lines_1.finalizeIgnoreLines)(this._lines, {
            ...this.options.optimizations,
            ...options,
        });
        this._ignore = void 0;
        return this;
    }
    stringify(opts) {
        const { disableOptimize: optimize = true, optimizations } = opts ?? {};
        if (optimize) {
            this.finalize(optimizations);
        }
        return this.content;
    }
    /**
     * 保存到檔案
     *
     * 預設先執行優化再寫入；`optimize: false` 可保留未優化的行陣列。
     *
     * @param opts - 保存選項，見 {@link IIgnoreFileOptions}
     */
    save(opts) {
        (0, fs_extra_1.outputFileSync)(this.path, this.stringify(opts), {
            encoding: ENCODING,
        });
        return this;
    }
    /**
     * 建立比對 (matching) 用的 ignore 實例
     */
    toIgnore(force) {
        if (!this._ignore || force) {
            this._ignore = (0, ignore_1.default)(this.options.ignoreOptions).add(this.lines);
        }
        return this._ignore;
    }
    /**
     * 判斷路徑是否被忽略
     *
     * @param pathname - 相對路徑（需為正斜線）/ Relative path (forward slashes required)
     */
    isIgnored(pathname) {
        return this.toIgnore().ignores(pathname);
    }
    ignores(pathname) {
        return this.isIgnored(pathname);
    }
    test(pathname) {
        return this.toIgnore().test(pathname);
    }
    /**
     * Debugs gitignore / exclude files, which is equivalent to git check-ignore -v.
     * Usually this method is used for other packages to implement the function of git check-ignore -v upon node-ignore
     */
    checkIgnore(pathname) {
        return this.toIgnore().checkIgnore(pathname);
    }
    /**
     * 過濾出被忽略的路徑 / Filter out the ignored paths
     *
     * @param paths - 相對路徑列表 / List of relative paths
     */
    filter(pathnames) {
        return this.toIgnore().filter(pathnames);
    }
}
exports.IgnoreFile = IgnoreFile;
//# sourceMappingURL=IgnoreFile.js.map