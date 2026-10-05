/**
 * 範圍解析內部工具（移植自 semver/internal）
 * Internal range parsing utilities (ported from semver/internal)
 *
 * 這裡是把 semver 的範圍語法（hyphen、tilde、caret、xrange、star）
 * 展開成純比較器字串的核心；保留英文原註解以利與上游對照，
 * 並以中文補充分支取捨的理由。
 * These functions expand semver range syntax (hyphen, tilde, caret, xrange,
 * star) into plain comparator strings. Upstream English comments are kept for
 * easier diffing against the original; Chinese notes explain the rationale of
 * each branch.
 *
 * @packageDocumentation
 */
import { re, t } from 'semver/internal/re';
import { IOptions } from '../types';
import { EnumSemverVersion } from '../const';

/**
 * 這是傳給 string.replace(re[t.HYPHENRANGE]) 的回呼函式
 * This function is passed to string.replace(re[t.HYPHENRANGE])
 * M, m, patch, prerelease, build
 * 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
 * 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
 * 1.2 - 3.4 => >=1.2.0 <3.5.0-0
 *
 * 上界與下界分開推導：hyphen 範圍的兩端可各自是萬用字元，
 * 必須先各自補成完整邊界，才能轉成等價的比較器組合。
 * The lower and upper bounds are derived separately: either side of a hyphen
 * range may be a wildcard, so each side must first be completed into an exact
 * boundary before it can become an equivalent comparator pair.
 *
 * @param incPr - 是否將預發布版本納入比較 / Whether to include pre-release versions in the comparison
 * @returns replace 用的回呼 / A callback for use with `replace`
 */
export function hyphenReplace(incPr: boolean)
{
	return ($0: string,
		from: string, fM: string, fm: string, fp: string, fpr: string, fb: string,
		to: string, tM: string, tm: string, tp: string, tpr: string, tb: string,
	) =>
	{
		/**
		 * 下界（from）：由粗到細檢查萬用字元，
		 * 越粗的段落（major → minor → patch）需要越寬的下界。
		 * Lower bound (from): wildcards are checked coarse → fine; the coarser
		 * the wildcard (major → minor → patch), the wider the lower bound must be.
		 */
		if (isX(fM))
		{
			from = ''
		}
		else if (isX(fm))
		{
			from = `>=${fM}.0.0${incPr ? '-0' : ''}`
		}
		else if (isX(fp))
		{
			from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
		}
		else if (fpr)
		{
			from = `>=${from}`
		}
		else
		{
			from = `>=${from}${incPr ? '-0' : ''}`
		}

		/**
		 * 上界（to）：與下界相反，這裡一律補成「下一個版本之前」，
		 * 萬用段落要進位（如 3.4 → <3.5.0-0），已知段落則直接含入（<=）。
		 * Upper bound (to): mirrored against the lower bound — wildcards are
		 * rounded up (e.g. 3.4 → <3.5.0-0) while exact segments are included
		 * (<=).
		 */
		if (isX(tM))
		{
			to = ''
		}
		else if (isX(tm))
		{
			to = `<${+tM + 1}.0.0-0`
		}
		else if (isX(tp))
		{
			to = `<${tM}.${+tm + 1}.0-0`
		}
		else if (tpr)
		{
			to = `<=${tM}.${tm}.${tp}-${tpr}`
		}
		else if (incPr)
		{
			to = `<${tM}.${tm}.${+tp + 1}-0`
		}
		else
		{
			to = `<=${to}`
		}

		return (`${from} ${to}`).trim()
	};
}

/**
 * 判斷版本段落是否為萬用字元
 * Check whether a version segment is a wildcard
 *
 * 空字串也算萬用，因為正則在缺少該段時捕獲的是 ''，
 * 與 'x' / '*' 表達的是同一件事（任意值）。
 * An empty string also counts as a wildcard: the regex captures '' when the
 * segment is absent, and that means the same as 'x' / '*' (any value).
 *
 * @param id - 版本段落 / Version segment
 * @returns 是否為萬用字元 / Whether it is a wildcard
 */
export function isX(id: string): id is '' | '0' | '*' | 'x'
{
	return !id || id.toLowerCase() === 'x' || id === '*';
}

