import { INextVersionRecommendedOptions } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function nextVersionRecommendedByPackage<T extends {
    version?: string;
}>(pkg: T, options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
export declare function nextVersionRecommendedByPackageFindUp<T extends {
    version?: string;
} = IPackageJson>(options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
