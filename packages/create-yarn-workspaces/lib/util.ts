import { relative } from "path";
import { pathIsSame } from 'path-is-same';

/**
 * 判斷兩個路徑是否為同一位置
 *
 * @param p1 第一個路徑。
 * @param p2 第二個路徑。
 * @returns 兩路徑相同時為 true；任一為空則直接 false。
 */
export function isSamePath(p1: string, p2: string)
{
	/**
	 * 任一輸入為空時無法比較，直接回傳 false 以免 relative() 產生誤判。
	 */
	if (!p1 || !p2)
	{
		return false;
	}
	else if (pathIsSame(p1, p2))
	{
		return true;
	}

	/**
	 * 字面不相同時再以 relative 判斷，涵蓋結尾斜線或 '.' 等等價寫法。
	 */
	let s = relative(p1, p2);
	return (s === '.' || s === '');
}