/**
 * 移除 >=0.0.0 這類無意義的下界
 * Strip meaningless lower bounds such as >=0.0.0
 *
 * includePrerelease 時會改用允許預發布的樣式，
 * 否則刪錯樣式會把 `-0` 一併吃掉，反而改變邊界。
 * With includePrerelease the pre-release-friendly pattern is used; deleting
 * the wrong pattern would swallow the `-0` suffix and change the boundary.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 整理後的比較器字串 / Tidied comparator string
 */
export function replaceGTE0(comp: string, options: IOptions)
{
	return comp.trim()
		.replace(re[options?.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

/**
 * 展開單一比較器為純比較器字串
 * Expand a single comparator into plain comparators
 *
 * comprised of xranges, tildes, stars, and gtlt's at this point.
 * already replaced the hyphen ranges
 * turn into a set of JUST comparators.
 *
 * 順序刻意為 caret → tilde → xrange → star：前者的輸出可能仍含後者
 * 語法，逐一往下傳遞可避免重複處理或漏處理。
 * The order is deliberately caret → tilde → xrange → star: an earlier step may
 * emit syntax handled by a later one, so chaining downward avoids both
 * double-processing and missed cases.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 純比較器字串 / Plain comparator string
 */
export function parseComparator(comp: string, options: IOptions)
{
	comp = replaceCarets(comp, options)
	comp = replaceTildes(comp, options)
	comp = replaceXRanges(comp, options)
	comp = replaceStars(comp, options)
	return comp
}

/**
 * 展開 tilde（`~` / `~>`）語法
 * Expand tilde (`~` / `~>`) syntax
 *
 * ~, ~> --> * (any, kinda silly)
 * ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
 * ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
 * ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
 *
 * 以空白切割後逐段轉換再接回，可同時處理 `>=1.0.0 ~2.0.0` 這類混合字串。
 * Splitting on whitespace, converting each piece, then rejoining lets mixed
 * strings such as `>=1.0.0 ~2.0.0` be handled in one pass.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceTildes(comp: string, options: IOptions)
{
	return comp.trim().split(/\s+/).map((comp) =>
	{
		return replaceTilde(comp, options)
	}).join(' ');
}

/**
 * 展開單一 tilde 比較器
 * Expand a single tilde comparator
 *
 * 分支由粗到細（major → minor → patch → 有無 prerelease），
 * 一旦判定為萬用段落就不再往下檢查，確保每種寫法只會命中一個分支。
 * Branches run coarse → fine (major → minor → patch → presence of a
 * pre-release); once a wildcard segment matches, later checks are skipped so
 * each spelling hits exactly one branch.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項（loose 決定用哪組正則）/ Parse options (loose picks the regex flavour)
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceTilde(comp: string, options: IOptions)
{
	const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
	return comp.replace(r, (_, M, m, p, pr) =>
	{

		let ret: string

		if (isX(M))
		{
			ret = ''
		}
		else if (isX(m))
		{
			ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
		}
		else if (isX(p))
		{
			// ~1.2 == >=1.2.0 <1.3.0-0
			ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
		}
		else if (pr)
		{

			ret = `>=${M}.${m}.${p}-${pr
			} <${M}.${+m + 1}.0-0`
		}
		else
		{
			// ~1.2.3 == >=1.2.3 <1.3.0-0
			ret = `>=${M}.${m}.${p
			} <${M}.${+m + 1}.0-0`
		}

		return ret
	})
}

/**
 * 展開 caret（`^`）語法
 * Expand caret (`^`) syntax
 *
 * ^ --> * (any, kinda silly)
 * ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
 * ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
 * ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
 * ^1.2.3 --> >=1.2.3 <2.0.0-0
 * ^1.2.0 --> >=1.2.0 <2.0.0-0
 *
 * 與 replaceTildes 同樣以空白切割逐段轉換，保留混合字串的可讀性。
 * Like replaceTildes, this splits on whitespace and converts piecewise so
 * mixed strings stay supported.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceCarets(comp: string, options: IOptions)
{
	return comp.trim().split(/\s+/).map((comp) =>
	{
		return replaceCaret(comp, options)
	}).join(' ');
}

/**
 * 展開單一 caret 比較器
 * Expand a single caret comparator
 *
 * caret 的上界取決於 major 是否為 0：`0.x` 代表尚未穩定，
 * 只能保證 patch/minor 以下的相容性；`>=1` 則可放寬到下一個 major。
 * The upper bound of a caret depends on whether major is 0: `0.x` means the
 * API is not yet stable, so only patch/minor compatibility is promised, while
 * `>=1` may relax up to the next major.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項（loose 決定用哪組正則）/ Parse options (loose picks the regex flavour)
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceCaret(comp: string, options: IOptions)
{

	const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
	const z = options.includePrerelease ? '-0' : ''
	return comp.replace(r, (_, M, m, p, pr) =>
	{

		let ret: string

		/**
		 * 萬用段落由粗到細判定；includePrerelease 時下界補 `-0`，
		 * 讓 `1.0.0-0` 這類最低預發布版本也被納入。
		 * Wildcards are checked coarse → fine; with includePrerelease the lower
		 * bound gains `-0` so the lowest pre-release (e.g. `1.0.0-0`) is
		 * included.
		 */
		if (isX(M))
		{
			ret = ''
		}
		else if (isX(m))
		{
			ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
		}
		else if (isX(p))
		{
			/**
			 * major 為 0 時上界只能進位到 minor（避免跨過不相容的 patch），
			 * 否則可一路放行到下一個 major。
			 * When major is 0 the upper bound may only roll over the minor
			 * (to avoid crossing an incompatible patch); otherwise the next
			 * major is allowed.
			 */
			if (M === '0')
			{
				ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
			}
			else
			{
				ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
			}
		}
		else if (pr)
		{

			/**
			 * 有預發布標籤時沿用原 patch 作為下界，並依 major/minor 是否為 0
			 * 決定上界進位的位置（0.0.x → patch、0.x → minor、其餘 → major）。
			 * With a pre-release tag the original patch stays as the lower
			 * bound, while the upper bound rolls over patch/minor/major
			 * depending on whether major/minor is 0.
			 */
			if (M === '0')
			{
				if (m === '0')
				{
					ret = `>=${M}.${m}.${p}-${pr
					} <${M}.${m}.${+p + 1}-0`
				}
				else
				{
					ret = `>=${M}.${m}.${p}-${pr
					} <${M}.${+m + 1}.0-0`
				}
			}
			else
			{
				ret = `>=${M}.${m}.${p}-${pr
				} <${+M + 1}.0.0-0`
			}
		}
		else
		{

			/**
			 * 無預發布標籤時的分支結構與上一段相同，
			 * 差別在於下界不帶 `-pr`，且 z 只在 includePrerelease 時加入。
			 * Same shape as the previous block, except the lower bound carries
			 * no `-pr` and `z` only appears under includePrerelease.
			 */
			if (M === '0')
			{
				if (m === '0')
				{
					ret = `>=${M}.${m}.${p
					}${z} <${M}.${m}.${+p + 1}-0`
				}
				else
				{
					ret = `>=${M}.${m}.${p
					}${z} <${M}.${+m + 1}.0-0`
				}
			}
			else
			{
				ret = `>=${M}.${m}.${p
				} <${+M + 1}.0.0-0`
			}
		}

		return ret
	})
}

