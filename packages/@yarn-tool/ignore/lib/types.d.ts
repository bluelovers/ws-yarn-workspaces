import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from "ts-type";
import ignore from 'ignore';
import { IOptionsFindUpPathsWorkspaces } from '@yarn-tool/ws-find-up-paths';
export declare enum EnumConst {
    /**
     * 未指定 `startCount` 時的預設值：檔案頂端不補空行
     * Default used when `startCount` is not given: no blank lines at the top of the file
     */
    DEFAULT_START_COUNT = 0,
    /**
     * 連續空行的上限，超過此數量的空行會被縮減到此數量
     * Upper bound of consecutive blank lines; longer runs are shrunk to this size
     */
    MAX_BLANK_LINES = 3,
    /**
     * 註解的前綴
     */
    COMMENT_PREFIX = "#",
    /**
     * 負規則的前綴
     * Prefix for negative rules
     */
    NEG_PREFIX = "!"
}
/**
 * IgnoreFile 的設定值，以物件形式保留並據此控管 {@link IgnoreFile.finalize}
 *
 * 選項命名為 `optimizations`（優化項目）而非 `finalize`：
 * 它描述「要做哪些優化」，而 `finalize` 是「執行這些優化的時機」。
 */
export interface IIgnoreFileOptions {
    /**
     * 輸出前優化的設定（移除重複規則、收合空行、移除首尾空行）
     * Optimization settings applied before output (drop duplicate rules, collapse blank lines, strip leading/trailing blank lines)
     *
     * 實例上的這份設定是 {@link IgnoreFile.finalize} 的預設值，
     * `finalize()` 傳入的選項會覆寫它們。
     */
    optimizations?: IFinalizeIgnoreLinesOptions;
    ignoreOptions?: Parameters<typeof ignore>[0] & ignore.Options;
    /**
     * 檔案開頭的換行數，輸出時還原為 LF
     * Number of newlines at the start of the file, restored as LF on output
     *
     * 未指定時由建構子以實際內容記錄（見建構子說明）；
     * 傳 `false` 表示不還原，數字則會收合到 MAX_BLANK_LINES 上限。
     * When omitted the constructor records it from the actual content (see the
     * constructor); pass `false` to restore nothing, and a number is clamped to
     * the MAX_BLANK_LINES bound
     */
    startCount?: boolean | number;
    /**
     * 檔案結尾的換行數，輸出時還原為 LF
     * Number of newlines at the end of the file, restored as LF on output
     *
     * 行為同 {@link startCount}：未指定時由建構子記錄、`false` 不還原、
     * 數字收合到 MAX_BLANK_LINES 上限。
     * Behaves like {@link startCount}: recorded by the constructor when omitted,
     * `false` restores nothing, and a number is clamped to the MAX_BLANK_LINES bound
     */
    endCount?: boolean | number;
    /**
     * 這次輸出是否停用優化（只有明確傳入 `false` 才會停用）
     * Whether to skip the optimization for this output (only an explicit `false` skips)
     *
     * `optimizations` 決定「優化哪些項目」，`disableOptimize` 只決定「這次輸出要不要做」；
     * 省略或傳 `true` 皆會執行優化。
     * `optimizations` decides which steps run, while `disableOptimize` only decides
     * whether this output performs them; omitting it or passing `true` optimizes
     */
    disableOptimize?: boolean;
}
/**
 * 常見 ignore 檔案名稱的單一事實來源
 * Single source of truth for common ignore file names
 *
 * 搜尋 ignore 檔案時的所有名稱皆由此定義，避免各處重複宣告。
 * All names used when searching for ignore files are defined here,
 * avoiding duplicated declarations across the codebase.
 */
export declare const DEFAULT_IGNORE_FILE_NAMES: readonly [".gitignore", ".npmignore", ".eslintignore", ".prettierignore", ".stylelintignore", ".dockerignore"];
/**
 * ignore 檔案搜尋選項
 * Options for searching ignore files
 *
 * 擴展自 {@link IOptionsFindUpPathsWorkspaces}，
 * 因此可直接使用 `stopAtCurrentPackage` 控制搜尋範圍。
 */
export interface IFindIgnoreFilesOptions extends IOptionsFindUpPathsWorkspaces {
    /**
     * 要搜尋的 ignore 檔名（可為 glob 模式）
     * Ignore file names (or glob patterns) to search for
     *
     * 預設 {@link DEFAULT_IGNORE_FILE_NAMES}
     */
    fileNames?: ITSValueOrArrayMaybeReadonly<string>;
}
/** `cwd` 可直接傳入路徑字串或搜尋選項物件 */
export type ICwdOrFindIgnoreFilesOptions = string | IFindIgnoreFilesOptions;
/**
 * 搜尋並建立 IgnoreFile 時的選項：搜尋選項與實例設定合為一袋
 */
export interface IFindIgnoreFileOptions extends IFindIgnoreFilesOptions, IIgnoreFileOptions {
}
export type ICheckIgnoreResult = ReturnType<ReturnType<typeof ignore>['checkIgnore']>;
export interface IHandleOptionsEndCountOptions extends Pick<IIgnoreFileOptions, 'endCount' | 'startCount'> {
    lines: ITSArrayListMaybeReadonly<string>;
}
/** 單一行的類型 */
export declare enum EnumLineType {
    Comment = "comment",
    Blank = "blank",
    Pattern = "pattern"
}
/**
 * 輸出前整理的選項
 * Options for finalizing before output
 *
 * 一律以 `disable` 前綴命名（同 `IgnoreFile` 的 `disableOptimize`）：
 * 省略或傳 `false` 皆會執行該步驟，只有明確傳入 `true` 才停用。
 * Every option is named with a `disable` prefix (like `IgnoreFile`'s `disableOptimize`):
 * omitting it or passing `false` runs the step, and only an explicit `true` turns it off.
 */
export interface IFinalizeIgnoreLinesOptions {
    /**
     * 是否停用「移除重複的規則，只保留最後一筆」；預設執行
     * Whether to skip removing duplicate rules (keeping only the last one). Runs by default
     *
     * 停用整項去重時，重複的註解也一併保留（見 {@link disableDedupePatternsComment}）。
     * Turning the whole step off also keeps duplicated comments
     * (see {@link disableDedupePatternsComment})
     */
    disableDedupePatterns?: boolean;
    /**
     * 是否停用「對註解也進行去重」，預設執行
     *
     * 只影響註解行：預設連同重複的註解一起移除（保留最後一筆），
     * 傳 `true` 時註解的數量與位置完全不變；規則行與空行的行為不受影響。
     */
    disableDedupePatternsComment?: boolean;
    /**
     * 是否停用「將超過上限的連續空行縮減到上限」，預設執行
     * Whether to skip shrinking runs of blank lines beyond the upper bound. Runs by default
     */
    disableCollapseBlankLines?: boolean;
    /**
     * 是否停用「移除檔案開頭與結尾的空白行」，預設執行
     * Whether to skip stripping blank lines at the start and the end of the file. Runs by default
     */
    disableOmitBlankLines?: boolean;
}
export type IExcludeReadonlyArray<T extends ITSValueOrArrayMaybeReadonly<any>> = Extract<T, string | any[]>;
/**
 * 單一行解析 (tokenize) 後的結果
 *
 * `line` 為去頭尾空白後的內容，因此比對規則只需比較 `line`，
 * 不必再各自 trim()；`type` 則是依同一份內容判定的行類型。
 */
export interface ILineToken {
    type: EnumLineType;
    line: string;
}
