/**
 * 把差異節點的欄位值轉成可印出的字串。
 * Turn a diff node's value into a printable string.
 *
 * deep-diff 的 `lhs` / `rhs` 型別是 `unknown`（可能是字串、版本陣列或整個物件），
 * 直接模板化會得到 `[object Object]`，因此必須先分支正規化。
 * The `lhs` / `rhs` of deep-diff are `unknown` (string, version array, or a whole object), and
 * stringifying them naively would yield `[object Object]`, so each shape is normalized first.
 *
 * @param rhsOrLhs 差異節點的左值或右值 / The left-hand or right-hand value of a diff node
 * @returns 可直接放進表格的字串 / A string safe to place inside the table
 */
export function _formatVersion(rhsOrLhs: unknown): string
{
	switch (typeof rhsOrLhs)
	{
		case "string":
			return rhsOrLhs;
		case "object":
			/**
			 * 陣列用 `join` 而非 `JSON.stringify`：版本清單逐項顯示比
			 * `["a","b"]` 的引號與括號更易讀，也與表格其他欄位一致。
			 * Arrays use `join` rather than `JSON.stringify`: a plain list reads better than the
			 * quotes and brackets of `["a","b"]` and matches the other table columns.
			 */
			return Array.isArray(rhsOrLhs)
				? rhsOrLhs.join(", ")
				: JSON.stringify(rhsOrLhs);
		default:
			/**
			 * `null` 的 `typeof` 是 `"object"`，已由上一支配；
			 * 這裡只剩 number / boolean / undefined / symbol，統一字串化。
			 * `null` has `typeof === "object"` and is already handled above; only
			 * number / boolean / undefined / symbol remain, all of which stringify directly.
			 */
			return `${rhsOrLhs}`;
	}
}
