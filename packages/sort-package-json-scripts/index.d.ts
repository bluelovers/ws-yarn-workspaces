export type { ISortPackageJsonScriptsOptions } from './lib/types';
import { ISortPackageJsonScriptsOptions } from './lib/types';
/**
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
export declare function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T;
export default sortPackageJsonScripts;
