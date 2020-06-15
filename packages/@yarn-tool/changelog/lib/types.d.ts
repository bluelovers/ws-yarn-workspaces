/**
 * Created by user on 2020/6/15.
 */
import { ITSRequireAtLeastOne } from 'ts-type';
export declare type IChangelogPreset = string | "conventional-changelog-angular" | "@bluelovers/conventional-changelog-bluelovers";
export declare type IType = "independent" | "root" | string;
export interface IOptionsBaseCore {
    changelogPreset?: IChangelogPreset;
    rootPath?: string;
}
export interface IOptionsBase extends IOptionsBaseCore {
    tagPrefix?: string | 'v';
}
export declare type IOptionsInput = IOptionsBase & ITSRequireAtLeastOne<IOptionsBaseCore>;
export declare type IOptionsUpdateChangelog = IOptionsInput & {
    version?: string;
};
export declare type IOptionsRecommendVersion = IOptionsInput & {
    prereleaseId?: string;
};
export declare type IOptionsWithType<T extends Record<any, any>> = T & {
    type?: IType;
};
export interface IReturnTypeUpdateChangelog {
    logPath: string;
    newEntry: string;
    version: string;
}
