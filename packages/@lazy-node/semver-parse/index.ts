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

import { stringifySimpleSemVer, stringifySemverFull } from './lib/stringifySimpleSemVer';
import { stringifySimpleSemVerRange } from './lib/stringifySimpleSemVerRange';
import { parseSimpleSemVerRange } from './lib/parseSimpleSemVerRange';
import { parseSimpleSemVer } from './lib/parseSimpleSemVer';

export * from './lib/checker';

export { parseSimpleSemVer as parse };
export { parseSimpleSemVerRange as parseRange };

export { stringifySimpleSemVer as stringify };
export { stringifySemverFull as stringifyFull };
export { stringifySimpleSemVerRange as stringifyRange };

export default stringifySimpleSemVerRange
