import { IOptions } from './types';
/**
 * 把範圍字串中的 ampersand 與空白統一成單一空白
 * Normalize ampersands and whitespace in a range string to a single space
 *
 * 未傳 noAmpersand 時使用 `[&\s]+`，可同時把 `a&&b`、`a & b` 這類寫法
 * 收斂成 `a b`；一旦要求 noAmpersand，則只整理空白並保留 `&`，
 * 讓後續的無效字元檢查能抓到它。
 * Without `noAmpersand` the pattern `[&\s]+` collapses spellings such as
 * `a&&b` and `a & b` into `a b` at once; when `noAmpersand` is requested only
 * whitespace is normalized and `&` is kept, so the later invalid-character
 * check can catch it.
 *
 * @param versionRange - 範圍字串或其他型別 / Range string or any other type
 * @param options - 解析選項 / Parse options
 * @returns 正規化後的範圍，非字串則原樣回傳 / Normalized range; non-strings are returned as-is
 */
export declare function handleAmpersandAndSpaces<T>(versionRange: T, options?: IOptions): T;
export default handleAmpersandAndSpaces;
