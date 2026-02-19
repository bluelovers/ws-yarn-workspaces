/**
 * @yarn-tool/pkg-readme-tpl
 *
 * README 模板處理工具模組
 * README template processing utility module
 *
 * 此模組提供使用 lodash 模板引擎處理 README 文件的功能。
 * This module provides functionality to process README files using lodash template engine.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { writeReadme, IOptionsWriteReadme } from '@yarn-tool/pkg-readme-tpl';
 *
 * // 定義模板變數介面 / Define template variables interface
 * interface MyTemplateVars {
 *   name: string;
 *   version: string;
 *   description: string;
 * }
 *
 * // 使用 writeReadme 函數處理 README 模板
 * // Use writeReadme function to process README template
 * writeReadme<MyTemplateVars>({
 *   file: './README.md',
 *   variable: {
 *     name: 'my-package',
 *     version: '1.0.0',
 *     description: 'An awesome package'
 *   }
 * });
 * ```
 */

// 匯出主要函數和介面 / Export main function and interface
export { writeReadme, IOptionsWriteReadme } from "./lib/writeReadme";
