import WorkspacesProject from '@yarn-tool/workspaces-project/index';
import { INextVersionRecommendedOptions } from './types';
export declare function nextVersionRecommendedByWorkspacesProject(oldVersion: string, wsProject: WorkspacesProject): import("./types").INextVersionRecommended;
export declare function nextVersionRecommendedByWorkspacesFindUp(oldVersion: string, options?: INextVersionRecommendedOptions): import("./types").INextVersionRecommended;
