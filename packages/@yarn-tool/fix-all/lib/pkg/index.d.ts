/**
 * @yarn-tool/fix-all/lib/pkg
 *
 * package.json 自動修復處理模組
 * package.json auto-fix processing module
 *
 * 處理 workspace 中每個套件的迭代與修復
 * Handles the iteration and fixing of each package in the workspace
 */
import { IOptionsPkgListable } from 'ws-pkg-list';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
import Bluebird from 'bluebird';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { ICacheInput } from '@yarn-tool/fix-ws-versions';
import { INpmAutoFixAll } from '../../index';
/**
 * 處理套件列表項目的 handler 函數
 * Handler function for processing package list entries
 *
 * @param {string} cwd - 當前工作目錄 / Current working directory
 * @param {Parameters<IOptionsPkgListable["handler"]>} argv - Handler 參數 / Handler arguments
 * @returns {object} 處理後的項目物件 / Processed entry object
 */
export declare function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>): {
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
    prefix: string;
};
/**
 * _handler 返回的項目類型
 * Entry type returned by _handler
 */
export type IEntry = ReturnType<typeof _handler>;
/**
 * 執行每個套件修復的選項
 * Options for running each package fix
 *
 * 繼承自 IFillPkgHostedInfoOptions 和 INpmAutoFixAll 的必要屬性
 * Inherits required properties from IFillPkgHostedInfoOptions and INpmAutoFixAll
 *
 * @extends {ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, ...>}
 */
export interface IOptionsRunEachPackages extends ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, 'overwriteHostedGitInfo' | 'branch' | 'rootData' | 'hostedGitInfo' | 'resetStaticFiles'> {
}
/**
 * 執行單一套件修復的核心函數
 * Core function for fixing a single package
 *
 * 此函數負責對單一套件執行完整的修復流程，包括：
 * This function performs the complete fix process for a single package, including:
 * 1. 重置靜態檔案（如啟用）/ Reset static files (if enabled)
 * 2. 複製靜態檔案到套件目錄 / Copy static files to package directory
 * 3. 驗證套件匯出 / Verify package exports
 * 4. 填充託管 git 資訊 / Fill hosted git info
 * 5. 修復 tsdx 套件（如適用）/ Fix tsdx package (if applicable)
 * 6. 修復依賴版本 / Fix dependency versions
 * 7. 標準化依賴值 / Normalize dependency values
 * 8. 設定預設腳本 / Set default scripts
 * 9. 排序並寫入 package.json / Sort and write package.json
 *
 * @param {IEntry} row - 套件項目資料 / Package entry data
 * @param {IOptionsRunEachPackages} options - 修復操作的選項 / Options for the fix operation
 * @param {ICacheInput<IEntry>} cache - 依賴版本修復的快取 / Cache for dependency version fixing
 * @param {AggregateErrorExtra} err - 錯誤聚合器 / Error aggregator
 */
export declare function _runFixPackagesCore(row: IEntry, options: IOptionsRunEachPackages, cache: ICacheInput<IEntry>, err: AggregateErrorExtra): void;
/**
 * 非同步執行每個套件的修復操作
 * Run fix operations on each package asynchronously
 *
 * 對每個套件執行以下操作：
 * Performs the following operations on each package:
 * 1. 驗證套件匯出 / Verify package exports
 * 2. 填充託管 git 資訊 / Fill hosted git info
 * 3. 修復 tsdx 套件（如適用）/ Fix tsdx package (if applicable)
 * 4. 修復依賴版本 / Fix dependency versions
 * 5. 標準化依賴值 / Normalize dependency values
 * 6. 設定預設腳本 / Set default scripts
 * 7. 排序並寫入 package.json / Sort and write package.json
 *
 * @param {IEntry[]} list - 套件項目列表 / List of package entries
 * @param {IOptionsRunEachPackages} options - 修復操作的選項 / Options for the fix operation
 * @returns {Bluebird<void>} Promise 物件 / Promise object
 */
export declare function _runEachPackagesAsync(list: IEntry[], options: IOptionsRunEachPackages): Bluebird<void[]>;
/**
 * 從根資料初始化套件列表
 * Initialize package list from root data
 *
 * 根據 workspace 或單一套件模式返回要處理的套件列表
 * Returns list of packages to process based on workspace or single package mode
 *
 * @param {Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>} rootData - 根資料物件 / Root data object
 * @returns {IEntry[]} 套件項目列表 / List of package entries
 */
export declare function _initPkgListableByRootData(rootData: Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>): {
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
    prefix: string;
}[];
