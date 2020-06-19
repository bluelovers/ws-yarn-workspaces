/**
 * Created by user on 2020/6/20.
 */
import { ISortPackageJsonScriptsOptions } from './types';
/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
export declare function _core<T extends Record<string, any>>(scripts: T, opts: ISortPackageJsonScriptsOptions): T;
export declare function sortPackageJsonScriptsOld<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T;
export declare function sortPackageJsonScripts<T extends Record<string, any>>(scripts: T, opts?: ISortPackageJsonScriptsOptions): T;
export default sortPackageJsonScripts;
