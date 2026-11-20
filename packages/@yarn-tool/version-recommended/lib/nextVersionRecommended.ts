/**
 * 核心版本推薦邏輯
 */
import { inc as semverIncrement, ReleaseType } from 'semver';
import { INextVersionRecommended, INextVersionRecommendedOptions } from './types';
import { handleOptions } from './handleOptions';
import WorkspacesProject from '@yarn-tool/workspaces-project';

/**
 * 依舊版本與選項計算推薦的新版本號
 *
 * 設計意圖：bump 類型若未明確指定，交給 handleOptions 依舊版本的
 * 預發行資訊與 workspaces 設定推斷，而非一律使用 patch。
 *
 * @param oldVersion - 舊版本號
 * @param options - 推薦選項
 * @param wsProject - workspaces 專案實例，提供預設 bump
 */
export function nextVersionRecommended(oldVersion: string,
	options?: INextVersionRecommendedOptions,
	wsProject?: WorkspacesProject,
): INextVersionRecommended
{
	options = handleOptions(options, oldVersion, wsProject);

	/** 未指定且無法從舊版本推斷時才退回 patch：這是語意化版本的最小變更類型 */
	let bump = options.bump ?? 'patch';

	const newVersion = semverIncrement(oldVersion, bump, options.preid, options.identifierBase as any);

	return {
		bump,
		oldVersion,
		newVersion,
	}
}
