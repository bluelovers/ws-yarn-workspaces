/**
 * npm 套件名稱驗證的對外入口
 * Public entry of npm package name validation
 *
 * 在核心規則之上補上 scoped 套件切分、throwErr 選項
 * 與參數相容處理。
 * Builds on the core rules by adding scoped package splitting,
 * the throwErr option, and argument compatibility handling.
 *
 * @module @yarn-tool/validate-npm-package-name/lib/validateNpmPackageName
 */
import { IValidateNpmPackageNameReturnType, IOptions } from './types';
/**
 * 驗證 npm 套件名稱
 * Validate an npm package name
 *
 * @param {string} name - 待驗證的名稱 / The name to validate
 * @param {boolean | IOptions} [options] - 布林值相容舊版 throwErr 用法，或完整選項物件 /
 * A boolean for the legacy throwErr shorthand, or the full options object
 * @returns {IValidateNpmPackageNameReturnType} 附帶名稱與 scope 資訊的驗證結果 / Validation result enriched with name and scope info
 * @throws {RangeError} 設定 throwErr 且驗證發生錯誤時 / When throwErr is set and validation produced errors
 *
 * @example
 * validateNpmPackageName('@npm/thingy');
 * // => { validForNewPackages: true, scopedPackagePattern: true, user: 'npm', subname: 'thingy', ... }
 */
export declare function validateNpmPackageName(name: string, options?: boolean | IOptions): IValidateNpmPackageNameReturnType;
export default validateNpmPackageName;
