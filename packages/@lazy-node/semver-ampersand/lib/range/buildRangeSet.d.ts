import { IOptions } from '../types';
/**
 * 依 `||` 與空白把範圍切成二維的條件字串集合
 * Split a range into a two-dimensional set of condition strings by `||` and spaces
 *
 * 先處理 ampersand（把 `&` 視為「且」），再切 `||`，
 * 可確保 `a & b || c` 這類混合寫法被切成正確的三段。
 * Ampersand handling (`&` = "AND") runs before splitting on `||`, so mixed
 * input such as `a & b || c` is cut into the right three pieces.
 *
 * @param range - 範圍字串 / Range string
 * @param options - 解析選項 / Parse options
 * @returns 二維的條件字串集合（外層為 `||` 分隔）/ Two-dimensional condition sets (outer level = `||` groups)
 */
export declare function buildRangeSet(range: string, options?: IOptions): string[][];
