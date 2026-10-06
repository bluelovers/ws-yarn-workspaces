"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotEnvFiles = dotEnvFiles;
exports.wsEnvConfig = wsEnvConfig;
const dotenv_1 = require("dotenv");
const path_parents_1 = require("@yarn-tool/path-parents");
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
/**
 * 依模式計算待載入的 dotenv 檔案清單（依優先順序排列）。
 * 只負責計算不負責載入，方便呼叫端先確認清單再決定是否載入。
 *
 * Computes the ordered list of dotenv files to load (highest priority first).
 * Computes only, without loading, so callers can inspect the list before loading.
 *
 * @param options 模式選項 / mode options
 * @returns isTest、dev、mode 與 dotenvFiles / isTest, dev, mode and dotenvFiles
 */
function dotEnvFiles(options) {
    let { isTest, dev, } = options !== null && options !== void 0 ? options : {};
    /**
     * 未指定 isTest 時回退到 NODE_ENV，與 dotenv/常見工具的慣例一致
     *
     * Falls back to NODE_ENV when isTest is unspecified, matching dotenv and common tooling conventions
     */
    isTest = isTest !== null && isTest !== void 0 ? isTest : process.env['NODE_ENV'] === 'test';
    /**
     * test 優先於 dev：測試期間不應被 development 設定干擾
     *
     * test takes precedence over dev: tests must not be affected by development settings
     */
    const mode = isTest ? 'test' : dev ? 'development' : 'production';
    const dotenvFiles = [
        `.env.${mode}.local`,
        /**
         * test 環境刻意排除 `.env.local`，確保所有人的測試結果一致
         *
         * Don't include `.env.local` for `test` environment
         * since normally you expect tests to produce the same
         * results for everyone
         */
        mode !== 'test' && `.env.local`,
        `.env.${mode}`,
        '.env',
        /**
         * filter(Boolean) 會移除 mode === 'test' 時的 false 項，故需斷言為 string[]
         *
         * filter(Boolean) drops the false entry when mode === 'test', hence the string[] assertion
         */
    ].filter(Boolean);
    return {
        isTest,
        dev,
        mode,
        dotenvFiles,
    };
}
/**
 * 從 cwd 逐層向上尋找 dotenv 檔並載入（套件主要入口）。
 * 搜尋至工作區根目錄為止；每一層依優先序嘗試，第一個成功載入者即回傳。
 *
 * Walks upward from cwd to locate and load a dotenv file (main entry).
 * Stops at the workspace root; each level tries files by priority and the first successful load wins.
 *
 * @param cwd 起始目錄，預設 process.cwd() / starting directory, defaults to process.cwd()
 * @param options 模式選項 / mode options
 * @returns dotenv 載入結果與 path/cwd/current/fileExists 診斷資訊 / dotenv result plus path/cwd/current/fileExists diagnostics
 */
function wsEnvConfig(cwd, options) {
    /**
     * 統一 resolve 成絕對路徑，避免相對路徑與向上逐層比對時產生不一致
     *
     * Resolve to an absolute path up front to avoid inconsistencies when walking up from a relative path
     */
    cwd = (0, upath2_1.resolve)(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
    const files = dotEnvFiles(options).dotenvFiles;
    let ret;
    /**
     * path/current 可能在迴圈一次都未執行時仍未賦值，故宣告於迴圈外供最終回傳使用
     *
     * path/current may remain unassigned if the loop never runs, so they are declared outside for the final return
     */
    let current;
    let path;
    let fileExists;
    /**
     * 外層走訪目錄層級、內層依優先序嘗試各檔案；
     * 兩層巢狀是為了「越靠近 cwd 的層級越優先、同層內越特別的檔越優先」
     *
     * The outer loop walks directory levels, the inner tries files by priority;
     * the nesting enforces "closer to cwd first, more specific file first within a level"
     */
    for (current of (0, path_parents_1.pathUpToWorkspacesGenerator)(cwd)) {
        for (let file of files) {
            path = (0, upath2_1.join)(current, file);
            /**
             * 先檢查存在性並回傳，讓呼叫端能區分「檔案不存在」與「解析失敗」
             *
             * Check existence and return it so callers can tell "missing file" from "parse failure"
             */
            fileExists = (0, fs_extra_1.pathExistsSync)(path);
            // @ts-ignore
            ret = (0, dotenv_1.config)({
                path,
            });
            /**
             * 無 error 即視為成功載入（dotenv 對不存在的檔案不會回報 error）
             *
             * No error means a successful load (dotenv does not report an error for a missing file)
             */
            if (!ret.error) {
                return {
                    ...ret,
                    path,
                    cwd,
                    current,
                    fileExists,
                };
            }
        }
    }
    /**
     * 所有層級都失敗：以最後一次嘗試的 path/current 回傳，
     * 讓呼叫端仍能取得錯誤與最後檢查的位置
     *
     * All levels failed: return the last attempted path/current so the caller
     * still gets the error and the last location checked
     */
    fileExists = (0, fs_extra_1.pathExistsSync)(path);
    return {
        ...ret,
        path,
        cwd,
        current,
        fileExists,
    };
}
/**
 * 預設匯出 (Default Export)：wsEnvConfig，便於 `import wsEnvConfig from '@yarn-tool/dotenv'` 直接使用。
 *
 * Default export: wsEnvConfig, for using it directly via `import wsEnvConfig from '@yarn-tool/dotenv'`.
 */
exports.default = wsEnvConfig;
//# sourceMappingURL=index.js.map