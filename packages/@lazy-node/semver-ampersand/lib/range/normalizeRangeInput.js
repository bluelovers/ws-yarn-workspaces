"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRangeInput = void 0;
const tslib_1 = require("tslib");
const re_1 = require("semver/internal/re");
const util_1 = require("./util");
const debug_1 = tslib_1.__importDefault(require("semver/internal/debug"));
const const_1 = require("../const");
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
    range = range.replace(const_1.reSpaces, ' ');
    return range;
}
exports.normalizeRangeInput = normalizeRangeInput;
//# sourceMappingURL=normalizeRangeInput.js.map