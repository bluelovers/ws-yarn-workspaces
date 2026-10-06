import { INextVersionRecommendedOptions } from './types';
import { IPackageJson } from '@ts-type/package-dts/package-json';
/**
 * 由傳入的 package 物件計算推薦版本
 * Recommend a version from an explicit package object
 *
 * @param pkg - 含 version 欄位的 package 物件 / Package object with a version field
 * @param options - 推薦選項 / Recommendation options
 * @returns 推薦結果，額外帶有原始 pkg / Recommendation result, plus the original pkg
 * @throws TypeError 當 pkg.version 缺失時 / When pkg.version is missing
 */
export declare function nextVersionRecommendedByPackage<T extends {
    name?: string;
    version?: string;
}>(pkg: T, options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
/**
 * 自 cwd 向上尋找專案根目錄並讀取 package.json 後計算推薦版本
 * Find the project root from cwd upward, read package.json, then recommend
 *
 * 為套件預設匯出：多數 CLI 使用情境只需給 cwd。
 *
 * This is the default export: most CLI usage only needs to supply cwd.
 *
 * @param options - 推薦選項，cwd 預設為 process.cwd() / Recommendation options; cwd defaults to process.cwd()
 * @returns 推薦結果，額外帶有讀取到的 pkg / Recommendation result, plus the loaded pkg
 */
export declare function nextVersionRecommendedByPackageFindUp<T extends {
    name?: string;
    version?: string;
} = IPackageJson>(options?: INextVersionRecommendedOptions): {
    pkg: T;
    bump: import("semver").ReleaseType;
    oldVersion: string;
    newVersion: string;
};
