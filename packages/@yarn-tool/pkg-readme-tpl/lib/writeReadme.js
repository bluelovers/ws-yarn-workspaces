"use strict";
/**
 * writeReadme - README 模板處理模組
 * README template processing module
 *
 * 此模組提供使用 lodash 模板引擎處理 README 文件的功能。
 * This module provides functionality to process README files using lodash template engine.
 *
 * @module writeReadme
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._readReadmeTplCore = _readReadmeTplCore;
exports.writeReadme = writeReadme;
const tslib_1 = require("tslib");
// 匯入檔案系統相關函數 / Import file system related functions
const fs_extra_1 = require("fs-extra");
// 匯入 lodash 模板函數 / Import lodash template function
const template_1 = tslib_1.__importDefault(require("lodash/template"));
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
function _readReadmeTplCore(md1) {
    // 使用 lodash/template 編譯模板內容
    // Compile template content using lodash/template
    let compiled = (0, template_1.default)(md1.toString(), {
    //escape: new RegExp('_'),
    });
    return compiled;
}
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
function writeReadme(options) {
    // 檢查檔案是否存在 / Check if file exists
    if ((0, fs_extra_1.existsSync)(options.file)) {
        // 讀取模板檔案內容並轉換為字串
        // Read template file content and convert to string
        let md1 = (0, fs_extra_1.readFileSync)(options.file).toString();
        // 編譯模板 / Compile the template
        let compiled = _readReadmeTplCore(md1);
        // 使用變數執行編譯後的模板，生成最終內容
        // Execute compiled template with variables to generate final content
        let md2 = compiled(options.variable);
        // 只有在內容有變化時才寫入檔案，避免不必要的磁碟操作
        // Only write to file if content has changed, avoiding unnecessary disk operations
        if (md1 !== md2) {
            (0, fs_extra_1.writeFileSync)(options.file, md2);
        }
    }
}
//# sourceMappingURL=writeReadme.js.map