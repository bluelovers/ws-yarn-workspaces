import ignore from 'ignore';
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
import { ICheckIgnoreResult, ICwdOrFindIgnoreFilesOptions, IFinalizeIgnoreLinesOptions, IFindIgnoreFileOptions, IIgnoreFileOptions } from './types';
/**
 * 單一 ignore 檔案的封裝類別
 *
 * 組合「搜尋 / 讀取 / 編輯 / 保存 / 比對」各項邏輯，但只負責一個檔案。
 * composes find / read / edit / save / match logic, while handling only one file.
 */
export declare class IgnoreFile implements ignore.Ignore {
    /**
     * 以檔案路徑建立實例（檔案不存在時視為空白檔案）
     *
     * @param path - ignore 檔案路徑
     * @param options - 實例設定，控管 {@link finalize}
     */
    static from: (path: string, options?: IIgnoreFileOptions) => IgnoreFile;
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
    static find(fileName: string, cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFileOptions): IgnoreFile | undefined;
    /**
     * ignore 檔案路徑
     */
    readonly path: string;
    /**
     * 實例設定，控管 {@link finalize}
     */
    readonly options: IIgnoreFileOptions;
    /**
     * 行陣列內容
     */
    protected _lines: string[];
    /**
     * ignore 比對實例的快取，由 {@link toIgnore} 建立；
     * 行陣列變動後的處置見各操作方法內部的說明
     * Cache of the ignore instance built by {@link toIgnore};
     * see the comment inside each mutating method for how it is handled after the lines change
     */
    protected _ignore: ReturnType<typeof ignore>;
    /**
     * 以內容與路徑建立實例
     *
     * 建構時會先剝除首尾的空行，
     * 並把剝除數量記錄到 {@link options} 的 `startCount` / `endCount`，
     * 之後由 {@link content} / {@link stringify} 依數量還原結尾換行；
     * 傳入 `false` 的一項表示該側不自動記錄。
     * Leading/trailing blank lines are stripped at construction and the counts are
     * recorded as `startCount` / `endCount` in {@link options}, so {@link content} /
     * {@link stringify} can restore the newlines; passing `false` for one of them
     * disables the automatic recording on that side.
     *
     * @param path - ignore 檔案路徑
     * @param content - 檔案內容或行陣列，省略時視為空白檔案
     * @param options - 實例設定，控管 {@link finalize}
     */
    constructor(path: string, content?: ITSValueOrArrayMaybeReadonly<string>, options?: IIgnoreFileOptions);
    /**
     * 目前的行陣列
     */
    get lines(): readonly string[];
    /**
     * 目前的內容（LF 行尾）
     *
     * 兩側刻意不同：`startCount` 收斂（超出範圍的數字夾進範圍），
     * `endCount` 維持回歸預設值（`_normalizeEndCount` 內建的上限）
     * The two sides differ on purpose: `startCount` converges (an out-of-range
     * number is clamped into range) while `endCount` keeps falling back to the
     * default built into `_normalizeEndCount` (the upper bound)
     */
    get content(): string;
    /**
     * 目前所有規則
     */
    get patterns(): string[];
    /**
     * 是否已存在指定規則
     *
     * @param pattern - 規則
     */
    has(pattern: string): boolean;
    /**
     * 新增規則（保留註解與空行）
     * Add rules (comments and blank lines are kept)
     *
     * 只與插入位置前方最近的一條規則比對，相同即略過；
     * 遠處的重複交由 {@link finalize} 在輸出前統一處理。
     *
     * @param patterns - 一條或多條規則
     */
    add(...patterns: string[]): this;
    addList(patterns: string[], force?: boolean): this;
    /**
     * 移除規則（保留註解與空行）
     * Remove rules (comments and blank lines are kept)
     *
     * @param patterns - 一條或多條規則
     */
    remove(...patterns: string[]): this;
    /**
     * 輸出前優化（就地更新行陣列）
     * Optimize before output (updates the lines in place)
     *
     * 依序執行：移除重複規則（只保留最後一筆）、收合超過上限的連續空行、
     * 移除首尾空行；三項皆可個別關閉。
     * Runs in order: drop duplicate rules (keep the last one), collapse blank runs
     * beyond the bound, and strip leading/trailing blank lines; each step can be
     * disabled individually.
     *
     * 註解不參與去重，位置與數量都不會被更動。
     * 以 {@link this.options.optimizations} 為預設值，`options` 參數覆寫之。
     *
     * @param options - 優化選項
     */
    finalize(options?: IFinalizeIgnoreLinesOptions): this;
    /**
     * 取得目前內容（LF 行尾），預設先執行優化再輸出
     * Get the current content (LF line endings), optimizing before output by default
     *
     * 優化會就地更新行陣列（同 {@link finalize}）；
     * `disableOptimize: false` 可取得未優化的輸出，
     * `optimizations` 則覆寫實例上的設定（見 {@link IIgnoreFileOptions}）。
     * Optimizing updates the lines in place (same as {@link finalize}); pass
     * `disableOptimize: false` for the un-optimized output, and `optimizations`
     * overrides the instance settings (see {@link IIgnoreFileOptions})
     *
     * @param opts - 輸出選項，見 {@link IIgnoreFileOptions}
     */
    stringify(opts?: IIgnoreFileOptions): string;
    /**
     * 保存到檔案
     * Save to the file
     *
     * 內容來自 {@link stringify}：預設先執行優化再寫入；
     * `disableOptimize: false` 可寫入未優化的內容。
     * The content comes from {@link stringify}: it optimizes before writing by
     * default; pass `disableOptimize: false` to write the un-optimized content
     *
     * @param opts - 保存選項，見 {@link IIgnoreFileOptions}
     */
    save(opts?: IIgnoreFileOptions): this;
    outputFile(path: string, opts?: IIgnoreFileOptions): this;
    /**
     * 建立比對 (matching) 用的 ignore 實例
     * Build the ignore instance used for matching
     *
     * 預設回傳快取以避免重複建立；`force` 為 `true` 時改以目前行陣列重建。
     * Returns the cached instance by default to avoid rebuilding; pass `force` as
     * `true` to rebuild from the current lines.
     *
     * @param force - 強制以目前行陣列重建 / Force a rebuild from the current lines
     */
    toIgnore(force?: boolean): ReturnType<typeof ignore>;
    /**
     * 判斷路徑是否被忽略
     *
     * @param pathname - 相對路徑（需為正斜線）/ Relative path (forward slashes required)
     */
    isIgnored(pathname: string): boolean;
    /**
     * 判斷路徑是否被忽略（`isIgnored` 的別名）
     * Whether the path is ignored (an alias of isIgnored)
     *
     * 刻意沿用 `import ignore from 'ignore'` 的 `ignores()` 名稱：
     * 如此一來，只要求 `{ ignores(pathname: string): boolean }` 的型別
     * 可以同時接受 IgnoreFile 與 ignore 套件建立的實例，兩者可互換使用。
     * The `ignores()` name deliberately matches `import ignore from 'ignore'`:
     * any type that only requires `{ ignores(pathname: string): boolean }` accepts
     * both an IgnoreFile and an instance created by the ignore package, so the two
     * are interchangeable.
     *
     * @param pathname - 相對路徑（需為正斜線）/ Relative path (forward slashes required)
     */
    ignores(pathname: string): boolean;
    /**
     * 回傳路徑的比對結果，同名相容 `ignore` 套件的 `test()`
     * The matching result of the path, name-compatible with the ignore package's `test()`
     *
     * 與 `ignores()` 相同的理由：同名同回傳值，讓接受 ignore 實例的程式碼也能直接傳入 IgnoreFile。
     * For the same reason as `ignores()`: identical name and return value, so code
     * accepting an ignore instance also accepts an IgnoreFile directly.
     */
    test(pathname: string): ICheckIgnoreResult;
    /**
     * Debugs gitignore / exclude files, which is equivalent to git check-ignore -v.
     * Usually this method is used for other packages to implement the function of git check-ignore -v upon node-ignore
     *
     * 同名相容 `ignore` 套件的 `checkIgnore()`，回傳值也相同（{@link ICheckIgnoreResult}）。
     * Name-compatible with the ignore package's `checkIgnore()`, returning the same
     * {@link ICheckIgnoreResult}.
     */
    checkIgnore(pathname: string): ICheckIgnoreResult;
    /**
     * 過濾出被忽略的路徑 / Filter out the ignored paths
     *
     * 同名相容 `ignore` 套件的 `filter()`；與 `ignores()` 相同的理由，
     * 接受 ignore 實例的型別也能直接接受 IgnoreFile。
     * Name-compatible with the ignore package's `filter()`; for the same reason as
     * `ignores()`, a type accepting an ignore instance also accepts an IgnoreFile.
     *
     * @param paths - 相對路徑列表 / List of relative paths
     */
    filter(pathnames: ITSArrayListMaybeReadonly<string>): string[];
    createFilter(): (pathname: string) => boolean;
}
