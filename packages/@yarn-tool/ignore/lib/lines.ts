/**
 * ignore 檔案的行模型（單一事實來源）
 * Line model for ignore files (single source of truth)
 *
 * ignore 檔案一律以「行陣列」表示，註解與空行皆為其中的一行，
 * 讀取、編輯、保存都只對行陣列操作，藉此保證註解與空行不會遺失。
 * An ignore file is always represented as an array of lines, where comments
 * and blank lines are ordinary entries; reading, editing and saving only
 * operate on that array, which guarantees comments and blank lines survive.
 */
import { R_CRLF, LF } from 'crlf-normalize';
import { ITSArrayListMaybeReadonly, ITSValueOrArrayMaybeReadonly } from 'ts-type';
import { _normalizeValueOrArray, _omitBlankLines } from './normalize';
import { _handleValueOrArrayCore, _handleValueOrArrayToMutable } from './util';
import { array_unique, array_unique_overwrite, equals } from 'array-hyper-unique';
import { precedingPattern2 } from './filter';
import { EnumConst } from './types';

/** 單一行的類型 */
export enum EnumLineType
{
	Comment = 'comment',
	Blank = 'blank',
	Pattern = 'pattern',
}

/**
 * 輸出前整理的選項
 * Options for finalizing before output
 */
export interface IFinalizeIgnoreLinesOptions
{
	/**
	 * 是否移除重複的規則，只保留最後一筆；註解不受影響，預設 true
	 * Whether to remove duplicate rules, keeping only the last one; comments are
	 * unaffected. Defaults to true
	 */
	dedupePatterns?: boolean,
	/**
	 * 是否將超過上限的連續空行縮減到上限，預設 true
	 * Whether to shrink runs of blank lines beyond the upper bound, defaults to true
	 */
	collapseBlankLines?: boolean,
}

export type IExcludeReadonlyArray<T extends ITSValueOrArrayMaybeReadonly<any>> = Extract<T, string | any[]>

/**
 * 分析單一行的類型
 *
 * @param line - 不含行尾符號的一行
 * @returns 行的類型，見 {@link EnumLineType}
 */
export function lineType(line: string): EnumLineType
{
	if (line.trim() === '')
	{
		return EnumLineType.Blank
	}

	if (line.trimStart().startsWith('#'))
	{
		return EnumLineType.Comment
	}

	return EnumLineType.Pattern
}

/**
 * 處理內容為行陣列
 *
 * @param content - 檔案內容
 */
export function processToLines(content: ITSValueOrArrayMaybeReadonly<string>): string[]
{
	content = _handleValueOrArrayCore(content);

	return content.flatMap(value => _normalizeValueOrArray(typeof value === 'string' && value.length
		? value.split(R_CRLF)
		: value));
}

export function processToLinesDedupe(content: ITSValueOrArrayMaybeReadonly<string>): string[]
{
	return array_unique_overwrite(processToLines(content), {
		removeFromFirst: true,
	});
}

/**
 * 將行陣列還原為內容（LF 行尾）
 *
 * @param lines - 行陣列
 */
export function serializeLines(lines: ITSArrayListMaybeReadonly<string>): string
{
	return lines.join(LF)
}

/**
 * 取得所有規則行（過濾註解與空行）
 *
 * @param lines - 行陣列
 */
export function listPatternsOnly(lines: ITSArrayListMaybeReadonly<string>): string[]
{
	return lines.filter(v => lineType(v) === EnumLineType.Pattern)
}

/**
 * 新增多條規則並回傳新陣列
 * Add multiple rules and return a new array
 *
 * 只與「插入位置前方最近的一條規則」比對，相同即略過；
 * 不走訪整份行陣列去重——遠處的重複由 {@link finalizeIgnoreLines} 在輸出前處理。
 *
 * 註解與空行維持原位不動，新規則一律插在規則區塊的尾端；
 * 若內容以換行結尾（行陣列最後一項為空字串），則插在它之前，
 * 讓「檔案結尾換行」維持在最後一項。
 *
 * @param lines - 行陣列
 * @param patterns - 一條或多條規則
 */
