"use strict";
/**
 * @lazy-node/semver-part
 *
 * 比較版本號部分字串的工具庫 / Utility library for comparing version part strings
 *
 * 此模組提供比較 semver 版本號部分（如 major.minor 或 minor.patch）的功能，
 * 而不需要完整的 semver 版本字串。
 *
 * This module provides functionality to compare parts of semver version strings
 * (e.g., major.minor or minor.patch) without requiring complete semver strings.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { compare, eq, gt, lt, parseVersions } from '@lazy-node/semver-part';
 *
 * // 比較版本部分 / Compare version parts
 * compare('1.2', '1.3'); // -1 (1.2 < 1.3)
 * eq('1.2', '1.2'); // true
 * gt('1.3', '1.2'); // true
 * lt('1.2', '1.3'); // true
 *
 * // 解析版本差異 / Parse version differences
 * parseVersions('1.2.3', '1.3.0');
 * // { versionOld: '1.2.3', versionNew: '1.3.0', partsOld: ['1', '2', '3'], partsNew: ['1', '3', '0'], index: 1 }
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./lib/_core"), exports);
tslib_1.__exportStar(require("./lib/compare"), exports);
tslib_1.__exportStar(require("./lib/parse"), exports);
exports.default = exports;
//# sourceMappingURL=index.js.map