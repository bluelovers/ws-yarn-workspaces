/**
 * @yarn-tool/ncu-ws
 *
 * Workspace-aware npm-check-updates tool for Yarn workspaces.
 * 專為 Yarn workspaces 設計的依賴版本檢查與更新工具。
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import _handleNcuArgvAuto from '@yarn-tool/ncu-ws';
 *
 * await _handleNcuArgvAuto(argv, runtimeInput, true, true);
 * ```
 */
import { IArgvRuntime, IRuntimeInput } from './lib/types';
import Bluebird from 'bluebird';
export declare function _handleNcuArgvAuto(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean, includeRoot?: boolean): Bluebird<void>;
export default _handleNcuArgvAuto;
