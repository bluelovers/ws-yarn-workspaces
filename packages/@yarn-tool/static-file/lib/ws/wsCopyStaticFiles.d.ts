/**
 * Get workspace copy static files configuration / 獲取工作區複製靜態檔案配置
 *
 * This module provides a function to get the combined static files map
 * for workspace-level operations.
 * 此模組提供獲取工作區層級操作的合併靜態檔案映射的函數。
 *
 * @module wsCopyStaticFiles
 */
import { defaultCopyStaticFiles, defaultCopyStaticFilesRootOnly } from '../const';
import { IStaticFiles, IStaticFilesKey } from '../types';
/**
 * Remapping configuration for workspace files / 工作區檔案的重新映射配置
 *
 * Maps target file names to their template counterparts.
 * 將目標檔案名稱映射到其模板對應項。
 *
 * This allows copying template files directly to their final names.
 * 這允許將模板檔案直接複製到其最終名稱。
 */
declare const remap: {
    readonly 'tsconfig.json': "tsconfig.json.tpl";
    readonly 'lerna.json': "lerna.json.tpl";
    readonly 'pnpm-workspace.yaml': "pnpm-workspace.yaml.tpl";
};
/**
 * Get the combined static files map for workspace operations / 獲取工作區操作的合併靜態檔案映射
 *
 * Combines all static file maps (default, root-only, and workspace-root-only)
 * and applies remapping for template files.
 * 合併所有靜態檔案映射（預設、僅根目錄和僅工作區根目錄）並應用模板檔案的重新映射。
 *
 * This function is useful for setting up a complete workspace with all
 * necessary configuration files.
 * 此函數對於設置包含所有必要配置檔案的完整工作區非常有用。
 *
 * @returns A combined static files map with remapped entries / 具有重新映射條目的合併靜態檔案映射
 *
 * @example
 * ```typescript
 * import { getWsCopyStaticFiles } from '@yarn-tool/static-file';
 *
 * // Get all static files for workspace setup
 * // 獲取工作區設置的所有靜態檔案
 * const files = getWsCopyStaticFiles();
 *
 * // The returned map includes:
 * // - Package-level files (.gitignore, .npmignore, etc.)
 * // - Root-level files (lerna.json, pnpm-workspace.yaml, etc.)
 * // - Workspace-root files (__root_ws.ts, jest-preset.js, etc.)
 * //
 * // 返回的映射包括：
 * // - 套件層級檔案（.gitignore、.npmignore 等）
 * // - 根目錄層級檔案（lerna.json、pnpm-workspace.yaml 等）
 * // - 工作區根目錄檔案（__root_ws.ts、jest-preset.js 等）
 * ```
 */
export declare function getWsCopyStaticFiles(): IStaticFiles<IStaticFilesKey<typeof defaultCopyStaticFiles | typeof defaultCopyStaticFilesRootOnly> | keyof typeof remap>;
export default getWsCopyStaticFiles;
