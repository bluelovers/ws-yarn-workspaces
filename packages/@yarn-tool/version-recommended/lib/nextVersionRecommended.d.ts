import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import WorkspacesProject from '@yarn-tool/workspaces-project';
/**
 * 依舊版本與選項計算推薦的新版本號
 * Recommend a new version from the old version and options
 *
 * 設計意圖：bump 類型若未明確指定，交給 handleOptions 依舊版本的
 * 預發行資訊與 workspaces 設定推斷，而非一律使用 patch。
 *
 * Design intent: when bump is not given explicitly, handleOptions infers it
 * from the old version's pre-release info and the workspaces setting,
 * instead of always assuming patch.
 *
 * @param oldVersion - 舊版本號 / Old version string
 * @param options - 推薦選項 / Recommendation options
 * @param wsProject - workspaces 專案實例，提供預設 bump / Workspaces project instance providing the default bump
 * @returns 推薦結果（含實際使用的 bump）/ Recommendation result including the bump actually used
 */
export declare function nextVersionRecommended(oldVersion: string, options?: INextVersionRecommendedOptions, wsProject?: WorkspacesProject): INextVersionRecommended;
