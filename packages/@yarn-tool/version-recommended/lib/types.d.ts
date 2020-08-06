import { ReleaseType } from 'semver';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
export interface INextVersionRecommended {
    bump: ReleaseType;
    oldVersion: string;
    newVersion: string;
}
export interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean> {
    cwd?: string;
    bump?: ReleaseType;
}
export declare const releaseTypes: ReleaseType[];
