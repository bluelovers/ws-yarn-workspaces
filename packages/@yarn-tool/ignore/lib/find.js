"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFindIgnoreFilesOptions = handleFindIgnoreFilesOptions;
exports.findIgnoreFileDirsGenerator = findIgnoreFileDirsGenerator;
exports.findIgnoreFileDirs = findIgnoreFileDirs;
exports.findIgnoreFilesGenerator = findIgnoreFilesGenerator;
exports.findIgnoreFiles = findIgnoreFiles;
/**
 * 向上搜尋 ignore 檔案
 * Search ignore files by walking up parent directories
 *
 * 「搜尋範圍」由 {@link findIgnoreFileDirsGenerator} 決定（預設停止於目前套件），
 * 「搜尋名稱」由 `fileNames` 決定，兩者各自獨立、可單獨測試。
 * The search range comes from {@link findIgnoreFileDirsGenerator} (stops at the
 * current package by default) and the names come from `fileNames`; the two are
 * independent and can be tested separately.
 */
const fast_glob_1 = require("fast-glob");
const ws_find_up_paths_1 = require("@yarn-tool/ws-find-up-paths");
const names_1 = require("./names");
/**
 * 整理搜尋選項，套用「預設停止於目前套件」
 * Normalize search options, applying "stop at current package" by default
 *
 * 這是「預設停止於目前套件」的單一事實來源；
 * 若需開放向上搜尋至工作區，傳入 `stopAtCurrentPackage: false` 即可。
 * This is the single source of truth for the default stop point;
 * pass `stopAtCurrentPackage: false` to open the search up to the workspace.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項，優先於 cwd 物件 / Additional options, taking precedence over the cwd object
 */
function handleFindIgnoreFilesOptions(cwd, opts) {
    const input = typeof cwd === 'string'
        ? { ...opts, cwd }
        : { ...cwd, ...opts };
    return {
        ...input,
        stopAtCurrentPackage: input.stopAtCurrentPackage ?? true,
    };
}
/**
 * 取得將被搜尋的父層路徑的產生器（由近至遠）
 * Generator of the parent directories to be searched (nearest first)
 *
 * 預設最遠只到目前套件目錄；傳入 `stopAtCurrentPackage: false` 時可延伸至工作區根目錄。
 * By default the farthest directory is the current package directory;
 * pass `stopAtCurrentPackage: false` to extend the search to the workspace root.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 */
function findIgnoreFileDirsGenerator(cwd, opts) {
    return (0, ws_find_up_paths_1.pathParentsWorkspacesGenerator)(handleFindIgnoreFilesOptions(cwd, opts));
}
/**
 * 取得將被搜尋的父層路徑的完整陣列（由近至遠）
 *
 * 為 {@link findIgnoreFileDirsGenerator} 的完整展開。
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 */
function findIgnoreFileDirs(cwd, opts) {
    return [...findIgnoreFileDirsGenerator(cwd, opts)];
}
/**
 * 逐層向上搜尋 ignore 檔案的產生器（由近至遠）
 * Generator that searches ignore files layer by layer (nearest first)
 *
 * 每個父層目錄 yield 一次，回傳該層找到的 `{ dir, list }`；
 * 逐層產出讓呼叫端找到目標後即可中斷，不必先建立完整陣列。
 * Yields once per parent directory with the `{ dir, list }` found there;
 * producing layer by layer lets the caller stop once the target is found
 * instead of building the whole array first.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 搜尋選項，可用 `fileNames` 自訂檔名、`stopAtCurrentPackage` 控制範圍
 * Search options; use `fileNames` to customize names and `stopAtCurrentPackage` to control the range
 */
function* findIgnoreFilesGenerator(cwd, opts) {
    const options = handleFindIgnoreFilesOptions(cwd, opts);
    /**
     * `fileNames` 允許傳入單一字串或陣列，統一攤平為陣列後再交給 fast-glob，
     * 避免以型別轉換掩蓋兩種輸入型別的差異
     * `fileNames` accepts a single string or an array; flattening it first keeps
     * fast-glob's input a real array instead of hiding the two input shapes behind a cast
     */
    const raw = options.fileNames ?? names_1.DEFAULT_IGNORE_FILE_NAMES;
    const fileNames = typeof raw === 'string' ? [raw] : [...raw];
    for (const dir of findIgnoreFileDirsGenerator(options)) {
        /**
         * `deep: 0` 只搜尋該層目錄本身，不向下自動遍歷；
         * 父層已由 findIgnoreFileDirsGenerator 逐層提供，
         * 故巢狀明確路徑（如 `.git/info/exclude`）仍可被匹配。
         * `suppressErrors` 避免個別不可讀目錄中斷整個搜尋。
         *
         * `deep: 0` searches only that directory level instead of descending;
         * parent levels are already provided by findIgnoreFileDirsGenerator, so an
         * explicitly nested path (e.g. `.git/info/exclude`) is still matched.
         * `suppressErrors` keeps a single unreadable directory from aborting the search.
         */
        const list = (0, fast_glob_1.sync)(fileNames, {
            cwd: dir,
            deep: 0,
            onlyFiles: true,
            absolute: true,
            dot: true,
            suppressErrors: true,
            objectMode: true,
        })
            .map(entry => {
            return {
                name: entry.name,
                path: entry.path,
            };
        })
            /**
             * 同一層內依 path 排序以確保結果順序穩定
             * Sort by path within each level so results stay stable
             */
            .sort((a, b) => a.path === b.path ? 0 : a.path < b.path ? -1 : 1);
        yield {
            dir,
            list,
        };
    }
}
function findIgnoreFiles(cwd, opts) {
    return [...findIgnoreFilesGenerator(cwd, opts)];
}
//# sourceMappingURL=find.js.map