/**
 * 展開 xrange（如 `>=1.2.x`、`1.x`）語法
 * Expand xrange syntax (e.g. `>=1.2.x`, `1.x`)
 *
 * 以空白切割逐段轉換再接回，與 replaceTildes / replaceCarets 一致。
 * Splitting on whitespace, converting piecewise, then rejoining — same
 * strategy as replaceTildes / replaceCarets.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceXRanges(comp: string, options: IOptions)
{

	return comp.split(/\s+/).map((comp) =>
	{
		return replaceXRange(comp, options)
	}).join(' ')
}

/**
 * 展開單一 xrange 比較器
 * Expand a single xrange comparator
 *
 * 萬用段落會連鎖展開（xM ⇒ xm ⇒ xp），讓「哪一段是萬用」只需要判斷一次；
 * 運算子 `>` / `<=` 遇到萬用段落時必須改寫成等價的 `>=` / `<`，
 * 因為萬用本身沒有明確邊界，直接輸出會得到不可比較的結果。
 * Wildcards cascade (xM ⇒ xm ⇒ xp) so "which segment is a wildcard" is decided
 * once; operators `>` / `<=` must be rewritten into the equivalent `>=` / `<`
 * because a wildcard has no exact boundary and would otherwise produce a
 * non-comparable result.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項 / Parse options
 * @returns 展開後的比較器字串 / Expanded comparator string
 */
