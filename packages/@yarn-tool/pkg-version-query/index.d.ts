/**
 * @yarn-tool/pkg-version-query
 *
 * Query package versions from npm registry with LRU cache support.
 * 從 npm registry 查詢套件版本，支援 LRU 快取機制。
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import queryVersionWithCache from '@yarn-tool/pkg-version-query';
 *
 * // Query latest version
 * const version = await queryVersionWithCache('lodash');
 *
 * // Query specific version range
 * const version = await queryVersionWithCache('typescript', '^4.0.0');
 * ```
 */
import { queryVersionByNpmPackageArgWithCache } from './lib/queryVersionByNpmPackageArg';
import { queryVersionWithCache } from './lib/queryVersion';
import { getCache } from './lib/cacheAgent';
export type { ICachedVersionResult, IOptionsQueryVersion } from './lib/types';
export { queryVersionByNpmPackageArgWithCache };
export { queryVersionWithCache };
export { getCache };
export default queryVersionWithCache;
