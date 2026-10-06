import { IComparatorSetInput, IOptionsOrLoose } from '../types';
/**
 * 檢查字串是否含無效字元
 * Check whether a string contains invalid characters
 *
 * 預設採用允許 `&` 的正則；要求 noAmpersand 時改用不允許 `&` 的正則，
 * 讓 ampersand 語法可被明確關閉。
 * By default the ampersand-tolerating regex is used; with noAmpersand the
 * ampersand-disallowing one is used instead, so the syntax can be switched off
 * explicitly.
 *
 * @param semver - 要檢查的字串 / String to check
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @returns 是否含無效字元 / Whether it contains invalid characters
 */
export declare function hasInvalidCharacter(semver: string, optionsOrLoose?: IOptionsOrLoose): boolean;
/**
 * 斷言字串不含無效字元
 * Assert that a string contains no invalid characters
 *
 * 與 hasInvalidCharacter 同樣依 noAmpersand 選擇正則；
 * 例外訊息會帶出無效字元本身與其位置，方便除錯。
 * Uses the same noAmpersand-driven regex selection as hasInvalidCharacter;
 * the thrown message includes the offending character and its index to ease
 * debugging.
 *
 * @param semver - 要檢查的字串 / String to check
 * @param optionsOrLoose - 選項或寬鬆旗標 / Options or loose flag
 * @throws {TypeError} 當字串含無效字元時 / When the string contains invalid characters
 */
export declare function assertInvalidCharacter(semver: string, optionsOrLoose?: IOptionsOrLoose): asserts semver is string;
/**
 * 斷言比較器集合不是空的
 * Assert that a comparator set is not empty
 *
 * 空集合代表整個範圍無法解析成任何條件，
 * 回傳的訊息可由呼叫端覆寫，以帶上原始範圍字串。
 * An empty set means the whole range failed to parse into any condition; the
 * message can be overridden by the caller so the original range string is
 * included.
 *
 * @param comparatorsSet - 比較器集合 / Comparator set
 * @param message - 自訂錯誤訊息 / Custom error message
 * @throws {TypeError} 當集合為空時 / When the set is empty
 */
export declare function assertInvalidComparatorSet(comparatorsSet: IComparatorSetInput, message?: string): asserts comparatorsSet is IComparatorSetInput;
