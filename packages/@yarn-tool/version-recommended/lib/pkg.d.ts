import { INextVersionRecommendedOptions } from './types';
export declare function nextVersionRecommendedByPackage<T extends {
    version?: string;
}>(pkg: T, options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
export declare function nextVersionRecommendedByPackageFindUp(options?: INextVersionRecommendedOptions): {
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
