/**
 * 選項正規化與預發行偵測
 * Option normalization and pre-release detection
 */
import { INextVersionRecommendedOptions, IPreReleaseType, IResultDetectPreid } from './types';
import { ReleaseType } from 'semver';
import WorkspacesProject from '@yarn-tool/workspaces-project';
/**
 * 正規化版本推薦選項
 * Normalize version recommendation options
 *
 * 將布林旗標轉為 bump、依舊版本推斷預發行資訊，最後才交由呼叫端指定值優先。
 *
 * Converts boolean flags into a bump, infers pre-release info from the old
 * version, and finally lets explicit caller values win.
 *
 * @param options - 原始選項 / Raw options
 * @param oldVersion - 舊版本號，用於預發行偵測 / Old version used for pre-release detection
 * @param wsProject - workspaces 專案，提供預設 bump / Workspaces project providing the default bump
 * @returns 正規化後的選項（必定含 bump）/ Normalized options (always including bump)
 */
export declare function handleOptions(options?: INextVersionRecommendedOptions, oldVersion?: string, wsProject?: WorkspacesProject): INextVersionRecommendedOptions;
/**
 * 判斷 bump 是否為預發行類型
 * Check whether a bump type is a pre-release type
 *
 * 以 `pre` 前綴判定，涵蓋 premajor/preminor/prepatch/prerelease 四種。
 *
 * Detected via the `pre` prefix, covering premajor/preminor/prepatch/prerelease.
 *
 * @param bump - bump 類型 / Bump type
 * @returns 是否為預發行類型 / Whether it is a pre-release type
 */
export declare function releaseTypesIsPre<T extends ReleaseType>(bump: T): bump is IPreReleaseType<T>;
/**
 * 由舊版本的預發行段偵測 bump、preid 與 identifierBase
 * Detect bump, preid and identifierBase from a version's pre-release segment
 *
 * 純數字識別（如 1.0.0-1）若以預設 identifierBase 遞增會重設為 1，
 * 故此處改以 false 讓計數持續遞增。
 *
 * A numeric identifier (e.g. 1.0.0-1) would restart at 1 with the default
 * identifierBase, so it is switched to false to keep counting up.
 *
 * @param oldVersion - 舊版本號 / Old version
 * @param options - 原始選項，會被 ??= 補上偵測值 / Raw options, filled with detected values via ??=
 * @returns 偵測結果；非預發行版本回傳 null / Detection result; null when not a pre-release
 */
export declare function detectPreidByVersion(oldVersion: string, options?: INextVersionRecommendedOptions): IResultDetectPreid | null;
