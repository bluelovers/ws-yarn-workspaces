import { IPackageJson } from '@ts-type/package-dts/package-json';
/**
 * 取得新專案根目錄的預設 package.json 內容。
 *
 * @param name 套件名稱；未提供時保留 undefined 交由呼叫端補上。
 * @returns 含預設 scripts 與依賴的 package.json 物件。
 */
export declare function getDefaultPackageJson(name?: string): IPackageJson;
/**
 * 取得新專案根目錄的預設 tsconfig 內容。
 *
 * @returns 繼承 @bluelovers/tsconfig 的 tsconfig 物件。
 * @deprecated
 */
export declare function getDefaultTsconfig(): {
    extends: string;
};
