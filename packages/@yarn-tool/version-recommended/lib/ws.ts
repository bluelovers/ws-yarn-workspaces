import WorkspacesProject from '@yarn-tool/workspaces-project';
import { nextVersionRecommended } from './nextVersionRecommended';
import { INextVersionRecommendedOptions } from './types';

export function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject)
{
	return nextVersionRecommended(oldVersion, wsProject)
}

export function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: INextVersionRecommendedOptions)
{
	let wsProject = new WorkspacesProject(options?.cwd)

	return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject)
}
