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
import { IArgvRuntime, IRuntimeInput } from './lib/types';
import Bluebird from 'bluebird';
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
export declare function _handleNcuArgvAuto(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean, includeRoot?: boolean): Bluebird<void>;
/**
 * 預設導出：自動處理 ncu 參數的主要函數
 * Default export: main function for automatically handling ncu arguments
 */
export default _handleNcuArgvAuto;
