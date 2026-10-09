import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from "ts-type";
import { IExcludeReadonlyArray } from "./lines";
import { _readonlyArrayToMutable } from './util';
import { LF } from "crlf-normalize";
import { IIgnoreFileOptions } from "./IgnoreFile";
import { EnumConst } from "./types";

export function _normalize(line: string)
{
	return line.trim();
}

export function _normalizeLines(lines: string[]): string[]
{
	for (let i = 0; i < lines.length; i++)
	{
		lines[i] = _normalize(lines[i]);
	}
	return lines;
}

export function _normalizeValueOrArray<T extends ITSValueOrArrayMaybeReadonly<string>>(patterns: T,
	overwrite?: boolean,
): IExcludeReadonlyArray<T>
{
	if (typeof patterns === 'string')
	{
		return _normalize(patterns) as IExcludeReadonlyArray<T>;
	}
	else if (overwrite)
	{
		return _normalizeLines(_readonlyArrayToMutable(patterns)) as IExcludeReadonlyArray<T>;
	}

	return patterns.map(_normalize) as IExcludeReadonlyArray<T>;
}

/**
 * 移除行陣列開頭與結尾的空行，並回報兩側各移除了幾行
 * Strip the leading and trailing blank lines, reporting how many were removed on each side
 *
 * 會就地修改傳入的 `lines`（結尾的空行以 `pop()` 移除），
 * 開頭的空行則以 `slice(startCount)` 取出；回傳的兩個計數即為
 * `IgnoreFile` 還原檔案結尾換行所需的 `startCount` / `endCount`。
 * Mutates the given `lines` in place (trailing blanks are popped, leading ones
 * sliced off via `startCount`); the two counts it returns are exactly the
 * `startCount` / `endCount` that `IgnoreFile` uses to restore the newlines.
 */
export function _omitBlankLines(lines: string[])
{
	let startCount = 0;
	let endCount = 0;
	let len = lines.length;

	for (let i = len - 1; i >= 0; i--)
	{
		if (lines[i].trim() === '')
		{
			lines.pop()
			endCount++
		}
		else
		{
			break
		}
	}

	for (let i = 0; i < lines.length; i++)
	{
		if (lines[i].trim() === '')
		{
			startCount++
		}
		else
		{
			break
		}
	}

	return {
		lines: lines.slice(startCount),
		startCount,
		endCount,
	};
}

export function _stringifyEndOfLine(count?: IIgnoreFileOptions['endCount'])
{
	if (typeof count !== 'number')
	{
		count = count ? EnumConst.MAX_BLANK_LINES : 0;
	}

	return LF.repeat(Math.min(EnumConst.MAX_BLANK_LINES, Math.max(0, count)));
}
