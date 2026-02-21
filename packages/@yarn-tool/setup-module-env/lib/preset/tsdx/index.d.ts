/**
 * tsdx 專案設定模組
 * tsdx project setup module
 *
 * 此模組提供設定 tsdx 專案的核心功能，包括更新 package.json、
 * 設定靜態檔案映射以及主要設定函式。
 * This module provides core functionality for setting up tsdx projects,
 * including updating package.json, configuring static file mappings,
 * and the main setup function.
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { _Key, IStaticFilesMapArray } from '@yarn-tool/static-file/lib/types';
/**
 * 更新 package.json 以符合 tsdx 專案標準
 * Update package.json to conform to tsdx project standards
 *
 * 此函式會設定以下內容：
 * This function configures the following:
 *
 * - scripts: test, posttest, build, build:dts:bundle, build:tsdx 等
 *   scripts: test, posttest, build, build:dts:bundle, build:tsdx, etc.
 *
 * - main/module/types: 設定輸出檔案路徑
 *   main/module/types: configure output file paths
 *
 * - exports: 設定模組匯出映射
 *   exports: configure module export mappings
 *
 * - keywords: 添加 tsdx 標識關鍵字
 *   keywords: add tsdx identifier keyword
 *
 * @param pkg - 要更新的 package.json 物件 / package.json object to update
 * @param config - 設定選項 (可選) / configuration options (optional)
 * @returns 更新後的 package.json 物件 / Updated package.json object
 */
export declare function updatePackageJson<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>): P;
/**
 * 預設的靜態檔案複製映射表
 * Default static file copy mapping table
 *
 * 定義需要複製到目標專案的靜態檔案，每個項目為 [目標路徑, 來源路徑, ?來源檔名] 的格式。
 * Defines static files that need to be copied to the target project,
 * each entry follows [targetPath, sourcePath, ?sourceFileName] format.
 */
declare const _defaultCopyStaticFilesTsdx: readonly [readonly ["tsconfig.json", "file/tsconfig.tsdx.json.tpl"], readonly ["test/tsconfig.json", "file/test/tsconfig.json.tpl"], readonly ["src/index.cts", "file/tsdx/index.cts"], readonly ["src/tsconfig.json", "file/tsdx/tsconfig.json.tpl"]];
/**
 * 凍結的預設靜態檔案映射表
 * Frozen default static file mapping table
 */
export declare const defaultCopyStaticFilesTsdx: IStaticFilesMapArray<_Key<typeof _defaultCopyStaticFilesTsdx>>;
/**
 * tsdx 設定選項介面
 * tsdx setup options interface
 *
 * @template P - package.json 類型 / package.json type
 */
export interface ISetupTsdxOptions<P extends IPackageJson> {
    /** 目標目錄路徑 / Target directory path */
    targetDir: string;
    /** package.json 物件 / package.json object */
    pkg: P;
    /** 工作區根目錄資訊 / Workspace root directory information */
    rootData: IFindRootReturnType;
    /** 靜態檔案映射表 / Static file mapping table */
    file_map: IStaticFilesMapArray<string>;
    /** README 檔案名稱 / README file name */
    mdFile: string;
    /** 是否存在 README 檔案 / Whether README file exists */
    existsReadme: boolean;
    /** 是否為已存在的專案 / Whether it's an existing project */
    oldExists: boolean;
}
/**
 * 設定 tsdx 專案的主要函式
 * Main function for setting up tsdx project
 *
 * 此函式執行以下操作：
 * This function performs the following operations:
 *
 * 1. 更新 package.json 設定
 *    Update package.json configuration
 *
 * 2. 合併預設與自訂的靜態檔案映射
 *    Merge default and custom static file mappings
 *
 * 3. 確保 src 目錄存在
 *    Ensure src directory exists
 *
 * @template P - package.json 類型 / package.json type
 * @param config - 設定選項 / Configuration options
 * @returns 包含更新後設定的物件 / Object containing updated configuration
 */
export declare function setup<P extends IPackageJson>(config: ISetupTsdxOptions<P>): {
    pkg: P;
    file_map: IStaticFilesMapArray<string>;
    /** 目標目錄路徑 / Target directory path */
    targetDir: string;
    /** 工作區根目錄資訊 / Workspace root directory information */
    rootData: IFindRootReturnType;
    /** README 檔案名稱 / README file name */
    mdFile: string;
    /** 是否存在 README 檔案 / Whether README file exists */
    existsReadme: boolean;
    /** 是否為已存在的專案 / Whether it's an existing project */
    oldExists: boolean;
};
export {};
