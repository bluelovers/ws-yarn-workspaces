/**
 * 差異分析模組 / Version difference analysis module
 *
 * Created by user on 2020/6/11.
 *
 * @packageDocumentation
 */
import { ITSRequireAtLeastOne } from 'ts-type';
import { IOptionsParseVersionsDiff, IParseVersionsDiffCore } from './types';
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
export declare function parseVersionsDiffCore(from: string, to: string, options?: IOptionsParseVersionsDiff): IParseVersionsDiffCore;
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
export declare function colorizeDiffCore(from: string, to: string, options?: ITSRequireAtLeastOne<IOptionsParseVersionsDiff, 'chalk'>): string;
