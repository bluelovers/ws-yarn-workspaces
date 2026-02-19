/**
 * 處理 package.json publishConfig 欄位的工具模組
 * Utility module for handling package.json publishConfig field
 */
import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IPackageJsonPublishConfig } from '@ts-type/package-dts/lib/package-json/types';
/**
 * 修復 publishConfig 欄位
 * Fix publishConfig field
 *
 * 為 scoped package（如 @scope/package）自動添加 publishConfig.access = 'public'
 * Automatically add publishConfig.access = 'public' for scoped packages (e.g., @scope/package)
 *
 * 當套件名稱包含 '/' 且非私有套件時，確保 npm 發布時能正確設定存取權限
 * When package name contains '/' and is not private, ensure correct access settings for npm publish
 *
 * @template T - package.json 類型 / package.json type
 * @param {T} pkg - package.json 物件 / package.json object
 * @returns {T & { publishConfig: IPackageJsonPublishConfig }} 修正後的 package.json 物件 / Corrected package.json object
 */
export declare function fixPublishConfig<T extends IPackageJson>(pkg: T): T & {
    publishConfig: IPackageJsonPublishConfig;
};
