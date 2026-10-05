import { DiffArray, EnumKinds } from '@bluelovers/deep-diff';
import { _formatVersion } from './formatVersion';
import { IChalk } from 'debug-color2'

/**
 * 把陣列型差異（Array Diff）轉成 `[舊, 新]` 兩欄文字，並依差異種類上色。
 * Turn an array diff into two columns of `[old, new]` text, colorized by diff kind.
 *
 * 顏色由呼叫端注入而非在此硬編碼，讓同一份邏輯可以同時服務
 * 「需要色彩」與「需要純文字（`stripAnsi`）」兩種輸出。
 * Color is injected by the caller instead of being hardcoded here, so the same logic serves
 * both colored output and plain text (via `stripAnsi`).
 *
 * @param array deep-diff 的陣列差異節點 / The array diff node from deep-diff
 * @param chalk 用於上色的 chalk 實作 / The chalk instance used for colorization
 * @returns `[舊內容, 新內容]` 字串對 / A pair of `[old, new]` strings
 */
export function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk)
{
	const item = array.item;
	/**
	 * `default` 回傳佔位符而非拋錯：未知的差異種類不該讓整份表格印不出來，
	 * 用 `[...]` 標示「此處有變動但無法顯示」是較安全的降級。
	 * The `default` returns a placeholder instead of throwing: an unknown diff kind must not
	 * prevent the whole table from rendering, so `[...]` degrades to "something changed here
	 * but cannot be displayed".
	 */
	switch (item.kind)
	{
		case EnumKinds.DiffNew:
			return [`[...]`, `[..., ${chalk.green(_formatVersion(item.rhs))}]`];
		case EnumKinds.DiffDeleted:
			return [`[..., ${chalk.red(_formatVersion(item.lhs))}]`, `[...]`];
		case EnumKinds.DiffEdit:
			return [
				`[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
				`[..., ${chalk.yellow(_formatVersion(item.rhs))}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
