"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRangeInput = normalizeRangeInput;
const tslib_1 = require("tslib");
const re_1 = require("semver/internal/re");
const util_1 = require("./util");
const debug_1 = tslib_1.__importDefault(require("semver/internal/debug"));
const const_1 = require("../const");
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
function normalizeRangeInput(range, options) {
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = options.loose ? re_1.re[re_1.t.HYPHENRANGELOOSE] : re_1.re[re_1.t.HYPHENRANGE];
    range = range.replace(hr, (0, util_1.hyphenReplace)(options.includePrerelease));
    (0, debug_1.default)('hyphen replace', range);
    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re_1.re[re_1.t.COMPARATORTRIM], re_1.comparatorTrimReplace);
    (0, debug_1.default)('comparator trim', range, re_1.re[re_1.t.COMPARATORTRIM]);
    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re_1.re[re_1.t.TILDETRIM], re_1.tildeTrimReplace);
    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re_1.re[re_1.t.CARETTRIM], re_1.caretTrimReplace);
    // normalize spaces
    // 最後統一收斂所有空白型別，讓 splitSpace 的切割結果可預期
    // Collapse every whitespace flavour last so splitSpace cuts predictably
    range = range.replace(const_1.reSpaces, ' ');
    return range;
}
//# sourceMappingURL=normalizeRangeInput.js.map