"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorizeDiffCore = exports.parseVersionsDiffCore = void 0;
const _core_1 = require("@lazy-node/semver-part/lib/_core");
const parse_1 = require("@lazy-node/semver-part/lib/parse");
function parseVersionsDiffCore(from, to, options) {
    let leadingWildcard = '';
    if (/^[~^]/.test(to) && to[0] === from[0]) {
        leadingWildcard = to[0];
        to = to.slice(1);
        from = from.slice(1);
    }
    const { _colors = ['red', 'cyan', 'green'] } = options || {};
    const data = parse_1.parseVersionsAndCompare(from, to);
    const { index, partsNew, partsOld } = data;
    const color = _colors[index];
    const middot = index > 0 && index < partsNew.length ? '.' : '';
    const result = _core_1.partsToVersion(partsNew.slice(0, index));
    const resultAppend = _core_1.partsToVersion(partsNew.slice(index));
    return {
        ...data,
        _colors,
        color,
        leadingWildcard,
        result,
        middot,
        resultAppend,
    };
}
exports.parseVersionsDiffCore = parseVersionsDiffCore;
function colorizeDiffCore(from, to, options) {
    let { leadingWildcard, result, middot, resultAppend, color, comp, } = parseVersionsDiffCore(from, to, options);
    if (options.stripAnsi !== true) {
        const { chalk } = options;
        // @ts-ignore
        resultAppend = (comp ? chalk[color](resultAppend) : chalk(resultAppend));
    }
    return leadingWildcard +
        result +
        middot +
        resultAppend;
}
exports.colorizeDiffCore = colorizeDiffCore;
//# sourceMappingURL=core.js.map