import { relative } from "path";
import { pathIsSame } from 'path-is-same';

/**
 * 判斷兩個路徑是否為同一位置（已標記 @deprecated，請改用 path-is-same）。
 * Check whether two paths point to the same location (marked `@deprecated`; use `path-is-same` instead).
 *
 * @param p1 第一個路徑。The first path.
 * @param p2 第二個路徑。The second path.
 * @returns 兩路徑相同時為 true；任一為空則直接 false。`true` when they match; `false` when either input is empty.
 */
export function isSamePath(p1: string, p2: string)
{
	// 任一輸入為空時無法比較，直接回傳 false 以免 relative() 產生誤判。
	// Bail out with `false` when either input is empty so `relative()` cannot produce a misleading result.
	if (!p1 || !p2)
	{
		return false;
	}
	else if (pathIsSame(p1, p2))
	{
		return true;
	}

	// 字面不相同時再以 relative 判斷，涵蓋結尾斜線或 '.' 等等價寫法。
	// When the literals differ, fall back to `relative()` to cover equivalent spellings such as trailing slashes or `.`.
	let s = relative(p1, p2);
	return (s === '.' || s === '');
}
