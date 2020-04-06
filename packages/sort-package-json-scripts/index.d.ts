import * as MyUtil from './lib/util';
export declare function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T, opts?: {
    otherNpmScriptsOrder?: typeof MyUtil.otherNpmScriptsOrder;
    defaultNpmScriptsOrder?: typeof MyUtil.defaultNpmScriptsOrder;
    omitKey?: typeof MyUtil.omitKey;
}): T;
export default sortPackageJsonScripts;
