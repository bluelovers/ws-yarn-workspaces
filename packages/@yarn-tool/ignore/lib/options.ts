
import { EnumConst, IHandleOptionsEndCountOptions, IIgnoreFileOptions } from './types';
import { _omitBlankLines } from './line-filter';

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
export function _isEndCount(count?: IIgnoreFileOptions['endCount'], clamp?: boolean): count is number
{
	if (typeof count !== 'number' || Number.isNaN(count))
	{
		return false;
	}

	return clamp || (count >= 0 && count <= EnumConst.MAX_BLANK_LINES)
}

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
export function _normalizeEndCount(count?: IIgnoreFileOptions['endCount'],
	defaultCount?: IIgnoreFileOptions['endCount'],
	clamp?: boolean,
): number
{
	/**
	 * 收斂模式下「是數字但超出範圍」的輸入會通過 `_isEndCount(count, clamp)`，
	 * 整段預設值替換因此被跳過，原值留給結尾的 `Math.min/Math.max` 夾進範圍
	 * （7 → 3、-1 → 0），也就不用再多一段提前回傳；
	 * `undefined` / `false` / `NaN` 不會通過，照原樣回歸 `defaultCount`
	 * In clamp mode an out-of-range number passes `_isEndCount(count, clamp)`, so
	 * the whole default substitution is skipped and the final `Math.min/Math.max`
	 * moves the original value into the range (7 → 3, -1 → 0) — no extra early
	 * return needed; `undefined` / `false` / `NaN` do not pass and fall back to
	 * `defaultCount` exactly as before
	 */
	if (!_isEndCount(count, clamp))
	{
		if (!_isEndCount(defaultCount))
		{
			defaultCount = void 0;
		}

		count = count !== false ? (defaultCount ?? EnumConst.MAX_BLANK_LINES) : 0
	}

	return Math.min(EnumConst.MAX_BLANK_LINES, Math.max(0, count as number))
}

export function _handleOptionsEndCountCore(options?: IIgnoreFileOptions,
	optionsEndCount?: Partial<IHandleOptionsEndCountOptions>,
)
{
	options ??= {};

	if (!_isEndCount(options?.endCount) || !_isEndCount(options?.startCount))
	{
		optionsEndCount ??= {} as any;

		/**
		 * 兩側刻意不同：`startCount` 收斂（超出範圍的數字夾進範圍），
		 * `endCount` 維持回歸預設值（`_normalizeEndCount` 內建的上限）
		 * The two sides differ on purpose: `startCount` converges (an out-of-range
		 * number is clamped into range) while `endCount` keeps falling back to the
		 * default built into `_normalizeEndCount` (the upper bound)
		 */
		options.startCount = _normalizeEndCount(options.startCount, optionsEndCount.startCount ?? EnumConst.DEFAULT_START_COUNT, true)
		options.endCount = _normalizeEndCount(options.endCount, optionsEndCount.endCount!)
	}

	return {
		startCount: options.startCount,
		endCount: options!.endCount,
	} satisfies Partial<IHandleOptionsEndCountOptions>;
}

export function _handleOptionsEndCount(options?: IIgnoreFileOptions,
	optionsEndCount?: Pick<IHandleOptionsEndCountOptions, 'lines'>,
)
{
	const opts = _omitBlankLines(optionsEndCount?.lines ?? [])

	return {
		..._handleOptionsEndCountCore(options, opts),
		lines: opts.lines,
	} satisfies IHandleOptionsEndCountOptions;
}
