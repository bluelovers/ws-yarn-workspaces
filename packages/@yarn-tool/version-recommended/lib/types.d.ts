import { ReleaseType } from 'semver';
import { ITSPartialRecord } from 'ts-type/lib/type/record';
import { IdentifierBase } from 'semver/functions/inc';
export interface INextVersionRecommended {
    bump: ReleaseType;
    oldVersion: string;
    newVersion: string;
}
export interface IResultDetectPreid {
    bump: IPreReleaseType;
    preid: string;
    identifierBase: IdentifierBase | false;
}
export interface INextVersionRecommendedOptions extends ITSPartialRecord<ReleaseType, boolean> {
    cwd?: string;
    bump?: ReleaseType;
    preid?: string;
    identifierBase?: IdentifierBase | 0 | 1 | false;
    defaultPreid?: string;
}
export type IBaseReleaseType<T extends ReleaseType = ReleaseType> = Exclude<T, `pre${string}`>;
export type IPreReleaseType<T extends ReleaseType = ReleaseType> = Extract<T, `pre${string}`>;
export declare const releaseTypes: ReleaseType[];
