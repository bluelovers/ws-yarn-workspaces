/**
 * @yarn-tool/static-file
 *
 * A utility for copying static configuration files to yarn workspace projects.
 * 用於將靜態配置檔案複製到 yarn 工作區專案的工具。
 *
 * This package provides functionality to copy predefined static files
 * (such as .gitignore, tsconfig.json, etc.) to target directories.
 * 此套件提供將預定義的靜態檔案（如 .gitignore、tsconfig.json 等）
 * 複製到目標目錄的功能。
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { copyStaticFiles } from '@yarn-tool/static-file';
 *
 * // Copy default static files to current directory
 * // 將預設靜態檔案複製到當前目錄
 * copyStaticFiles({
 *   cwd: process.cwd(),
 *   overwrite: true
 * });
 * ```
 */
import { copyStaticFiles } from './lib/copyStaticFiles';
export { copyStaticFiles };
export default copyStaticFiles;
