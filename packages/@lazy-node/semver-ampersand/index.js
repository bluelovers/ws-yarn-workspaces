"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.handleAmpersandAndSpaces = exports.simplifyRange = exports.validRange = exports.minSatisfying = exports.maxSatisfying = exports.satisfies = exports.reAmpersandAndSpaces = void 0;
const simplifyRange_1 = require("./lib/simplifyRange");
Object.defineProperty(exports, "simplifyRange", { enumerable: true, get: function () { return simplifyRange_1.simplifyRange; } });
const handleAmpersandAndSpaces_1 = require("./lib/handleAmpersandAndSpaces");
Object.defineProperty(exports, "handleAmpersandAndSpaces", { enumerable: true, get: function () { return handleAmpersandAndSpaces_1.handleAmpersandAndSpaces; } });
const satisfies_1 = require("./lib/satisfies");
Object.defineProperty(exports, "satisfies", { enumerable: true, get: function () { return satisfies_1.satisfies; } });
const maxSatisfying_1 = require("./lib/maxSatisfying");
Object.defineProperty(exports, "maxSatisfying", { enumerable: true, get: function () { return maxSatisfying_1.maxSatisfying; } });
const minSatisfying_1 = require("./lib/minSatisfying");
Object.defineProperty(exports, "minSatisfying", { enumerable: true, get: function () { return minSatisfying_1.minSatisfying; } });
const validRange_1 = require("./lib/validRange");
Object.defineProperty(exports, "validRange", { enumerable: true, get: function () { return validRange_1.validRange; } });
const Range_1 = require("./lib/Range");
Object.defineProperty(exports, "Range", { enumerable: true, get: function () { return Range_1.Range; } });
var const_1 = require("./lib/const");
Object.defineProperty(exports, "reAmpersandAndSpaces", { enumerable: true, get: function () { return const_1.reAmpersandAndSpaces; } });
exports.default = {
    satisfies: satisfies_1.satisfies,
    maxSatisfying: maxSatisfying_1.maxSatisfying,
    minSatisfying: minSatisfying_1.minSatisfying,
    validRange: validRange_1.validRange,
    simplifyRange: simplifyRange_1.simplifyRange,
    handleAmpersandAndSpaces: handleAmpersandAndSpaces_1.handleAmpersandAndSpaces,
    Range: Range_1.Range,
};
//# sourceMappingURL=index.js.map