export function replaceXRange(comp: string, options: IOptions)
{
	comp = comp.trim()
	const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
	return comp.replace(r, (ret, gtlt, M, m, p, pr) =>
	{

		const xM = isX(M)
		const xm = xM || isX(m)
		const xp = xm || isX(p)
		const anyX = xp

		/**
		 * `=1.x` 等同於 `1.x`，先去掉運算子避免後續產生 `>=1.x` 這種殘缺輸出
		 * `=1.x` means the same as `1.x`; drop the operator so the output never
		 * degenerates into a broken `>=1.x`
		 */
		if (gtlt === '=' && anyX)
		{
			gtlt = ''
		}

		// if we're including prereleases in the match, then we need
		// to fix this to -0, the lowest possible prerelease value
		pr = options.includePrerelease ? '-0' : ''

		/**
		 * major 本身就是萬用：`>x` / `<x` 沒有任何可比較的版本
		 * （回傳 <0.0.0-0），其餘情況代表「任意版本」（回傳 *）。
		 * major itself is a wildcard: `>x` / `<x` can never match
		 * (<0.0.0-0), anything else means "any version" (`*`).
		 */
		if (xM)
		{
			if (gtlt === '>' || gtlt === '<')
			{
				// nothing is allowed
				ret = EnumSemverVersion.NULL
			}
			else
			{
				// nothing is forbidden
				ret = EnumSemverVersion.STAR
			}
		}
		else if (gtlt && anyX)
		{
			// we know patch is an x, because we have any x at all.
			// replace X with 0
			if (xm)
			{
				m = 0
			}
			p = 0

			/**
			 * `>` 遇到萬用段落要進位成 `>=` 下一個值：
			 * `>1` → `>=2.0.0`、`>1.2` → `>=1.3.0`，
			 * 否則會把被萬用涵蓋的版本誤判為符合。
			 * `>` over a wildcard must round up to `>=` of the next value
			 * (`>1` → `>=2.0.0`, `>1.2` → `>=1.3.0`), otherwise versions the
			 * wildcard covers would be wrongly accepted.
			 */
			if (gtlt === '>')
			{
				// >1 => >=2.0.0
				// >1.2 => >=1.3.0
				gtlt = '>='
				if (xm)
				{
					M = +M + 1
					m = 0
					p = 0
				}
				else
				{
					m = +m + 1
					p = 0
				}
			}
			else if (gtlt === '<=')
			{
				// <=0.7.x is actually <0.8.0, since any 0.7.x should
				// pass.  Similarly, <=7.x is actually <8.0.0, etc.
				gtlt = '<'
				if (xm)
				{
					M = +M + 1
				}
				else
				{
					m = +m + 1
				}
			}

			/**
			 * 上界一律補 `-0`：沒有預發布的上界會把 `x.0.0-0` 之外的
			 * 預發布版本也包含進來，與 semver 的預設行為不符。
			 * Upper bounds always gain `-0`; without it, pre-releases below
			 * the boundary would be included, which contradicts semver's
			 * default behavior.
			 */
			if (gtlt === '<')
			{
				pr = '-0'
			}

			ret = `${gtlt + M}.${m}.${p}${pr}`
		}
		else if (xm)
		{
			ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
		}
		else if (xp)
		{
			ret = `>=${M}.${m}.0${pr
			} <${M}.${+m + 1}.0-0`
		}

		return ret
	})
}

/**
 * 移除星號萬用字元
 * Strip star wildcards
 *
 * and '' means "any version", just remove the *s entirely.
 *
 * @param comp - 比較器字串 / Comparator string
 * @param options - 解析選項（此處刻意忽略）/ Parse options (deliberately ignored here)
 * @returns 移除萬用字元後的字串 / String without wildcards
 */
export function replaceStars(comp: string, options: IOptions)
{
	// Looseness is ignored here.  star is always as loose as it gets!
	return comp.trim().replace(re[t.STAR], '')
}
