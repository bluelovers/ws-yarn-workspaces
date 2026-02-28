"use strict";
/**
 * @lazy-node/semver-parse
 *
 * 簡易 semver 解析與字串化工具庫 / Simple semver parsing and stringification utilities
 *
 * 此模組提供輕量級的 semver 解析功能，可將版本字串解析為結構化物件，
 * 並支援版本範圍（range）的解析與字串化。
 *
 * This module provides lightweight semver parsing functionality,
 * converting version strings to structured objects, and supporting
 * parsing and stringification of version ranges.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { parse, stringify, parseRange, stringifyRange } from '@lazy-node/semver-parse';
 *
 * // 解析版本字串 / Parse version string
 * const semver = parse('>=1.2.3-beta.1+build.123');
 * // {
 * //   semver: '>=1.2.3-beta.1+build.123',
 * //   operator: '>=',
 * //   version: '1.2.3-beta.1+build.123',
 * //   major: '1',
 * //   minor: '2',
 * //   patch: '3',
 * //   release: 'beta.1',
 * //   build: 'build.123'
 * // }
 *
 * // 字串化版本物件 / Stringify version object
 * stringify(semver); // '1.2.3-beta.1+build.123'
 *
 * // 解析版本範圍 / Parse version range
 * parseRange('>=1.2.3 <2.0.0 || 1.1.3');
 *
 * // 字串化版本範圍 / Stringify version range
 * stringifyRange([...]);
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyRange = exports.stringifyFull = exports.stringify = exports.parseRange = exports.parse = void 0;
const tslib_1 = require("tslib");
const stringifySimpleSemVer_1 = require("./lib/stringifySimpleSemVer");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringifySimpleSemVer_1.stringifySimpleSemVer; } });
Object.defineProperty(exports, "stringifyFull", { enumerable: true, get: function () { return stringifySimpleSemVer_1.stringifySemverFull; } });
const stringifySimpleSemVerRange_1 = require("./lib/stringifySimpleSemVerRange");
Object.defineProperty(exports, "stringifyRange", { enumerable: true, get: function () { return stringifySimpleSemVerRange_1.stringifySimpleSemVerRange; } });
const parseSimpleSemVerRange_1 = require("./lib/parseSimpleSemVerRange");
Object.defineProperty(exports, "parseRange", { enumerable: true, get: function () { return parseSimpleSemVerRange_1.parseSimpleSemVerRange; } });
const parseSimpleSemVer_1 = require("./lib/parseSimpleSemVer");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parseSimpleSemVer_1.parseSimpleSemVer; } });
tslib_1.__exportStar(require("./lib/checker"), exports);
exports.default = stringifySimpleSemVerRange_1.stringifySimpleSemVerRange;
//# sourceMappingURL=index.js.map