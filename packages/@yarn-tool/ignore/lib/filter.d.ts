import { ITSArrayListMaybeReadonly } from 'ts-type';
/**
 * 取得插入位置前方最近的一條規則，沒有則回傳 `undefined`
 *
 * 空行與註解不算規則，會被略過繼續向前找；
 * 因此「新增」只需比對這一個值，不必走訪整份行陣列去重。
 *
 * @param lines - 行陣列
 * @param index - 插入位置（不含），由此向前搜尋
 */
export declare function precedingPattern(lines: readonly string[], index: number): string | undefined;
export declare function precedingPattern2(lines: readonly string[], index: number, patterns: readonly string[], value: string): boolean;
/**
 * 檢查是否已存在相同規則（忽略前後空白）
 *
 * @param lines - 行陣列
 * @param pattern - 規則
 */
export declare function hasPattern(lines: ITSArrayListMaybeReadonly<string>, pattern: string): boolean;
