"use strict";
/**
 * @yarn-tool/ncu-ws
 *
 * Workspace-aware npm-check-updates tool for Yarn workspaces.
 * 專為 Yarn workspaces 設計的依賴版本檢查與更新工具。
 *
 * 此模組提供以下核心功能：
 * - 自動偵測 workspace 根目錄與結構
 * - 批次處理所有 workspace 套件的依賴更新
 * - 支援選擇性包含/排除根套件
 * - 整合 yarn.lock 更新機制
 * - 提供執行時間追蹤與進度顯示
 *
 * Core features provided:
 * - Auto-detect workspace root directory and structure
 * - Batch process dependency updates across all workspace packages
 * - Support optional inclusion/exclusion of root package
 * - Integrate yarn.lock update mechanism
 * - Provide execution time tracking and progress display
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
 *
 * // 處理所有 workspace 套件（包含根套件）
 * // Process all workspace packages (including root)
 * await _handleNcuArgvAuto(argv, runtimeInput, true, true);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuArgvAuto = _handleNcuArgvAuto;
const tslib_1 = require("tslib");
const find_root_1 = require("@yarn-tool/find-root");
const ws_pkg_list_1 = require("ws-pkg-list");
const ncu_main_1 = require("./lib/ncu-main");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const debug_color2_1 = require("debug-color2");
const upath2_1 = require("upath2");
const ncu_yarnlock_1 = require("./lib/ncu-yarnlock");
/**
 * 自動處理 ncu (npm-check-updates) 參數並執行 workspace 範圍的依賴檢查與更新
 * Automatically process ncu arguments and execute workspace-wide dependency check and update
 *
 * 此函數是 ncu-ws 的核心入口，負責：
 * - 偵測當前專案是否為 yarn workspace
 * - 根據參數決定處理範圍（根套件 + 所有子套件）
 * - 依序處理每個套件的依賴更新
 * - 最後統一處理 yarn.lock 更新
 *
 * This function is the core entry point of ncu-ws, responsible for:
 * - Detecting if current project is a yarn workspace
 * - Determining processing scope based on parameters (root + all sub-packages)
 * - Sequentially processing dependency updates for each package
 * - Finally handling yarn.lock updates uniformly
 *
 * @param argv - yargs 解析後的命令列參數 / Parsed yargs command line arguments
 * @param runtimeInput - 執行時期配置物件 / Runtime configuration object
 * @param isWorkspace - 是否啟用 workspace 模式（預設 false）/ Enable workspace mode (default: false)
 * @param includeRoot - 是否包含根套件（預設 false）/ Include root package (default: false)
 * @returns Promise<void> - 當所有處理完成時解析 / Resolves when all processing is complete
 */
function _handleNcuArgvAuto(argv, runtimeInput, isWorkspace, includeRoot) {
    /**
     * 記錄開始時間，用於計算總執行時間
     * Record start time for calculating total execution time
     */
    const startTime = Date.now();
    return bluebird_1.default.resolve()
        /**
         * 步驟 1: 尋找 workspace 根目錄
         * Step 1: Find workspace root directory
         */
        .then(() => (0, find_root_1.findRoot)(argv, true))
        // @ts-ignore
        .then(async (rootData) => {
        var _a, _b, _c;
        /**
         * 初始化控制台輸出物件（使用預設值或傳入的值）
         * Initialize console output objects (use default or passed values)
         */
        (_a = runtimeInput.console) !== null && _a !== void 0 ? _a : (runtimeInput.console = debug_color2_1.console);
        (_b = runtimeInput.consoleDebug) !== null && _b !== void 0 ? _b : (runtimeInput.consoleDebug = debug_color2_1.console);
        /**
         * 處理 AA (All-All) 參數：當啟用時，自動開啟 workspace 模式並包含根套件
         * Handle AA (All-All) parameter: when enabled, auto-enable workspace mode and include root
         */
        if (argv.AA) {
            isWorkspace !== null && isWorkspace !== void 0 ? isWorkspace : (isWorkspace = true);
            includeRoot !== null && includeRoot !== void 0 ? includeRoot : (includeRoot = true);
        }
        /**
         * Workspace 模式處理邏輯
         * Workspace mode processing logic
         */
        if (isWorkspace && rootData.hasWorkspace) {
            /**
             * 如果需要，先處理根套件
             * Process root package first if needed
             */
            if (includeRoot) {
                await (0, ncu_main_1._handleNcuArgv)({
                    ...argv,
                    cwd: rootData.root,
                }, {
                    ...runtimeInput,
                    /**
                     * 自定義根套件資訊輸出函數
                     * Custom root package info output function
                     */
                    printRootData() {
                        (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                            console.info([
                                chalk.white(`Workspace:`),
                                chalk.red(rootData.root),
                            ].join(' '));
                        }, runtimeInput.consoleDebug);
                    },
                }, isWorkspace);
            }
            /**
             * 步驟 2: 依序處理每個 workspace 子套件
             * Step 2: Sequentially process each workspace sub-package
             */
            return bluebird_1.default.mapSeries((0, ws_pkg_list_1.wsPkgListable)(rootData.root), (row) => {
                /**
                 * 為每個套件建立專屬的 runtime 配置，包含自定義輸出函數
                 * Create dedicated runtime config for each package with custom output function
                 */
                const runtime = {
                    ...runtimeInput,
                    printRootData() {
                        (0, debug_color2_1.chalkByConsole)((chalk, console) => {
                            console.info([
                                chalk.white(`Package:`),
                                `${row.name}@${row.version}`,
                                chalk.red((0, upath2_1.relative)(rootData.root, row.location)),
                            ].join(' '));
                        }, runtimeInput.consoleDebug);
                    },
                };
                /**
                 * 執行該套件的 ncu 處理
                 * Execute ncu processing for this package
                 */
                return (0, ncu_main_1._handleNcuArgv)({
                    ...argv,
                    cwd: row.location,
                }, runtime, isWorkspace);
            })
                .then(() => {
                /**
                 * 步驟 3: 所有套件處理完成後，統一更新 yarn.lock
                 * Step 3: After all packages processed, update yarn.lock uniformly
                 */
                return (0, ncu_yarnlock_1._handleNcuYarnLock)(argv, {
                    ...runtimeInput,
                    rootData,
                });
            });
        }
        /**
         * 非 workspace 模式：設定預設的 printRootData 並執行單一套件處理
         * Non-workspace mode: set default printRootData and execute single package processing
         */
        (_c = runtimeInput.printRootData) !== null && _c !== void 0 ? _c : (runtimeInput.printRootData = (rootData) => {
            runtimeInput.consoleDebug.info(rootData.pkg);
        });
        return (0, ncu_main_1._handleNcuArgv)(argv, runtimeInput);
    })
        /**
         * 步驟 4: 輸出總執行時間
         * Step 4: Output total execution time
         */
        .tap(() => {
        const totalTime = Date.now() - startTime;
        const totalTimeHuman = (totalTime / 1000).toFixed(2);
        const msg = `Done in ${totalTimeHuman}s.`;
        runtimeInput.consoleDebug.gray.info(msg);
    });
}
/**
 * 預設導出：自動處理 ncu 參數的主要函數
 * Default export: main function for automatically handling ncu arguments
 */
exports.default = _handleNcuArgvAuto;
//# sourceMappingURL=index.js.map