import { INextVersionRecommendedOptions, IPreReleaseType, IResultDetectPreid } from './types';
import { ReleaseType } from 'semver';
import WorkspacesProject from '@yarn-tool/workspaces-project';
export declare function handleOptions(options?: INextVersionRecommendedOptions, oldVersion?: string, wsProject?: WorkspacesProject): INextVersionRecommendedOptions;
export declare function releaseTypesIsPre<T extends ReleaseType>(bump: T): bump is IPreReleaseType<T>;
export declare function detectPreidByVersion(oldVersion: string, options?: INextVersionRecommendedOptions): IResultDetectPreid | null;
