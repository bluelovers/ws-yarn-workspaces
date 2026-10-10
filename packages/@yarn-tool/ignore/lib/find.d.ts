import { ICwdOrFindIgnoreFilesOptions, IFindIgnoreFilesOptions } from './types';
/**
 * 整理搜尋選項，套用「預設停止於目前套件」
 * Normalize search options, applying "stop at current package" by default
 *
 * 這是「預設停止於目前套件」的單一事實來源；
 * 若需開放向上搜尋至工作區，傳入 `stopAtCurrentPackage: false` 即可。
 * This is the single source of truth for the default stop point;
 * pass `stopAtCurrentPackage: false` to open the search up to the workspace.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項，優先於 cwd 物件 / Additional options, taking precedence over the cwd object
 */
export declare function handleFindIgnoreFilesOptions(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): IFindIgnoreFilesOptions;
/**
 * 取得將被搜尋的父層路徑的產生器（由近至遠）
 * Generator of the parent directories to be searched (nearest first)
 *
 * 預設最遠只到目前套件目錄；傳入 `stopAtCurrentPackage: false` 時可延伸至工作區根目錄。
 * By default the farthest directory is the current package directory;
 * pass `stopAtCurrentPackage: false` to extend the search to the workspace root.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 */
export declare function findIgnoreFileDirsGenerator(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): Generator<string, void, unknown>;
/**
 * 取得將被搜尋的父層路徑的完整陣列（由近至遠）
 *
 * 為 {@link findIgnoreFileDirsGenerator} 的完整展開。
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 額外的選項 / Additional options
 */
export declare function findIgnoreFileDirs(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): string[];
/**
 * 逐層向上搜尋 ignore 檔案的產生器（由近至遠）
 * Generator that searches ignore files layer by layer (nearest first)
 *
 * 每個父層目錄 yield 一次，回傳該層找到的 `{ dir, list }`；
 * 逐層產出讓呼叫端找到目標後即可中斷，不必先建立完整陣列。
 * Yields once per parent directory with the `{ dir, list }` found there;
 * producing layer by layer lets the caller stop once the target is found
 * instead of building the whole array first.
 *
 * @param cwd - 目前工作目錄或選項物件 / Current working directory or options object
 * @param opts - 搜尋選項，可用 `fileNames` 自訂檔名、`stopAtCurrentPackage` 控制範圍
 * Search options; use `fileNames` to customize names and `stopAtCurrentPackage` to control the range
 */
export declare function findIgnoreFilesGenerator(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): Generator<{
    dir: string;
    list: {
        name: string;
        path: string;
    }[];
}, void, unknown>;
export declare function findIgnoreFiles(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): {
    dir: string;
    list: {
        name: string;
        path: string;
    }[];
}[];
