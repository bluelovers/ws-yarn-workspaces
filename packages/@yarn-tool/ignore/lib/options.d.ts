import { IHandleOptionsEndCountOptions, IIgnoreFileOptions } from './types';
/**
 * 判斷 `count` 是否為「可用的數字計數」
 * Decide whether `count` is a usable numeric count
 *
 * @param count - 要判斷的值 / The value to check
 * @param clamp - 內部參數：`true` 時只檢查「是數字且非 `NaN`」、不檢查範圍，
 *   超出範圍的部分交給呼叫端收合（`_normalizeEndCount` 結尾的 `Math.min/Math.max`）；
 *   省略時維持原本的 `0 ~ MAX_BLANK_LINES` 範圍檢查
 * Internal parameter: when `true` only checks "is a number and not `NaN`" and
 *   skips the range check, leaving the out-of-range part for the caller to
 *   converge (the final `Math.min/Math.max` in `_normalizeEndCount`); when
 *   omitted the original `0 ~ MAX_BLANK_LINES` range check is kept
 *
 * @returns `true` 代表「是可用的數字」；帶 `clamp` 時不保證落在範圍內
 * `true` means "a usable number"; with `clamp` it does not guarantee the range
 */
export declare function _isEndCount(count?: IIgnoreFileOptions['endCount'], clamp?: boolean): count is number;
/**
 * 把計數整理成 `0 ~ MAX_BLANK_LINES` 內的值
 * Normalize a count into the `0 ~ MAX_BLANK_LINES` range
 *
 * @param count - 要整理的計數 / The count to normalize
 * @param defaultCount - `count` 不可用時採用的預設值 / Default used when `count` is unusable
 * @param clamp - 內部參數：`true` 時「是數字但超出範圍」的輸入不採用 `defaultCount`，
 *   改由結尾的 `Math.min/Math.max` 收斂到範圍內；`undefined` / `false` / `NaN`
 *   不是可用的數字，無論是否收斂都仍走 `defaultCount`
 * Internal parameter: when `true` an input that *is a number but out of range*
 *   does not take `defaultCount` and is instead converged into the range by the
 *   final `Math.min/Math.max`; `undefined` / `false` / `NaN` are not usable
 *   numbers and always take `defaultCount`
 */
export declare function _normalizeEndCount(count?: IIgnoreFileOptions['endCount'], defaultCount?: IIgnoreFileOptions['endCount'], clamp?: boolean): number;
export declare function _handleOptionsEndCountCore(options?: IIgnoreFileOptions, optionsEndCount?: Partial<IHandleOptionsEndCountOptions>): {
    startCount: number;
    endCount: number;
};
export declare function _handleOptionsEndCount(options?: IIgnoreFileOptions, optionsEndCount?: Pick<IHandleOptionsEndCountOptions, 'lines'>): {
    lines: string[];
    startCount: number;
    endCount: number;
};
