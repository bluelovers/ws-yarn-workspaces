/**
 * writeReadme - README 模板處理模組
 * README template processing module
 *
 * 此模組提供使用 lodash 模板引擎處理 README 文件的功能。
 * This module provides functionality to process README files using lodash template engine.
 *
 * @module writeReadme
 */
/**
 * writeReadme 函數的選項介面
 * Options interface for writeReadme function
 *
 * @interface IOptionsWriteReadme
 * @template T - 模板變數的型別，必須是物件 / Type of template variables, must be an object
 *
 * @example
 * ```typescript
 * const options: IOptionsWriteReadme<{ name: string; version: string }> = {
 *   file: './README.md',
 *   variable: { name: 'my-package', version: '1.0.0' }
 * };
 * ```
 */
export interface IOptionsWriteReadme<T extends Record<any, any> = Record<any, any>> {
    /**
     * README 模板檔案路徑
     * Path to the README template file
     */
    file: string;
    /**
     * 模板變數物件，用於替換模板中的佔位符
     * Template variable object used to replace placeholders in the template
     */
    variable: T;
}
/**
 * 讀取並編譯 README 模板的核心函數
 * Core function to read and compile README template
 *
 * 此函數將模板內容轉換為可執行的編譯函數。
 * This function converts template content into an executable compiled function.
 *
 * @param {string | Buffer} md1 - README 模板內容，可以是字串或 Buffer
 *                                README template content, can be a string or Buffer
 * @returns {Function} 編譯後的模板函數，可傳入變數物件來生成最終內容
 *                     Compiled template function that accepts a variable object to generate final content
 *
 * @example
 * ```typescript
 * const template = _readReadmeTplCore('Hello, <%= name %>!');
 * const result = template({ name: 'World' });
 * // result: 'Hello, World!'
 * ```
 *
 * @see {@link https://lodash.com/docs/4.17.15#template | Lodash Template Documentation}
 */
export declare function _readReadmeTplCore(md1: string | Buffer): import("lodash").TemplateExecutor;
/**
 * 寫入 README 檔案的主要函數
 * Main function to write README file
 *
 * 此函數會讀取模板檔案，使用提供的變數進行編譯，
 * 並在內容有變化時寫入檔案。
 * This function reads the template file, compiles it with the provided variables,
 * and writes to the file only if the content has changed.
 *
 * @template T - 模板變數的型別 / Type of template variables
 * @param {IOptionsWriteReadme<T>} options - 寫入 README 的選項 / Options for writing README
 * @param {string} options.file - 模板檔案路徑 / Template file path
 * @param {T} options.variable - 模板變數物件 / Template variable object
 *
 * @returns {void}
 *
 * @example
 * ```typescript
 * // 基本使用範例 / Basic usage example
 * writeReadme({
 *   file: './README.md',
 *   variable: {
 *     name: 'my-package',
 *     version: '1.0.0',
 *     description: 'A awesome package'
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // 使用自訂介面 / Using custom interface
 * interface MyVariables {
 *   projectName: string;
 *   author: string;
 * }
 *
 * writeReadme<MyVariables>({
 *   file: './README.md',
 *   variable: { projectName: 'test', author: 'John' }
 * });
 * ```
 *
 * @see {@link _readReadmeTplCore} - 模板編譯核心函數 / Template compilation core function
 */
export declare function writeReadme<T extends Record<any, any> = Record<any, any>>(options: IOptionsWriteReadme<T>): void;
