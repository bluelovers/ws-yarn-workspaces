import { ITSArrayListMaybeReadonly } from 'ts-type';
import { lineType, EnumLineType } from './lines';
import { _normalize } from './normalize';

/**
 * 取得插入位置前方最近的一條規則，沒有則回傳 `undefined`
 *
 * 空行與註解不算規則，會被略過繼續向前找；
 * 因此「新增」只需比對這一個值，不必走訪整份行陣列去重。
 *
 * @param lines - 行陣列
 * @param index - 插入位置（不含），由此向前搜尋
 */

export function precedingPattern(lines: readonly string[], index: number): string | undefined
{
	for (let i = index - 1; i >= 0; i--)
	{
		const type = lineType(lines[i]!);

		if (type === EnumLineType.Pattern)
		{
			return lines[i]!.trim();
		}
	}

	return undefined;
}

export function precedingPattern2(lines: readonly string[],
	index: number,
	patterns: readonly string[],
	value: string,
): boolean
{
	for (let i = index - 1; i >= 0; i--)
	{
		const line = lines[i];
		const type = lineType(line);

		if (type === EnumLineType.Pattern)
		{
			if (line === value)
			{
				return true;
			}
			else if (!patterns.includes(line))
			{
				return false;
			}
		}
	}

	return undefined;
}

/**
 * 檢查是否已存在相同規則（忽略前後空白）
 *
 * @param lines - 行陣列
 * @param pattern - 規則
 */

export function hasPattern(lines: ITSArrayListMaybeReadonly<string>, pattern: string): boolean
{
	const value = _normalize(pattern);

	/**
	 * 直接走訪行陣列，避免先以 {@link listPatterns} 建立中間陣列
	 */
	return lines.some(v => lineType(v) === EnumLineType.Pattern && v.trim() === value);
}

