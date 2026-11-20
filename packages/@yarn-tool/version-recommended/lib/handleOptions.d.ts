/**
 * 選項正規化與預發行偵測
 */
import { INextVersionRecommendedOptions, IPreReleaseType, IResultDetectPreid } from './types';
import { ReleaseType } from 'semver';
import WorkspacesProject from '@yarn-tool/workspaces-project';
/**
 * 正規化版本推薦選項
 *
 * 將布林旗標轉為 bump、依舊版本推斷預發行資訊，最後才交由呼叫端指定值優先。
 *
 * @param options - 原始選項
 * @param oldVersion - 舊版本號，用於預發行偵測
 * @param wsProject - workspaces 專案，提供預設 bump
 * @returns 正規化後的選項（必定含 bump）
 */
export declare function handleOptions(options?: INextVersionRecommendedOptions, oldVersion?: string, wsProject?: WorkspacesProject): INextVersionRecommendedOptions;
/**
 * 判斷 bump 是否為預發行類型
 *
 * 以 `pre` 前綴判定，涵蓋 premajor/preminor/prepatch/prerelease 四種。
 *
 * @param bump - bump 類型
 * @returns 是否為預發行類型
 */
export declare function releaseTypesIsPre<T extends ReleaseType>(bump: T): bump is IPreReleaseType<T>;
/**
 * 由舊版本的預發行段偵測 bump、preid 與 identifierBase
 *
 * 純數字識別（如 1.0.0-1）若以預設 identifierBase 遞增會重設為 1，
 * 故此處改以 false 讓計數持續遞增。
 *
 * @param oldVersion - 舊版本號
 * @param options - 原始選項，會被 ??= 補上偵測值
 * @returns 偵測結果；非預發行版本回傳 null
 */
export declare function detectPreidByVersion(oldVersion: string, options?: INextVersionRecommendedOptions): IResultDetectPreid | null;
