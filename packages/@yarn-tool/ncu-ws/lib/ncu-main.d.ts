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
import { IArgvRuntime, IRuntimeInput } from './types';
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
export declare function _handleNcuArgv(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean): Promise<void>;
