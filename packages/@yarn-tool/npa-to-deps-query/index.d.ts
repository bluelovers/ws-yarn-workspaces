/**
 * @fileoverview Resolve npm-package-arg specs to concrete versions via the npm registry
 * @description 透過 npm registry 將 npm-package-arg (npa) 規格解析為具體版本
 *
 * 設計重點：只有轉換結果標記 fetchQuery 時才發送 registry 請求，
 * 可直接保留的範圍或標籤原樣回傳，避免不必要的網路查詢。
 *
 * Design note: a registry request is sent only when the conversion result is flagged
 * `fetchQuery`; ranges or tags that can be kept as-is are returned without any lookup.
 *
 * @module @yarn-tool/npa-to-deps-query
 */
import { IOptions as IOptionsDepsValue, IDepsResult } from '@yarn-tool/npa-to-deps';
import Bluebird from 'bluebird';
import { ITSResolvable } from 'ts-type';
import { IOptionsQueryVersion } from '@yarn-tool/pkg-version-query/lib/types';
import { Options } from 'package-json';
import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';
/**
 * 解析、轉換與查詢共用的選項 / Options shared by parsing, conversion and query
 *
 * 繼承 @yarn-tool/npa-to-deps 的解析選項，再加上 registry 查詢專用的 queryOptions
 * Extends the parsing options of @yarn-tool/npa-to-deps with the registry-specific `queryOptions`
 *
 * @export
 * @interface IOptions
 */
export interface IOptions extends IOptionsDepsValue {
    /**
     * 傳給 @yarn-tool/pkg-version-query 的查詢選項，可用來覆寫 package-json 的請求設定
     * Query options forwarded to @yarn-tool/pkg-version-query, e.g. to override package-json request settings
     */
    queryOptions?: IOptionsQueryVersion<Options>;
}
/**
 * 針對既有的依賴值轉換結果查詢版本 / Query a version for an existing dependency value result
 *
 * 當結果標記 fetchQuery 時，以 semver（缺漏時退回 fetchSpec）向 registry 查詢符合的版本；
 * 否則直接以原始 semver 組出 value，不發送任何請求。
 *
 * When the result is flagged `fetchQuery`, query the registry for a matching version using
 * `semver` (falling back to `fetchSpec` when it is absent); otherwise compose `value` from the
 * original `semver` without any request.
 *
 * @param {ITSResolvable<IDepsResult>} depsResult - 依賴值轉換結果或其 Promise / dependency value result or a promise of it
 *
 * @param {IOptions} [options] - 查詢與轉換選項 / query and conversion options
 *
 * @returns {{ name: string, value: string }} value 為 operator 加上版本或原始範圍 / value is the operator plus the queried version or the original range
 *
 * @example
 * await queryDepsValueByNpaResult(npaToDepsValue('jest@^12'));
 * // => { name: 'jest', value: '^12.1.1' }
 *
 * @example
 * await queryDepsValueByNpaResult(npaToDepsValue('jest@>12'));
 * // => { name: 'jest', value: '>12' }（無需查詢 / no lookup needed）
 */
export declare function queryDepsValueByNpaResult(depsResult: ITSResolvable<IDepsResult>, options?: IOptions): Bluebird<{
    name: string;
    value: string;
}>;
/**
 * 解析套件規格字串並查詢具體版本 / Parse a package spec string and query the concrete version
 *
 * 先以 npaToDepsValue 解析 input，再交給 queryDepsValueByNpaResult 查詢版本，
 * 最後把轉換結果與 { name, value } 合併回傳，讓呼叫端一次取得完整依賴資訊。
 *
 * Parse `input` with npaToDepsValue, run the lookup through queryDepsValueByNpaResult,
 * then merge the conversion result with `{ name, value }` so callers get the full
 * dependency information in one place.
 *
 * @param {string} input - 套件規格字串，例如 `jest@^12` / package spec string, e.g. `jest@^12`
 *
 * @param {IOptions} [options] - 解析、轉換與查詢選項 / parsing, conversion and query options
 *
 * @example
 * // 查詢 registry 取得具體版本 / Query the registry for a concrete version
 * queryDepsValueByNpa('jest@12').tap(console.dir);
 * // => { name: 'jest', value: '12.1.1', ..., result: ... }
 *
 * @example
 * // 已有轉換結果時請改用 queryDepsValueByNpaResult
 * // Use queryDepsValueByNpaResult when you already have a conversion result
 * queryDepsValueByNpaResult(npaToDepsValue('jest@>12'));
 * // => { name: 'jest', value: '>12' }
 */
export declare function queryDepsValueByNpa(input: string, options?: IOptions): Bluebird<IDepsResult<IResult> & {
    name: string;
    value: string;
}>;
export default queryDepsValueByNpa;
