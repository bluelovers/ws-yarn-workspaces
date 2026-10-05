import { IOptions } from '../types';
import { caretTrimReplace, comparatorTrimReplace, re, t, tildeTrimReplace } from 'semver/internal/re';
import { hyphenReplace } from './util';
import debug from 'semver/internal/debug';
import { reSpaces } from '../const';

/**
 * 把範圍字串正規化成後續可直接切割的形態
 * Normalize a range string into a directly splittable form
 *
 * 這一層只處理「寫法」差異（hyphen、多餘空白、運算子後的空格），
 * 不改變語意；先完成這些正規化，後續 parseComparator 才能假設輸入一致。
 * This pass only fixes *spelling* differences (hyphen ranges, stray spaces,
 * spaces after operators) without changing semantics; once it is done,
 * parseComparator may assume a consistent input shape.
 *
 * @param range - 原始範圍字串 / Raw range string
 * @param options - 解析選項（loose 決定正則、includePrerelease 影響 hyphen 上界）/ Parse options (loose picks the regex; includePrerelease affects the hyphen upper bound)
 * @returns 正規化後的範圍字串 / Normalized range string
 */
export function normalizeRangeInput(range: string, options: IOptions)
{
	// `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
	const hr = options.loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
	range = range.replace(hr, hyphenReplace(options.includePrerelease))
	debug('hyphen replace', range)
	// `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
	range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
	debug('comparator trim', range, re[t.COMPARATORTRIM])

	// `~ 1.2.3` => `~1.2.3`
	range = range.replace(re[t.TILDETRIM], tildeTrimReplace)

	// `^ 1.2.3` => `^1.2.3`
	range = range.replace(re[t.CARETTRIM], caretTrimReplace)

	// normalize spaces
	// 最後統一收斂所有空白型別，讓 splitSpace 的切割結果可預期
	// Collapse every whitespace flavour last so splitSpace cuts predictably
	range = range.replace(reSpaces, ' ')

	return range
}
