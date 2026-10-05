import stripAnsi from 'strip-ansi';

/**
 * 移除對照表每個欄位中的 ANSI 色碼（ANSI Escape Code）。
 * Strip ANSI escape codes from every field of a map of rows.
 *
 * @param input 以列為單位的字串對照表 / A map whose values are rows of strings
 * @param overwrite 是否就地改寫原陣列；預設回傳新陣列
 *                  Whether to mutate the original arrays in place; a new array is returned by
 *                  default
 * @returns 已去除色碼的對照表 / The map with escape codes removed
 */
export function stripAnsiValues<T extends string[]>(input: Record<any, T>, overwrite?: boolean)
{
	return Object.values(input)
		.map(arr => {
			/**
			 * `overwrite` 走 `forEach` 就地覆寫：表格可能持有對同一個陣列的參照，
			 * 不就地改寫會留下仍帶色碼的舊版本。
			 * With `overwrite` a `forEach` mutates in place: the table may still reference the
			 * original array, and a non-mutating copy would leave a colored version behind.
			 */
			if (overwrite)
			{
				arr.forEach((value, i) => {
					arr[i] = stripAnsi(value);
				})
			}
			else
			{
				/**
				 * 以 `as T` 斷言：`map` 回傳的是 `string[]`，
				 * 但元素數量與位置未變，原陣列型別仍然成立。
				 * Asserted with `as T`: `map` widens to `string[]`, but neither the length nor
				 * the positions change, so the original tuple type still holds.
				 */
				arr = arr.map(stripAnsi) as T;
			}
			return arr
		})
	;
}
