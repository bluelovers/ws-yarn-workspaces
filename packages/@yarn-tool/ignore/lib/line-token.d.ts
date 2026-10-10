import { ITSArrayListMaybeReadonly } from 'ts-type';
import { EnumLineType, ILineToken } from './types';
/**
 * 單一行的解析 (tokenize)：判定行類型並轉為 {@link ILineToken}
 *
 * 這裡是「行類型」判定的單一事實來源：一律先去頭尾空白再分類，
 * 規則行與註解行的比對也只看同一份內容，避免各處自行 trim 後判定不一致。
 */
/**
 * 分析單一行的類型
 *
 * 以去頭尾空白後的內容判定：空字串為 Blank、`#` 開頭為 Comment，其餘為 Pattern；
 * 前導空白不影響分類，例如 `  # note` 仍是 Comment。
 *
 * @param line - 不含行尾符號的一行
 * @returns 行的類型，見 {@link EnumLineType}
 */
export declare function lineType(line: string): EnumLineType;
/**
 * 將單一行轉為 {@link ILineToken}
 *
 * `line` 只在這裡去頭尾空白一次，呼叫端（如 {@link hasPattern} / {@link precedingPattern}）
 * 直接比對 `token.line` 即可，不必各自再 trim()。
 *
 * @param line - 不含行尾符號的一行
 */
export declare function lineToToken(line: string): ILineToken;
/**
 * 以下分兩層判斷：`_lineTypeIs*` 只看已判定的 {@link EnumLineType}，
 * 供已經持有型別的呼叫端重用；`lineIs*` 則先以 {@link lineType} 判定再回傳布林，
 * 供只需要真/假的呼叫端使用
 */
export declare function _lineTypeIsBlank(type: EnumLineType): boolean;
export declare function _lineTypeIsComment(type: EnumLineType): boolean;
export declare function _lineTypeIsPattern(type: EnumLineType): boolean;
export declare function lineIsBlank(line: string): boolean;
export declare function lineIsComment(line: string): boolean;
export declare function lineIsPattern(line: string): boolean;
/**
 * 逐行產生 {@link ILineToken} 的惰性 (lazy) 迭代器
 *
 * 惰性走訪、不建立中間陣列；只需找到第一筆符合的呼叫端（如 {@link hasPattern}）
 * 命中後即可中斷，不必先過濾出整個子陣列。
 *
 * @param lines - 行陣列
 */
export declare function linesToTokenListGenerator(lines: ITSArrayListMaybeReadonly<string> | Iterable<string>): Generator<ILineToken, void, unknown>;
