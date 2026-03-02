"use strict";
/**
 * Main handler for ncu operations in workspaces.
 * 在 workspaces 中執行 ncu 操作的主要處理函數。
 *
 * 此模組負責：
 * - 執行單一套件的 npm-check-updates
 * - 處理 package.json 更新
 * - 處理 resolutions 更新
 * - 執行 dedupe 操作
 *
 * This module is responsible for:
 * - Executing npm-check-updates for a single package
 * - Handling package.json updates
 * - Handling resolutions updates
 * - Executing dedupe operations
 *
 * @module ncu-main
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._handleNcuArgv = _handleNcuArgv;
const ncu_1 = require("@yarn-tool/ncu");
const write_package_json_1 = require("@yarn-tool/write-package-json");
const ncu_yarnlock_1 = require("./ncu-yarnlock");
const runtime_1 = require("./runtime");
const ncu_resolutions_1 = require("./ncu-resolutions");
const ncu_dedupe_1 = require("./ncu-dedupe");
/**
 * 處理單一套件的 ncu 參數和執行邏輯
 * Handle ncu arguments and execution logic for a single package
 *
 * 此函數是處理單一套件 ncu 操作的核心，執行以下步驟：
 * 1. 建立執行時期環境
 * 2. 檢查是否需要處理 resolutions
 * 3. 執行 npm-check-updates 檢查
 * 4. 根據結果更新 package.json
 * 5. 執行 dedupe 操作（如果需要）
 * 6. 處理 yarn.lock 更新（非 workspace 模式）
 *
 * This function is the core for handling ncu operations for a single package,
 * executing the following steps:
 * 1. Build runtime environment
 * 2. Check if need to process resolutions
 * 3. Execute npm-check-updates check
 * 4. Update package.json based on results
 * 5. Execute dedupe operation (if needed)
 * 6. Handle yarn.lock update (non-workspace mode)
 *
 * @param argv - 命令列參數 / Command line arguments
 * @param runtimeInput - 執行時期輸入配置 / Runtime input configuration
 * @param isWorkspace - 是否在 workspace 模式下 / Whether in workspace mode
 */
async function _handleNcuArgv(argv, runtimeInput, isWorkspace) {
    /**
     * 建立完整的執行時期環境
     * Build complete runtime environment
     */
    const runtime = (0, runtime_1._handleRuntime)(argv, runtimeInput);
    /**
     * 解構執行時期環境變數
     * Destructure runtime environment variables
     */
    const { console, consoleDebug, printRootData, cwd, rootData, pkg_file, pkg_data, resolutions, pkg_file_ws, pkg_data_ws, doWorkspace, } = runtime;
    /**
     * 如果指定了 resolutions 參數，轉由專門的處理函數處理
     * If resolutions parameter is specified, delegate to dedicated handler
     */
    if (argv.resolutions) {
        return (0, ncu_resolutions_1._handleNcuResolutions)(argv, runtime);
    }
    /**
     * 輸出當前處理的套件資訊
     * Output current package being processed
     */
    printRootData(rootData, argv);
    /**
     * 執行 npm-check-updates 檢查
     * Execute npm-check-updates check
     */
    const pkgNcu = await (0, ncu_1.npmCheckUpdates)({
        cwd,
        rootData,
        // @ts-ignore
    }, {
        ...argv,
        json_old: pkg_data,
    });
    /**
     * 如果有變更且啟用了 upgrade 選項，更新 package.json
     * If there are changes and upgrade option is enabled, update package.json
     */
    if (pkgNcu.json_changed && argv.upgrade) {
        (0, write_package_json_1.writePackageJSONSync)(pkg_file, pkgNcu.json_new);
        consoleDebug.info(`package.json updated`);
    }
    /**
     * 如果啟用了 dedupe 且有 resolutions 設定，執行去重操作
     * If dedupe is enabled and there are resolutions settings, execute dedupe operation
     */
    if (argv.dedupe && resolutions && Object.keys(resolutions).length) {
        if (await (0, ncu_dedupe_1._handleDedupe)(argv, runtime, pkgNcu)) {
            return;
        }
    }
    /**
     * 非 workspace 模式下，處理 yarn.lock 更新
     * In non-workspace mode, handle yarn.lock update
     */
    !isWorkspace && await (0, ncu_yarnlock_1._handleNcuYarnLock)(argv, runtime);
}
//# sourceMappingURL=ncu-main.js.map