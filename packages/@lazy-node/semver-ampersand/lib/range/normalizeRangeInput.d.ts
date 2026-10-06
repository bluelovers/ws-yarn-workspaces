import { IOptions } from '../types';
/**
 * 把範圍字串正規化成後續可直接切割的形態
 * Normalize a range string into a directly splittable form
 *
 * 這一層只處理「寫法」差異（hyphen、多餘空白、運算子後的空格），
 * 不改變語意；先完成這些正規化，後續 parseComparator 才能假設輸入一致。
 * This pass only fixes *spelling* differences (hyphen ranges, stray spaces,
 * spaces after operators) without changing semantics; once it is done,
 * parseComparator may assume a consistent input shape.
 *
 * @param range - 原始範圍字串 / Raw range string
 * @param options - 解析選項（loose 決定正則、includePrerelease 影響 hyphen 上界）/ Parse options (loose picks the regex; includePrerelease affects the hyphen upper bound)
 * @returns 正規化後的範圍字串 / Normalized range string
 */
export declare function normalizeRangeInput(range: string, options: IOptions): string;
