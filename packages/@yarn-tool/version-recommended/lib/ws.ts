import WorkspacesProject from '@yarn-tool/workspaces-project/index';
import { nextVersionRecommended } from './nextVersionRecommended';

export function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject)
{
	return nextVersionRecommended(oldVersion, wsProject)
}

export function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: {
	cwd?: string
})
{
	let wsProject = new WorkspacesProject(options?.cwd)

	return nextVersionRecommendedByWorkspacesProject(oldVersion, wsProject)
}
