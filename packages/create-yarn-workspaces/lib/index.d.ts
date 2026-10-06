import { IPackageJson } from '@ts-type/package-dts/package-json';
/**
 * 取得新專案根目錄的預設 package.json 內容。
 * Build the default root `package.json` content for a new project.
 *
 * @param name 套件名稱；未提供時保留 undefined 交由呼叫端補上。Package name; left `undefined` when absent for the caller to fill in.
 * @returns 含預設 scripts 與依賴的 package.json 物件。A `package.json` object with default scripts and dependencies.
 */
export declare function getDefaultPackageJson(name?: string): IPackageJson;
/**
 * 取得新專案根目錄的預設 tsconfig 內容。
 * Build the default root `tsconfig` content for a new project.
 *
 * @returns 繼承 @bluelovers/tsconfig 的 tsconfig 物件。A `tsconfig` object extending `@bluelovers/tsconfig`.
 */
export declare function getDefaultTsconfig(): {
    extends: string;
};
