"use strict";
/**
 * Created by user on 2020/4/8.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLifecycleScript = runLifecycleScript;
const tslib_1 = require("tslib");
/**
 * 生命週期腳本執行模組
 * Lifecycle Script Execution Module
 *
 * @module @yarn-tool/run-script-lifecycle
 * @description 提供 npm/yarn 生命週期腳本執行功能，支援前置和後置腳本
 *              Provides npm/yarn lifecycle script execution functionality with support for pre and post scripts
 *
 * @example
 * import runLifecycleScript from '@yarn-tool/run-script-lifecycle';
 *
 * // 執行 install 生命週期腳本（包含 preinstall 和 postinstall）
 * // Run install lifecycle script (including preinstall and postinstall)
 * const results = await runLifecycleScript({
 *   event: 'install',
 *   path: '/path/to/package'
 * });
 *
 * // results 為執行結果陣列，可能包含 preinstall、install、postinstall 的結果
 * // results is an array of execution results, possibly containing preinstall, install, postinstall results
 */
const run_script_pkg_1 = tslib_1.__importDefault(require("@npmcli/run-script/lib/run-script-pkg"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const script_lifecycle_1 = require("@yarn-tool/script-lifecycle");
const util_1 = require("./lib/util");
const read_package_json_fast_1 = tslib_1.__importDefault(require("read-package-json-fast"));
/**
 * 執行生命週期腳本
 * Run lifecycle script
 *
 * @async
 * @function runLifecycleScript
 * @param {IRunLifecycleScriptOptions} options - 執行選項 (Execution options)
 * @returns {Promise<(IResultNotExists | IResult)[]>} 執行結果陣列 (Array of execution results)
 * @description 執行指定的生命週期腳本，自動處理前置 (pre) 和後置 (post) 腳本
 *              Executes the specified lifecycle script, automatically handling pre and post scripts
 *
 * 執行順序 (Execution order):
 * 1. 前置腳本 (pre-scripts)，如 preinstall
 * 2. 主要腳本 (main script)，如 install
 * 3. 後置腳本 (post-scripts)，如 postinstall
 *
 * @example
 * // 執行 build 生命週期腳本
 * // Run build lifecycle script
 * const results = await runLifecycleScript({
 *   event: 'build',
 *   path: '/path/to/package',
 *   stdio: 'inherit'
 * });
 *
 * // 檢查執行結果
 * // Check execution results
 * results.forEach(result => {
 *   if (result.code === 0) {
 *     console.log(`${result.event} completed successfully`);
 *   }
 * });
 *
 * @throws {IError} 當腳本執行失敗時拋出錯誤 (Throws error when script execution fails)
 */
async function runLifecycleScript(options) {
    /**
     * 建立 package.json 的完整路徑。
     *
     * Build the full path to package.json.
     */
    const pkg_path = (0, path_1.join)(options.path, 'package.json');
    console.log('pathExistsSync', pkg_path, (0, fs_extra_1.pathExistsSync)(pkg_path));
    /**
     * 檢查 package.json 是否存在；不存在時無法取得 scripts，改走下方的直跑分支。
     *
     * Check whether package.json exists; without it there is no scripts section,
     * so the direct-run branch below is taken instead.
     */
    if ((0, fs_extra_1.pathExistsSync)(pkg_path)) {
        /**
         * 讀取並解析 package.json，取得 scripts 後才決定要執行哪些鉤子。
         *
         * Read and parse package.json; the scripts section decides which hooks run.
         */
        return (0, read_package_json_fast_1.default)(pkg_path)
            .then(async (pkg) => {
            var _a, _b;
            /**
             * 取得生命週期配置，包含前置和後置腳本列表。
             *
             * Get the lifecycle configuration, including the pre/post script lists.
             */
            let lifecycle = (0, script_lifecycle_1.getLifecycle)(options.event);
            /**
             * 準備執行選項：刻意清空 args 與 event，
             * 因為前置/後置腳本各自的 event 由 eventList 逐一覆蓋。
             *
             * Prepare execution options: args and event are intentionally cleared
             * because each pre/post script overrides event from eventList one by one.
             */
            let tmpOptions = (0, util_1._options)({
                ...options,
                args: [],
                event: void 0,
                pkg,
            });
            /**
             * 儲存所有執行結果的陣列，依 pre → main → post 順序累積。
             *
             * Array accumulating every execution result in pre → main → post order.
             */
            const resultList = [];
            /**
             * 執行前置腳本 (如 preinstall)；
             * 以 ?.length 判斷是因為未知腳本可能沒有 before 清單。
             *
             * Run pre-scripts (e.g. preinstall); the ?.length check guards against
             * unknown scripts that may have no `before` list at all.
             */
            if ((_a = lifecycle.before) === null || _a === void 0 ? void 0 : _a.length) {
                const results = await (0, util_1.runLifecycleScriptList)({
                    eventList: lifecycle.before,
                    tmpOptions,
                    pkg,
                });
                //					results.forEach((result) => {
                //						stdoutAll.push(result.stdout)
                //					})
                resultList.push(...results);
            }
            /**
             * 執行主要腳本 (如 install)；直接使用原始 options，
             * 讓 runScriptPkg 依 pkg.scripts 找到對應腳本。
             *
             * Run the main script (e.g. install); the original options are passed
             * through so runScriptPkg can resolve it from pkg.scripts.
             */
            const result = await (0, util_1.runLifecycleScriptCore)({
                ...options,
                pkg,
            }, run_script_pkg_1.default);
            resultList.push(result);
            /**
             * 執行後置腳本 (如 postinstall)；
             * 與前置腳本分開判斷，因為兩者可能只存在其中一邊。
             *
             * Run post-scripts (e.g. postinstall); checked separately from the
             * pre-scripts because only one of the two lists may exist.
             */
            if ((_b = lifecycle.after) === null || _b === void 0 ? void 0 : _b.length) {
                const results = await (0, util_1.runLifecycleScriptList)({
                    eventList: lifecycle.after,
                    tmpOptions,
                    pkg,
                });
                //					results.forEach((result) => {
                //						stdoutAll.push(result.stdout)
                //					})
                resultList.push(...results);
            }
            /**
             * 返回所有執行結果。
             *
             * Return all execution results.
             */
            return resultList;
        });
    }
    /**
     * 如果 package.json 不存在，直接執行腳本；
     * 回傳值包成單元素陣列，讓兩條分支的回傳型別一致。
     *
     * If package.json does not exist, run the script directly; the result is wrapped
     * in a single-element array so both branches share the same return type.
     */
    return (0, util_1.runLifecycleScriptCore)(options)
        .then(result => [result]);
}
/**
 * 匯出預設函數，讓使用者可直接 `import runLifecycleScript from ...`。
 *
 * Export the default function so consumers can
 * `import runLifecycleScript from ...` directly.
 */
exports.default = runLifecycleScript;
//# sourceMappingURL=index.js.map