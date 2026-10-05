import pathDirNormalize from 'path-dir-normalize';

/**
 * checkPaths() 的回傳結果，代表兩種根目錄比對後的處置方式。
 * Result of `checkPaths()`, describing how to treat the two compared roots.
 */
export const enum EnumCheckPaths
{
	/** lerna 根目錄位於 yarn 根目錄之下，應採用 yarn 根目錄。The lerna root sits under the yarn root; adopt the yarn root. */
	root = 1,
	/** 兩根目錄一致（或其中一方為空），沿用 lerna 根目錄即可。Roots match (or one side is empty); keep the lerna root. */
	rootPath = 0,
	/** 根目錄衝突，無法安全建立專案。Roots conflict; the project cannot be safely constructed. */
	failed = -1
}

/**
 * 比對 Yarn Workspaces 根目錄與 Lerna 根目錄，決定要採用哪一個。
 * Compare the Yarn Workspaces root against the Lerna root and decide which one to adopt.
 *
 * @param input.root 由 find-yarn-workspace-root2 找到的 yarn 根目錄。The yarn root found by `find-yarn-workspace-root2`.
 * @param input.rootPath 由 @lerna/project 解析出的 lerna 根目錄。The lerna root resolved by `@lerna/project`.
 * @param options skipStrictCheck 為 true 時，只要 lerna 根目錄在 yarn 根目錄之下就視為可接受。When `skipStrictCheck` is true, a lerna root nested under the yarn root is accepted.
 * @returns EnumCheckPaths 判定結果。The `EnumCheckPaths` verdict.
 */
export function checkPaths(input: {
	root,
	rootPath,
}, options?: {
	skipStrictCheck?: boolean
}): EnumCheckPaths
{
	let { root, rootPath } = input

	// 兩個根目錄都存在時才做嚴格比對；任一方為空則無法判斷，只能沿用已知的那一方。
	// Strict comparison only applies when both roots exist; if either side is empty there is nothing to compare, so keep whichever is known.
	if (root?.length && rootPath?.length)
	{
		// 先正規化目錄字串，避免尾端斜線或重複分隔符導致誤判為不同路徑。
		// Normalize the directory strings first so trailing slashes or duplicate separators are not misread as different paths.
		root = pathDirNormalize(root)
		rootPath = pathDirNormalize(rootPath)

		if (root !== rootPath)
		{
			// lerna 根目錄是 yarn 根目錄的子路徑，代表 lerna 指向子資料夾，應改用外層 yarn 根目錄。
			// The lerna root is a subpath of the yarn root, meaning lerna points at a subfolder; adopt the outer yarn root instead.
			if (rootPath.indexOf(root) === 0)
			{
				return EnumCheckPaths.root
			}
			// 兩根目錄互不相干時視為致命衝突；僅在允許寬鬆檢查時放行。
			// Unrelated roots are treated as a fatal conflict; only tolerated when loose checking is allowed.
			else if (!options?.skipStrictCheck)
			{
				return EnumCheckPaths.failed
			}
		}

		return EnumCheckPaths.rootPath
	}
	else if (rootPath?.length)
	{
		return EnumCheckPaths.rootPath
	}

	// 兩邊都沒有根目錄，只能判定失敗。
	// Neither root exists, so the only verdict is failure.
	return EnumCheckPaths.failed
}
