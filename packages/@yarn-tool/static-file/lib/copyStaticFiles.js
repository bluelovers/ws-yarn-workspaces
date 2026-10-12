"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFiles = copyStaticFiles;
exports._handleCopyStaticFilesOptions = _handleCopyStaticFilesOptions;
exports._copyStaticFilesCoreListGenerator = _copyStaticFilesCoreListGenerator;
const fs_extra_1 = require("fs-extra");
const const_1 = require("./const");
const parseStaticMap_1 = require("./parseStaticMap");
const copyStaticFilesEntry_1 = require("./copyStaticFilesEntry");
const mergeIgnoreFiles_1 = require("./mergeIgnoreFiles");
const __root_1 = require("../__root");
/**
 * Copy static files to a target directory / 將靜態檔案複製到目標目錄
 *
 * Copies static files based on the provided file map configuration.
 * 根據提供的檔案映射配置複製靜態檔案。
 *
 * @template K - The target file path type / 目標檔案路徑類型
 *
 * @param options - Copy options / 複製選項
 * @param options.cwd - Current working directory (required) / 當前工作目錄（必填）
 * @param options.staticRoot - Root directory of static files (defaults to package root) / 靜態檔案根目錄（預設為套件根目錄）
 * @param options.overwrite - Whether to overwrite existing files / 是否覆蓋已存在的檔案
 * @param options.file_map - Custom file mapping configuration / 自訂檔案映射配置
 * @param options.ignoreFilesSnapshot - Snapshot of existing ignore files; enables auto-merge when given / reset 前建立的既有 ignore 檔快照；提供時啟用自動合併
 *
 * @returns Array of entries that were successfully copied / 成功複製的條目陣列
 *
 * @throws {TypeError} When options.cwd is not a valid string / 當 options.cwd 不是有效的字串時
 * @throws {TypeError} When options.cwd directory does not exist / 當 options.cwd 目錄不存在時
 * @throws {TypeError} When file_map is invalid / 當 file_map 無效時
 *
 * @see mergeIgnoreFiles
 *
 * @example
 * ```typescript
 * import { copyStaticFiles } from '@yarn-tool/static-file';
 *
 * // Copy default static files to current directory
 * // 複製預設靜態檔案到當前目錄
 * copyStaticFiles({
 *   cwd: process.cwd(),
 *   overwrite: true
 * });
 *
 * // Copy with custom file map
 * // 使用自訂檔案映射複製
 * copyStaticFiles({
 *   cwd: '/path/to/project',
 *   file_map: [
 *     ['.gitignore', 'file/gitignore'],
 *     ['README.md', 'file/README.md']
 *   ]
 * });
 * ```
 */
function copyStaticFiles(options) {
    const opts = _handleCopyStaticFilesOptions(options);
    /**
     * 已實際複製的條目，作為回傳值交給呼叫端 / Entries actually copied, collected as the return value
     */
    const copied = [];
    /**
     * 逐項複製並收集實際產出的條目
     * Copy each yielded entry and collect the results
     *
     * 被 detectFile 跳過的條目不會被產出，因此也不會出現在回傳值中
     * Entries skipped by detectFile are never yielded, so they are absent from the result
     */
    for (const result of _copyStaticFilesCoreListGenerator(opts)) {
        result.copy();
        copied.push(result.entry);
    }
    /**
     * 合併既有 ignore 檔內容 / Merge existing ignore file content
     *
     * resetStaticFiles 會先刪除正式 ignore 檔再重新複製樣板，
     * 呼叫端在 reset 前建立的快照在此併回複製後的檔案，使既有規則不因 reset 遺失。
     * resetStaticFiles deletes the real ignore files before copying the templates back;
     * the snapshot taken by the caller before the reset is folded into the post-copy files here,
     * so existing rules survive the reset.
     *
     * 未提供快照時 mergeIgnoreFiles 直接返回，不做任何寫入。
     * mergeIgnoreFiles returns immediately when no snapshot is given, so nothing is written.
     *
     * @see mergeIgnoreFiles
     */
    (0, mergeIgnoreFiles_1.mergeIgnoreFiles)(opts.cwd, opts.file_map, opts.ignoreFilesSnapshot);
    return copied;
}
/**
 * 驗證並補齊複製選項 / Validate and fill in copy options
 *
 * 回傳的選項保證 cwd 為已存在的字串、file_map 已解析成陣列、staticRoot 已有明確值。
 * The returned options guarantee an existing string cwd, an array-form file_map, and a resolved staticRoot.
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @param options - 呼叫端傳入的原始選項 / Raw options passed by the caller
 * @returns 補齊預設值後的選項 / Options with defaults resolved
 *
 * @throws {TypeError} 當 cwd 不是字串或目錄不存在、或 file_map 解析結果為空時 / When cwd is not a string or does not exist, or the parsed file map is empty
 *
 * @example
 * ```typescript
 * import { _handleCopyStaticFilesOptions } from '@yarn-tool/static-file/lib/copyStaticFiles';
 *
 * // 只需傳入必填的 cwd，其餘取預設值 / Only the required cwd is passed; the rest use defaults
 * const options = _handleCopyStaticFilesOptions({ cwd: '/path/to/project' });
 *
 * console.log(options.staticRoot); // 本套件的 file/ 目錄 / this package's file/ directory
 * console.log(options.file_map);   // 預設靜態檔案清單 / default static file list
 * ```
 */
