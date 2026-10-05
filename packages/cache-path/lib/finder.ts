/**
 * 快取來源匯出與預設搜尋順序
 * Cache source re-exports and default search order
 *
 * @module cache-path/lib/finder
 */

import { findPkgModuleCachePath, findPkgModulePath } from './finder/findPkgModuleCachePath';
import { findYarnCachePath } from './finder/findYarnCachePath';
import { findNpmCachePath } from './finder/findNpmCachePath';
import { findOSTempPath } from './finder/findOSTempPath';

export { findPkgModuleCachePath }
export { findPkgModulePath }
export { findYarnCachePath }
export { findNpmCachePath }
export { findOSTempPath }

/**
 * 預設的快取來源搜尋順序
 * Default search order of cache sources
 *
 * fn[] of any function return a string
 * stop when get first return
 *
 * 順序刻意把「專案內路徑」放在最前：
 * 在專案中執行時優先使用 node_modules/.cache，離開專案才退回全域快取。
 * The order deliberately puts the in-project path first:
 * inside a project it prefers node_modules/.cache, and only falls back to global caches outside one.
 */
export const defaultOrder = [
	findPkgModulePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
];
