/**
 * @yarn-tool/semver-diff
 *
 * Colorize semver version differences with semantic colors for CLI output
 *
 * 此模組比較兩個 semver 版本字串，並以語意顏色標示差異段落：
 * major 為紅色、minor 為青色、patch 為綠色。
 *
 * Compares two semver version strings and colorizes the differing segment:
 * major → red, minor → cyan, patch → green.
 *
 * Created by user on 2020/6/11.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { colorizeDiff } from '@yarn-tool/semver-diff';
 *
 * // minor 差異 → 青色 / minor difference → cyan
 * colorizeDiff('1.2.3', '1.3.0'); // '1.3.0'
 *
 * // 純文字輸出 / plain text output
 * colorizeDiff('1.2.3', '1.3.0', { stripAnsi: true }); // '1.3.0'
 * ```
 */
import { colorizeDiff } from './lib/colorize';
export * from './lib/types';
export * from './lib/colorize';
export * from './lib/core';
export default colorizeDiff;