function _handleCopyStaticFilesOptions(options) {
    var _a, _b;
    /**
     * 驗證 cwd 參數
     * Validate cwd parameter
    *
     * 空字串與 undefined 都會在後續 resolve 時產生錯誤的根路徑，故先行攔截
     * Empty string and undefined would produce a wrong base path during resolve, so intercept early
     */
    if (typeof options.cwd !== 'string' || !((_a = options.cwd) === null || _a === void 0 ? void 0 : _a.length) || !options.cwd) {
        throw new TypeError(`options.cwd must is string`);
    }
    /**
     * 檢查 cwd 目錄是否存在
     * Check if cwd directory exists
     *
     * 目標目錄不存在時直接失敗，避免複製到非預期位置
     * Fail early when the target directory is absent, to avoid copying into an unintended location
     */
    if (!(0, fs_extra_1.pathExistsSync)(options.cwd)) {
        throw new TypeError(`options.cwd not exists`);
    }
    /**
     * 解析檔案映射
     * Parse the file map
     *
     * 未提供 file_map 時退回預設清單，讓一般呼叫只需傳入 cwd
     * Fall back to the default list when file_map is omitted, so a plain call only needs cwd
     */
    let ls = (0, parseStaticMap_1.parseStaticMap)((_b = options.file_map) !== null && _b !== void 0 ? _b : const_1.defaultCopyStaticFiles);
    /**
     * 驗證解析後的檔案映射
     * Validate parsed file map
     *
     * 解析結果為空代表映射格式錯誤，若不攔截會安靜地複製零個檔案
     * An empty result means a malformed map; without this guard the copy would silently do nothing
     */
    if (!ls.length) {
        throw new TypeError(`Invalid file map: ${options.file_map}`);
    }
    /**
     * 確定靜態檔案根目錄
     * Determine static root directory
     *
     * 允許呼叫端覆寫靜態樣板來源；預設指向本套件的 file/ 目錄
     * Allows overriding the template source; defaults to this package's file/ directory
     */
    const staticRoot = options.staticRoot || __root_1.__STATIC_ROOT;
    const { cwd, overwrite } = options;
    /**
     * 展開原始選項並以解析後的值覆寫，確保 file_map 固定回傳陣列型別，呼叫端無需再判斷格式
     * Spread the raw options and overwrite with resolved values so file_map is always an array and callers need no format check
     */
    return {
        ...options,
        staticRoot,
        cwd,
        overwrite,
        file_map: ls,
    };
}
/**
 * 逐項產出可複製的靜態檔案 / Yield each static file ready to be copied
*
 * 只負責驗證、解析與過濾，本身不寫入任何檔案；是否複製由呼叫端決定（執行 yield 出來的 copy()）。
 * Only validates, resolves and filters — it never writes files; the caller decides whether to run the yielded copy().
 *
 * @template K - 目標檔案路徑類型 / Target file path type
 *
 * @param options - 複製選項 / Copy options
 * @yields 解析完成的條目、其複製資訊與複製動作 / The resolved entry, its copy info, and the copy action
 *
 * @throws {TypeError} 當選項驗證失敗時 / When option validation fails
 * @throws {Error} 當來源靜態檔案不存在時 / When the source static file does not exist
 *
 * @example
 * ```typescript
 * import { _copyStaticFilesCoreListGenerator } from '@yarn-tool/static-file/lib/copyStaticFiles';
 *
 * for (const { entry, runtime, copy } of _copyStaticFilesCoreListGenerator({ cwd: '/path/to/project' }))
 * {
 *   console.log(entry[0], '=>', runtime.targetFileFull);
 *
 *   // 決定權交給呼叫端；不呼叫 copy() 就不會寫入任何檔案 / The caller decides; without copy() nothing is written
 *   copy();
 * }
 * ```
 */
function* _copyStaticFilesCoreListGenerator(options) {
    const opts = _handleCopyStaticFilesOptions(options);
    for (const entry of opts.file_map) {
        const runtime = (0, copyStaticFilesEntry_1._copyStaticFilesEntryCore)(entry, opts.cwd, opts.staticRoot, opts.overwrite);
        /**
         * 被 detectFile 跳過的條目解析結果為 undefined，直接略過不產出
         * An entry skipped by detectFile resolves to undefined and is therefore not yielded
         */
        if (runtime) {
            yield {
                entry,
                runtime,
                copy() {
                    return (0, copyStaticFilesEntry_1._copyStaticFilesEntryCoreCopy)(runtime);
                },
            };
        }
    }
}
//# sourceMappingURL=copyStaticFiles.js.map