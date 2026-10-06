import { IYarnLockRawSourceV1, IYarnLockRawSourceV1Full } from '@yarn-tool/yarnlock-types';
/**
 * 擴充 @yarnpkg/lockfile 的 parse 宣告為泛型，讓呼叫端能指定回傳型別。
 * Widen @yarnpkg/lockfile's parse declaration to generic so callers can pick the return type.
 *
 * @remarks
 * 兩個簽名重複是為了同時保留「不給泛型時的預設型別」與「給泛型時的推導型別」。
 * The duplicated signatures preserve both the default type (no type argument)
 * and the inferred type (with a type argument).
 */
declare module '@yarnpkg/lockfile' {
    function parse<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string, fileLoc?: string): T;
    function parse(source: string, fileLoc?: string): IYarnLockRawSourceV1Full;
}
/**
 * 解析 v1 格式的 yarn.lock，保留最原始的 { type, object } 結構。
 * Parse a v1 yarn.lock and keep the raw { type, object } structure.
 *
 * @param source - lock 檔內容，接受 Buffer 或字串
 *                 - lockfile content, accepts Buffer or string
 * @param fileLoc - 出錯時用於錯誤訊息的檔案位置
 *                  - file location used in error messages
 * @remarks
 * Buffer 在此統一轉成字串，因為底層 parse 只接受字串。
 * The Buffer is converted to string here because the underlying parse only accepts a string.
 */
export declare function parseYarnLockRawV1<T extends IYarnLockRawSourceV1Full = IYarnLockRawSourceV1Full>(source: string | Buffer, fileLoc?: string): T;
/**
 * 取得 v1 原始結果的 object 根節點，輸入缺少 object 鍵時拋出 TypeError。
 * Get the `object` root of a raw v1 result; throw TypeError when the key is missing.
 *
 * @remarks
 * 顯式檢查而非直接回傳 undefined，避免下游拿到靜默失敗的空值。
 * The explicit check avoids silently returning undefined to callers downstream.
 */
export declare function getYarnLockRawV1Root(input: IYarnLockRawSourceV1): import("@yarn-tool/yarnlock-types").IYarnLockDataRecord<import("@yarn-tool/yarnlock-types").IYarnLockDataRowV1, string>;
/**
 * 解析 v1 yarn.lock 並直接回傳 object 根節點。
 * Parse a v1 yarn.lock and return only the `object` root.
 *
 * @param source - lock 檔內容，接受 Buffer 或字串
 *                 - lockfile content, accepts Buffer or string
 * @param fileLoc - 出錯時用於錯誤訊息的檔案位置
 *                  - file location used in error messages
 */
export declare function parseYarnLockRawV1Root(source: string | Buffer, fileLoc?: string): import("@yarn-tool/yarnlock-types").IYarnLockDataRecord<import("@yarn-tool/yarnlock-types").IYarnLockDataRowV1, string>;
/**
 * 將 v1 資料寫回 yarn.lock 字串。
 * Write v1 data back into a yarn.lock string.
 *
 * @param json - 可傳入 { object } 包裹的解析結果或純 object 內容
 *               - accepts either a wrapped `{ object }` result or a plain object
 * @param noHeader - 是否省略 banner 標頭
 *                   - whether to omit the banner header
 * @remarks
 * 兼容兩種輸入形狀（包裹 / 未包裹），因為使用者手上常兩者混用。
 * Accepts both wrapped and unwrapped shapes because callers often hold either one.
 */
export declare function stringifyYarnLockRawV1(json: any, noHeader?: boolean): string;
