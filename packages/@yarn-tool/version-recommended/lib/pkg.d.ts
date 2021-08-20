import { INextVersionRecommendedOptions } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function nextVersionRecommendedByPackage<T extends {
    name?: string;
    version?: string;
}>(pkg: T, options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
export declare function nextVersionRecommendedByPackageFindUp<T extends {
    name?: string;
    version?: string;
} = IPackageJson>(options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
