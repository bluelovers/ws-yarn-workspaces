import { ReleaseType } from 'semver';
import { INextVersionRecommended } from './types';
export declare function nextVersionRecommended(oldVersion: string, options?: {
    bump?: ReleaseType;
}): INextVersionRecommended;