export function addPatterns(inputLines: ITSArrayListMaybeReadonly<string>,
	patterns: ITSValueOrArrayMaybeReadonly<string>,
): string[]
{
	const lines = _handleValueOrArrayToMutable(inputLines);
	patterns = processToLinesDedupe(patterns);

	for (const pattern of patterns)
	{
		const value = pattern;

		if (value === '' || precedingPattern2(lines, lines.length, patterns, value))
		{
			continue
		}

		lines.push(value)
	}

	console.dir({
		fn: 'addPatterns',
		patterns,
		lines,
	}, { depth: null })

	return lines
}

/**
 * 移除多條規則並回傳新陣列；註解與空行一律保留
 * Remove multiple rules and return a new array; comments and blank lines are always kept
 *
 * @param inputLines - 行陣列
 * @param patterns - 一條或多條規則
 */
export function removePatterns(inputLines: ITSArrayListMaybeReadonly<string>,
	patterns: ITSValueOrArrayMaybeReadonly<string>,
): string[]
{
	const lines = _handleValueOrArrayToMutable(inputLines);
	patterns = processToLinesDedupe(patterns);

	for (let i = lines.length - 1; i >= 0; i--)
	{
		const line = lines[i]
		if (patterns.includes(line))
		{
			lines.splice(i, 1)
		}
	}

	return lines
}

/**
 * 移除重複的規則，只保留最後一筆；註解與空行不受影響
 * Remove duplicate rules, keeping only the last occurrence; comments and blank lines are unaffected
 *
 * 以 `findLastIndex` 找出每條規則最後出現的位置，
 * 只有該位置的那一筆會被保留，其餘同名規則列一律捨棄。
 * `findLastIndex` locates the last occurrence of each rule; only the entry at
 * that position survives and every other line with the same rule is dropped.
 *
 * @param lines - 行陣列
 */
export function dedupeIgnorePatterns(lines: ITSArrayListMaybeReadonly<string>)
{
	return array_unique(lines, {
		removeFromFirst: true,
		allowDuplicate(v)
		{
			return lineType(v) !== EnumLineType.Pattern
		},
	}) as string[];
}

/**
 * 將超過上限的連續空行縮減到上限
 * Shrink runs of blank lines beyond the upper bound down to the bound
 *
 * 末項若是空字串，代表「檔案結尾換行」而非空行，
 * 會先取出再收合，避免把結尾換行誤刪。
 * A trailing empty entry means the end-of-file newline rather than a blank line,
 * so it is taken out first and re-appended to avoid being removed.
 *
 * @param lines - 行陣列
 */
export function collapseIgnoreBlankLines(lines: ITSArrayListMaybeReadonly<string>): string[]
{
	const next: string[] = []
	let run = 0

	for (const line of lines)
	{
		if (lineType(line) === EnumLineType.Blank)
		{
			run++

			if (run > EnumConst.MAX_BLANK_LINES)
			{
				continue
			}
		}
		else if (run > 0)
		{
			run = 0
		}

		next.push(line)
	}

	return next
}

export function collapseIgnoreBlankLinesFromString(content: string): string
{
	return content.replace(/\n{4,}/g, '\n\n\n')
}

/**
 * 輸出前整理：移除重複規則（只保留最後一筆）並收合超過上限的空行
 * Finalize before output: drop duplicate rules (keep the last one) and collapse blank lines beyond the bound
 *
 * 註解不參與去重，位置與數量都不會被更動。
 * Comments take no part in deduplication, so their position and count never change.
 *
 * @param lines - 行陣列
 * @param options - 整理選項，兩項皆預設啟用 / Finalization options, both enabled by default
 */
export function finalizeIgnoreLines(lines: ITSArrayListMaybeReadonly<string>,
	options?: IFinalizeIgnoreLinesOptions,
): string[]
{
	const { dedupePatterns = true, collapseBlankLines = true } = options ?? {}

	let next = [...lines]

	if (dedupePatterns)
	{
		next = dedupeIgnorePatterns(next)
	}

	if (collapseBlankLines)
	{
		next = collapseIgnoreBlankLines(next)
	}

	return _omitBlankLines(next).lines
}
