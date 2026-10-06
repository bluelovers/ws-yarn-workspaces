/**
 * 依版本查詢安裝依賴（未實作）(Install dependencies from a version query, not implemented)
 *
 * 預期流程是先解析使用者輸入的版本查詢，再向 registry 取得可用版本後安裝；
 * 目前僅保留 API 位置，避免使用端因匯入失敗而必須同時改寫。
 *
 * The intended flow is to resolve the user's version query and install the
 * resolved version; the API is kept in place so consumers do not have to
 * change imports while it is unfinished.
 */
import { IOptionsInstallDepsFromQuery } from './types';
/**
 * 依版本查詢安裝依賴（未實作）
 *
 * Install dependencies from a version query (not implemented yet).
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝與版本查詢選項 (Install and version-query options)
 *
 * @throws 始終拋出 `Error('not implement')`，直到實作為止
 *
 * Always throws `Error('not implement')` until the feature lands.
 *
 * @todo implement installDepsFromQuery
 */
export declare function installDepsFromQuery<T extends string>(packageNames: T[], options?: IOptionsInstallDepsFromQuery): Promise<void>;
