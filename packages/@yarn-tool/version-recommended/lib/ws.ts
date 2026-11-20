import WorkspacesProject from '@yarn-tool/workspaces-project';
import { nextVersionRecommended } from './nextVersionRecommended';
import { INextVersionRecommendedOptions } from './types';

/**
 * 以既有的 WorkspacesProject 實例計算推薦版本
 *
 * 傳入實例而非 cwd，可讓呼叫端重複使用同一實例（避免反覆掃描磁碟）。
 *
 * @param oldVersion - 舊版本號
 * @param wsProject - workspaces 專案實例
 * @param options - 推薦選項
 * @returns 推薦結果
 */
export function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject,
	options?: INextVersionRecommendedOptions)
{
	return nextVersionRecommended(oldVersion, options, wsProject)
}

/**
 * 自 cwd 向上建立 WorkspacesProject 後計算推薦版本
 *
 * 適合不知道 workspaces 根目錄在哪的呼叫端。
 *
 * @param oldVersion - 舊版本號
 * @param options - 推薦選項，cwd 決定搜尋起點
 * @returns 推薦結果
 */
export function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: INextVersionRecommendedOptions)
{
	let wsProject = new WorkspacesProject(options?.cwd)

	return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject, options)
}
