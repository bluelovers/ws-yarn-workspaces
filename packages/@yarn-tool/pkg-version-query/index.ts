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

/**
 * 對外 API 面 (Public API Surface)：
 * 預設匯出 queryVersionWithCache，另提供 npm 套件參數查詢與快取操作；
 * 型別刻意以 type-only 匯出，避免載入執行期程式碼時連帶引進多餘的相依。
 *
 * Public API: queryVersionWithCache is the default export, plus the npm-package-argument
 * variant and cache access; types are re-exported type-only so pulling in the types
 * does not drag in extra runtime code.
 */
export type { ICachedVersionResult, IOptionsQueryVersion } from './lib/types';

export { queryVersionByNpmPackageArgWithCache }
export { queryVersionWithCache }

export { getCache }

export default queryVersionWithCache
