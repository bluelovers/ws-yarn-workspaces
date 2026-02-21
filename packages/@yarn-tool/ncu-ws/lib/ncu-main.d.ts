/**
 * Main handler for ncu operations in workspaces.
 * 在 workspaces 中執行 ncu 操作的主要處理函數。
 *
 * @module ncu-main
 *
 * 此模組負責：
 * - 執行單一套件的 npm-check-updates
 * - 處理 package.json 更新
 * - 處理 resolutions 更新
 * - 執行 dedupe 操作
 */
import { IArgvRuntime, IRuntimeInput } from './types';
export declare function _handleNcuArgv(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean): Promise<void>;
