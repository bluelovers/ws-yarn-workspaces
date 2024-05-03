"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hyphenReplace = hyphenReplace;
exports.isX = isX;
exports.replaceGTE0 = replaceGTE0;
exports.parseComparator = parseComparator;
exports.replaceTildes = replaceTildes;
exports.replaceTilde = replaceTilde;
exports.replaceCarets = replaceCarets;
exports.replaceCaret = replaceCaret;
exports.replaceXRanges = replaceXRanges;
exports.replaceXRange = replaceXRange;
exports.replaceStars = replaceStars;
const re_1 = require("semver/internal/re");
/**
 * This function is passed to string.replace(re[t.HYPHENRANGE])
 * M, m, patch, prerelease, build
 * 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
 * 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
 * 1.2 - 3.4 => >=1.2.0 <3.5.0-0
 */
function hyphenReplace(incPr) {
    return ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
        if (isX(fM)) {
            from = '';
        }
        else if (isX(fm)) {
            from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
        }
        else if (isX(fp)) {
            from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
        }
        else if (fpr) {
            from = `>=${from}`;
        }
        else {
            from = `>=${from}${incPr ? '-0' : ''}`;
        }
        if (isX(tM)) {
            to = '';
        }
        else if (isX(tm)) {
            to = `<${+tM + 1}.0.0-0`;
        }
        else if (isX(tp)) {
            to = `<${tM}.${+tm + 1}.0-0`;
        }
        else if (tpr) {
            to = `<=${tM}.${tm}.${tp}-${tpr}`;
        }
        else if (incPr) {
            to = `<${tM}.${tm}.${+tp + 1}-0`;
        }
        else {
            to = `<=${to}`;
        }
        return (`${from} ${to}`).trim();
    };
}
function isX(id) {
    return !id || id.toLowerCase() === 'x' || id === '*';
}
function replaceGTE0(comp, options) {
    return comp.trim()
        .replace(re_1.re[(options === null || options === void 0 ? void 0 : options.includePrerelease) ? re_1.t.GTE0PRE : re_1.t.GTE0], '');
}
/**
 * comprised of xranges, tildes, stars, and gtlt's at this point.
 * already replaced the hyphen ranges
 * turn into a set of JUST comparators.
 */
function parseComparator(comp, options) {
    comp = replaceCarets(comp, options);
    comp = replaceTildes(comp, options);
    comp = replaceXRanges(comp, options);
    comp = replaceStars(comp, options);
    return comp;
}
/**
 * ~, ~> --> * (any, kinda silly)
 * ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
 * ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
 * ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
 */
function replaceTildes(comp, options) {
    return comp.trim().split(/\s+/).map((comp) => {
        return replaceTilde(comp, options);
    }).join(' ');
}
function replaceTilde(comp, options) {
    const r = options.loose ? re_1.re[re_1.t.TILDELOOSE] : re_1.re[re_1.t.TILDE];
    return comp.replace(r, (_, M, m, p, pr) => {
        let ret;
        if (isX(M)) {
            ret = '';
        }
        else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        }
        else if (isX(p)) {
            // ~1.2 == >=1.2.0 <1.3.0-0
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        }
        else if (pr) {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        }
        else {
            // ~1.2.3 == >=1.2.3 <1.3.0-0
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        return ret;
    });
}
/**
 * ^ --> * (any, kinda silly)
 * ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
 * ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
 * ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
 * ^1.2.3 --> >=1.2.3 <2.0.0-0
 * ^1.2.0 --> >=1.2.0 <2.0.0-0
 */
function replaceCarets(comp, options) {
    return comp.trim().split(/\s+/).map((comp) => {
        return replaceCaret(comp, options);
    }).join(' ');
}
function replaceCaret(comp, options) {
    const r = options.loose ? re_1.re[re_1.t.CARETLOOSE] : re_1.re[re_1.t.CARET];
    const z = options.includePrerelease ? '-0' : '';
    return comp.replace(r, (_, M, m, p, pr) => {
        let ret;
        if (isX(M)) {
            ret = '';
        }
        else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        }
        else if (isX(p)) {
            if (M === '0') {
                ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            }
            else {
                ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
        }
        else if (pr) {
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
                }
                else {
                    ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
                }
            }
            else {
                ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
        }
        else {
            if (M === '0') {
                if (m === '0') {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
                }
                else {
                    ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
                }
            }
            else {
                ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
        }
        return ret;
    });
}
function replaceXRanges(comp, options) {
    return comp.split(/\s+/).map((comp) => {
        return replaceXRange(comp, options);
    }).join(' ');
}
function replaceXRange(comp, options) {
    comp = comp.trim();
    const r = options.loose ? re_1.re[re_1.t.XRANGELOOSE] : re_1.re[re_1.t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
            gtlt = '';
        }
        // if we're including prereleases in the match, then we need
        // to fix this to -0, the lowest possible prerelease value
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
            if (gtlt === '>' || gtlt === '<') {
                // nothing is allowed
                ret = "<0.0.0-0" /* EnumSemverVersion.NULL */;
            }
            else {
                // nothing is forbidden
                ret = "*" /* EnumSemverVersion.STAR */;
            }
        }
        else if (gtlt && anyX) {
            // we know patch is an x, because we have any x at all.
            // replace X with 0
            if (xm) {
                m = 0;
            }
            p = 0;
            if (gtlt === '>') {
                // >1 => >=2.0.0
                // >1.2 => >=1.3.0
                gtlt = '>=';
                if (xm) {
                    M = +M + 1;
                    m = 0;
                    p = 0;
                }
                else {
                    m = +m + 1;
                    p = 0;
                }
            }
            else if (gtlt === '<=') {
                // <=0.7.x is actually <0.8.0, since any 0.7.x should
                // pass.  Similarly, <=7.x is actually <8.0.0, etc.
                gtlt = '<';
                if (xm) {
                    M = +M + 1;
                }
                else {
                    m = +m + 1;
                }
            }
            if (gtlt === '<') {
                pr = '-0';
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
        }
        else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        }
        else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        return ret;
    });
}
/**
 * and '' means "any version", just remove the *s entirely.
 */
function replaceStars(comp, options) {
    // Looseness is ignored here.  star is always as loose as it gets!
    return comp.trim().replace(re_1.re[re_1.t.STAR], '');
}
//# sourceMappingURL=util.js.map