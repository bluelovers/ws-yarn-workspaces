import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import { WorkspacesProject } from '@yarn-tool/workspaces-project';
/**
 * 依舊版本與選項計算推薦的新版本號
 *
 * 設計意圖：bump 類型若未明確指定，交給 handleOptions 依舊版本的
 * 預發行資訊與 workspaces 設定推斷，而非一律使用 patch。
 * 指定 versionStyle 時新版本改交給 version-style-jetbrains 產生，
 * 該路徑只看 versionStyle、resetDailyIncrement、date 與 preid 系列選項。
 *
 * @param oldVersion - 舊版本號
 * @param options - 推薦選項
 * @param wsProject - workspaces 專案實例，提供預設 bump
 */
export declare function nextVersionRecommended(oldVersion: string, options?: INextVersionRecommendedOptions, wsProject?: WorkspacesProject): INextVersionRecommended;
