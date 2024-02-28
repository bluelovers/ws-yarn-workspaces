import { INextVersionRecommendedOptions, IPreReleaseType, IResultDetectPreid } from './types';
import { ReleaseType } from 'semver';
export declare function handleOptions(options?: INextVersionRecommendedOptions, oldVersion?: string): INextVersionRecommendedOptions;
export declare function releaseTypesIsPre<T extends ReleaseType>(bump: T): bump is IPreReleaseType<T>;
export declare function detectPreidByVersion(oldVersion: string, options?: INextVersionRecommendedOptions): IResultDetectPreid | null;
