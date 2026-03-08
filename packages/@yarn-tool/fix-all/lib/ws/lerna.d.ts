import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
/**
 * Lerna 修復選項型別
 * Lerna fix options type
 *
 * 從 IFillPkgHostedInfoOptions 中選取必需的 rootData 屬性
 * Picks the required rootData property from IFillPkgHostedInfoOptions
 */
export type IOptionsFixLerna = ITSRequiredPick<IFillPkgHostedInfoOptions, 'rootData'>;
/**
 * 合併 Lerna 設定核心邏輯
 * Core logic for merging Lerna configuration
 *
 * 將模板中的命令設定與現有設定進行深度合併，並處理 publish.ignoreChanges 的清單合併與去重
 * Performs deep merge of command settings from template with existing config, and handles merging and deduplication of publish.ignoreChanges list
 *
 * @param currentLernaJson - 當前的 lerna.json 設定物件 / Current lerna.json configuration object
 * @param tpl - 模板 lerna.json 設定物件 / Template lerna.json configuration object
 * @returns 合併後的 lerna.json 設定物件 / Merged lerna.json configuration object
 */
export declare function _fixLernaJsonCore(currentLernaJson: ILernaJson, tpl: ILernaJson): ILernaJson;
/**
 * 處理 Lerna 已棄用屬性的核心邏輯
 * Core logic for handling deprecated Lerna properties
 *
 * 檢測 Lerna 版本，若為 7.0.0 以上版本則移除 useWorkspaces 屬性
 * Detects Lerna version and removes useWorkspaces property if version is 7.0.0 or higher
 *
 * Lerna 7.0.0 開始強制使用 workspaces，useWorkspaces 屬性已無意義
 * Since Lerna 7.0.0, workspaces are mandatory and useWorkspaces property is no longer meaningful
 *
 * @param options - 修復選項，包含 rootData 資訊 / Fix options containing rootData information
 * @param currentLernaJson - 當前的 lerna.json 設定物件 / Current lerna.json configuration object
 * @returns 處理後的 lerna.json 設定物件 / Processed lerna.json configuration object
 */
export declare function _fixLernaDeprecatedCore(options: IOptionsFixLerna, currentLernaJson: ILernaJson): ILernaJson;
/**
 * 修復專案中的 lerna.json 檔案
 * Fix lerna.json file in the project
 *
 * 讀取專案根目錄的 lerna.json，與模板進行合併，並處理已棄用的屬性
 * Reads lerna.json from project root, merges with template, and handles deprecated properties
 *
 * @param options - 修復選項，必須包含 rootData.root（專案根目錄） / Fix options, must contain rootData.root (project root directory)
 */
export declare function _fixLernaJson(options: IOptionsFixLerna): void;
