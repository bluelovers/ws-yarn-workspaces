/**
 * 尋找 Yarn Workspace 根目錄
 * Find Yarn Workspace Root
 *
 * 此模組提供尋找 Yarn workspace 根目錄的功能，
 * This module provides functionality to find the root directory of a Yarn workspace,
 * 為 find-yarn-workspace-root 的增強版本。
 * as an enhanced version of find-yarn-workspace-root.
 *
 * @packageDocumentation
 */

'use strict';

import { findWorkspaceRoot } from './core';

/**
 * 匯出 findWorkspaceRoot 函數作為模組的預設匯出
 * 以 `export =` 形式匯出，讓 CommonJS 的 require() 可直接取得該函式
 * Export findWorkspaceRoot function as module's default export
 * Uses `export =` so CommonJS require() receives the function itself
 */
export = findWorkspaceRoot;
