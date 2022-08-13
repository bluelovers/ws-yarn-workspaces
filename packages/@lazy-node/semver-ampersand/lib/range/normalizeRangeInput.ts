import { IOptions } from '../types';
import { caretTrimReplace, comparatorTrimReplace, re, t, tildeTrimReplace } from 'semver/internal/re';
import { hyphenReplace } from './util';
import debug from 'semver/internal/debug';
import { reSpaces } from '../const';

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
	range = range.replace(reSpaces, ' ')

	return range
}
