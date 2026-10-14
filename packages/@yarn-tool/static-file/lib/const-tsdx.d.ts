import { _Key, IStaticFilesMapArray } from "./types";
/**
 * 預設的靜態檔案複製映射表
 * Default static file copy mapping table
 *
 * 定義需要複製到目標專案的靜態檔案，每個項目為 [目標路徑, 來源路徑, ?來源檔名] 的格式。
 * Defines static files that need to be copied to the target project,
 * each entry follows [targetPath, sourcePath, ?sourceFileName] format.
 */
declare const _defaultCopyStaticFilesTsdx: [["tsconfig.json", "file/tsconfig.tsdx.json.tpl"], ["test/tsconfig.json", "file/test/tsconfig.json.tpl"], ["src/index.ts.tpl", "file/tsdx/index.ts", "src/index.cts"], ["src/index.cts", "file/tsdx/index.cts"], ["src/tsconfig.json", "file/tsdx/tsconfig.json.tpl"]];
/**
 * 凍結的預設靜態檔案映射表
 * Frozen default static file mapping table
 *
 * 凍結是為了避免執行期意外改動全域預設值，影響其他套件的設定流程
 * Frozen to prevent accidental mutation of the global default, which would affect setup runs in other packages
 */
export declare const defaultCopyStaticFilesTsdx: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesTsdx>>;
export {};
