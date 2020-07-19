export declare const scopedPackagePattern: RegExp;
export interface IResult {
    validForNewPackages: boolean;
    validForOldPackages: boolean;
    warnings?: string[];
    errors?: string[];
}
export interface IOptions {
    targetNodeJSVersion?: string;
    blacklist?: (string | RegExp)[];
    throwErr?: boolean;
}
export interface IValidateNpmPackageNameReturnType extends IResult {
    scopedPackagePattern: boolean;
    name: string;
    user?: string;
    subname?: string;
}
