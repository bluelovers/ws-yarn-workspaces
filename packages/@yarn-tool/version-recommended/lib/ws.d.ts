import WorkspacesProject from '@yarn-tool/workspaces-project/index';
export declare function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject): import("./types").INextVersionRecommended;
export declare function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: {
    cwd?: string;
}): import("./types").INextVersionRecommended;
