import WorkspacesProject from '@yarn-tool/workspaces-project';
import { INextVersionRecommendedOptions } from './types';
export declare function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject, options?: INextVersionRecommendedOptions): import("./types").INextVersionRecommended;
export declare function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: INextVersionRecommendedOptions): import("./types").INextVersionRecommended;
