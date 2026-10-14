"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesTsdx = void 0;
/**
 * 預設的靜態檔案複製映射表
 * Default static file copy mapping table
 *
 * 定義需要複製到目標專案的靜態檔案，每個項目為 [目標路徑, 來源路徑, ?來源檔名] 的格式。
 * Defines static files that need to be copied to the target project,
 * each entry follows [targetPath, sourcePath, ?sourceFileName] format.
 */
const _defaultCopyStaticFilesTsdx = [
    /**
     * 根目錄的 tsconfig.json 設定檔
     * Root tsconfig.json configuration file
     */
    ['tsconfig.json', 'file/tsconfig.tsdx.json.tpl'],
    /**
     * 測試目錄的 tsconfig.json 設定檔
     * Test directory tsconfig.json configuration file
     */
    ['test/tsconfig.json', 'file/test/tsconfig.json.tpl'],
    ['src/index.ts.tpl', 'file/tsdx/index.ts', 'src/index.cts'],
    /**
     * src 目錄下的 index.cts 檔案
     * index.cts file under src directory
     */
    ['src/index.cts', 'file/tsdx/index.cts'],
    /**
     * src 目錄的 tsconfig.json 設定檔
     * src directory tsconfig.json configuration file
     */
    ['src/tsconfig.json', 'file/tsdx/tsconfig.json.tpl'],
];
/**
 * 凍結的預設靜態檔案映射表
 * Frozen default static file mapping table
 *
 * 凍結是為了避免執行期意外改動全域預設值，影響其他套件的設定流程
 * Frozen to prevent accidental mutation of the global default, which would affect setup runs in other packages
 */
exports.defaultCopyStaticFilesTsdx = Object.freeze(_defaultCopyStaticFilesTsdx);
//# sourceMappingURL=const-tsdx.js.map