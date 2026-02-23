/**
 * @lazy-node/semver-ampersand
 * 
 * 支援 ampersand (&) 語法的 semver 範圍處理工具庫
 * Semver range handling utilities with ampersand (&) syntax support
 * 
 * 此模組擴展了標準 semver 的範圍處理功能，支援使用 `&` 符號來表示「且」的條件，
 * 這在處理 yarn 或 npm workspaces 的依賴版本時特別有用。
 * 
 * This module extends standard semver range handling with support for the `&` 
 * symbol to represent "AND" conditions, which is particularly useful when 
 * handling dependency versions in yarn or npm workspaces.
 * 
 * @packageDocumentation
 * 
 * @example
 * ```typescript
 * import { satisfies, validRange, Range } from '@lazy-node/semver-ampersand';
 * 
 * // 標準 semver 範圍 / Standard semver range
 * satisfies('1.2.3', '>=1.0.0 <2.0.0'); // true
 * 
 * // 使用 ampersand 的範圍 / Range with ampersand
 * satisfies('1.2.3', '>=1.0.0 & <2.0.0'); // true
 * 
 * // 驗證範圍 / Validate range
 * validRange('>=1.0.0 & <2.0.0'); // true
 * 
 * // 使用 Range 類別 / Using Range class
 * const range = new Range('>=1.0.0 & <2.0.0');
 * range.test('1.5.0'); // true
 * ```
 */

import { simplifyRange } from './lib/simplifyRange';
import { handleAmpersandAndSpaces } from './lib/handleAmpersandAndSpaces';
import { satisfies } from './lib/satisfies';
import { maxSatisfying } from './lib/maxSatisfying';
import { minSatisfying } from './lib/minSatisfying';
import { validRange } from './lib/validRange';
import { Range } from './lib/Range';

export type { IOptions } from './lib/types';

export { reAmpersandAndSpaces } from './lib/const';

export {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleAmpersandAndSpaces,

	Range,
}

export default {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleAmpersandAndSpaces,

	Range,
}
