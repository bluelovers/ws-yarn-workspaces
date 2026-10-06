import { IOptions } from '../types';
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
export declare function hyphenReplace(incPr: boolean): ($0: string, from: string, fM: string, fm: string, fp: string, fpr: string, fb: string, to: string, tM: string, tm: string, tp: string, tpr: string, tb: string) => string;
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
export declare function isX(id: string): id is '' | '0' | '*' | 'x';
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
export declare function replaceGTE0(comp: string, options: IOptions): string;
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
export declare function parseComparator(comp: string, options: IOptions): string;
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
export declare function replaceTildes(comp: string, options: IOptions): string;
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
export declare function replaceTilde(comp: string, options: IOptions): string;
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
export declare function replaceCarets(comp: string, options: IOptions): string;
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
export declare function replaceCaret(comp: string, options: IOptions): string;
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
export declare function replaceXRanges(comp: string, options: IOptions): string;
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
export declare function replaceXRange(comp: string, options: IOptions): string;
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
export declare function replaceStars(comp: string, options: IOptions): string;
