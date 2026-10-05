import { DiffArray, EnumKinds } from '@bluelovers/deep-diff';
import { _formatVersion } from './formatVersion';

/**
 * 舊版：把陣列型差異（Array Diff）轉成 `[舊, 新]` 兩欄文字。
 * Legacy: turn an array diff into two columns of text `[old, new]`.
 *
 * 已被 `./diffArray002` 取代——本版本不上色，且 `DiffEdit` 分支的左欄少了一個 `]`。
 * 保留僅供舊版表格 `buildDiffTable001` 使用，請勿在新程式碼引用。
 * Superseded by `./diffArray002` — this version applies no color and the `DiffEdit` branch is
 * missing a `]` in its first column. Kept only for the legacy `buildDiffTable001` table; do not
 * use it in new code.
 *
 * @deprecated 請改用 `./diffArray002` 的 `_diffArray` / Use `_diffArray` from `./diffArray002` instead
 * @param array deep-diff 的陣列差異節點 / The array diff node from deep-diff
 * @returns `[舊內容, 新內容]` 字串對 / A pair of `[old, new]` strings
 */
export function _diffArray(array: DiffArray<{}, {}>): [string, string]
{
	const item = array.item;
	/**
	 * 陣列差異只會回傳單一 `item`（新增、刪除或取代其中一項），
	 * 因此這裡只能顯示「省略前綴 + 變動項目」，無法逐項列出整份差異。
	 * An array diff exposes a single `item` (an addition, removal, or replacement), so only the
	 * ellipsis prefix plus the changed entry can be shown — the whole diff cannot be listed.
	 */
	switch (item.kind)
	{
		case EnumKinds.DiffNew:
			return [`[...]`, `[..., ${_formatVersion(item.rhs)}]`];
		case EnumKinds.DiffDeleted:
			return [`[..., ${_formatVersion(item.lhs)}]`, `[...]`];
		case EnumKinds.DiffEdit:
			return [
				`[...], ${_formatVersion(item.lhs)}]`,
				`[..., ${_formatVersion(item.lhs)}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
