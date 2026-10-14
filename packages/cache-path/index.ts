/**
 * 快取路徑尋找工具
 * Cache Path Finder
 *
 * 此模組提供尋找和建立快取目錄的功能，類似於 `find-cache-dir`，
 * This module provides functionality to find and create cache directories, similar to `find-cache-dir`,
 * 但可在任何環境下運作，不僅限於模組/套件目錄。
 * but works in any environment, not just module/package directories.
 *
 * @packageDocumentation
 */

export { findNpmCachePath } from './lib/finder/findNpmCachePath';
export { findOSTempPath } from './lib/finder/findOSTempPath';
export { findPkgModuleCachePath, findPkgModulePath } from './lib/finder/findPkgModuleCachePath';
export { findYarnCachePath } from './lib/finder/findYarnCachePath';
export { findEnvCachePath } from './lib/finder/findEnvCachePath';

import { getCachePath } from './lib/getCachePath';

/**
 * 匯出主要的快取路徑取得函數（同步與非同步）
 * Export main cache path getter functions (sync and async)
 */
export { getCachePath, getCachePathAsync } from './lib/getCachePath';

/**
 * 匯出快取根目錄取得函數（同步與非同步）
 * Export cache root directory getter functions (sync and async)
 */
export { getCacheRoot, getCacheRootAsync } from './lib/getCacheRoot';

/**
 * 匯出名稱正規化函數，用於將套件名稱轉為檔案系統安全的目錄名
 * Export name normalization function, used to turn a package name into a file-system-safe directory name
 */
export { normalizeName } from './lib/normalizeName';

/**
 * 匯出所有型別定義（IOptions、ICachePathThunk 等）
 * Export all type definitions (IOptions, ICachePathThunk, etc.)
 */
export * from './lib/types';

/**
 * 預設匯出 getCachePath，讓 `import getCachePath from 'cache-path'` 可直接使用
 * Default export getCachePath so `import getCachePath from 'cache-path'` works directly
 */
export default getCachePath;
