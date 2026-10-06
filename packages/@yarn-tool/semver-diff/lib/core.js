"use strict";
/**
 * 差異分析模組 / Version difference analysis module
 *
 * Created by user on 2020/6/11.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersionsDiffCore = parseVersionsDiffCore;
exports.colorizeDiffCore = colorizeDiffCore;
const _core_1 = require("@lazy-node/semver-part/lib/_core");
const parse_1 = require("@lazy-node/semver-part/lib/parse");
/**
 * 分析兩個版本的差異並準備著色所需的中繼資料
 * Analyze the difference between two versions and prepare colorization metadata
 *
 * 此函式不做任何著色，只負責：
 * 1. 剝離並記住 `^` / `~` 前綴（兩側前綴相同才有意義）
 * 2. 依差異段落索引（0/1/2）選出對應顏色
 * 3. 把版本切成「差異前綴」與「差異段落起的其餘部分」
 * This function performs no coloring; it only (1) strips and remembers a `^` /
 * `~` prefix (only meaningful when both sides share it), (2) picks the color by
 * the differing segment index (0/1/2), and (3) splits the version into the
 * prefix before the difference and the remainder from the changed segment.
 *
 * @param from - 舊版本字串 / Old version string
 * @param to - 新版本字串 / New version string
 * @param options - 顯示選項 / Display options
 * @returns 差異分析物件 / Difference analysis object
 *
 * @example
 * ```typescript
 * parseVersionsDiffCore('^1.0.0', '^1.2.3');
 * // { leadingWildcard: '^', result: '1', middot: '.', resultAppend: '2.3', color: 'cyan', ... }
 * ```
 */
function parseVersionsDiffCore(from, to, options) {
    let leadingWildcard = '';
    /**
     * 只有「to 以 ^ 或 ~ 開頭」且「兩側首字元相同」時才保留前綴：
     * 例如 ^1.0.0 → ^1.2.3 顯示為 ^1.`2.3`；
     * 若兩側前綴不同（如 ^ 與 ~），剝除會誤導使用者，故略過。
     * The prefix is kept only when `to` starts with `^`/`~` *and* both sides
     * share that first character (e.g. ^1.0.0 → ^1.2.3 renders as ^1.`2.3`);
     * mismatched prefixes (^ vs ~) are left alone, since stripping them would
     * mislead the reader.
     */
    if (/^[~^]/.test(to) && to[0] === from[0]) {
        leadingWildcard = to[0];
        to = to.slice(1);
        from = from.slice(1);
    }
    // 未指定時的預設配色：major 紅、minor 青、patch 綠
    // Default palette: major red, minor cyan, patch green
    const { _colors = ['red', 'cyan', 'green'] } = options || {};
    const data = (0, parse_1.parseVersionsAndCompare)(from, to);
    const { index, partsNew, partsOld } = data;
    // index 即差異段落（0/1/2），直接對應 _colors 的三個位置
    // `index` is the differing segment (0/1/2) and maps straight onto _colors
    const color = _colors[index];
    // 只有差異發生在中間段落時才需要補上連接用的 '.'
    // The connecting '.' is only needed when the difference sits in a middle segment
    const middot = index > 0 && index < partsNew.length ? '.' : '';
    const result = (0, _core_1.partsToVersion)(partsNew.slice(0, index));
    const resultAppend = (0, _core_1.partsToVersion)(partsNew.slice(index));
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
/**
 * 依差異段落著色版本字串
 * Colorize a version string by the differing segment
 *
 * 只有在版本確實有差異（comp 非 0）時才套用顏色，
 * 兩版本相同時以無樣式的 chalk 呼叫輸出，避免多餘的 ANSI 轉義。
 * Color is applied only when the versions actually differ (`comp` is non-zero);
 * when they are equal the bare chalk is called so no needless ANSI escapes are
 * emitted.
 *
 * @param from - 舊版本字串 / Old version string
 * @param to - 新版本字串 / New version string
 * @param options - 顯示選項，至少需提供 chalk 或 stripAnsi / Display options; requires at least `chalk` or `stripAnsi`
 * @returns 帶顏色的差異顯示字串 / Colorized difference string
 *
 * @example
 * ```typescript
 * colorizeDiffCore('1.2.3', '1.3.0', { stripAnsi: true }); // '1.3.0'
 * ```
 */
function colorizeDiffCore(from, to, options) {
    let { leadingWildcard, result, middot, resultAppend, color, comp, } = parseVersionsDiffCore(from, to, options);
    /**
     * stripAnsi 時保持原樣；其餘情況依 comp 決定是否上色：
     * comp 為 0（版本相同）走無樣式 chalk，避免輸出看不見的轉義序列。
     * With stripAnsi the text is left untouched; otherwise `comp` decides:
     * when `comp` is 0 (versions equal) the bare chalk is used so invisible
     * escape sequences never appear in the output.
     */
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
//# sourceMappingURL=core.js.map