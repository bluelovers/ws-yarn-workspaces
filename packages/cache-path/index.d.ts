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
import { findNpmCachePath } from './lib/finder/findNpmCachePath';
import { findOSTempPath } from './lib/finder/findOSTempPath';
import { findPkgModuleCachePath, findPkgModulePath } from './lib/finder/findPkgModuleCachePath';
import { findYarnCachePath } from './lib/finder/findYarnCachePath';
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
 * 以下為各種快取來源的尋找函數，順序由 lib/finder 的 defaultOrder 決定
 * The following finders locate different cache sources; their order is defined by defaultOrder in lib/finder
 */
/**
 * 尋找專案 node_modules/.cache 路徑
 * Find package module cache path (node_modules/.cache)
 */
export { findPkgModuleCachePath };
/**
 * 尋找專案 node_modules 路徑
 * Find package module path (node_modules)
 */
export { findPkgModulePath };
/**
 * 尋找 Yarn 快取路徑
 * Find Yarn cache path
 */
export { findYarnCachePath };
/**
 * 尋找 npm 快取路徑
 * Find npm cache path
 */
export { findNpmCachePath };
/**
 * 取得作業系統暫存目錄
 * Get OS temporary directory
 */
export { findOSTempPath };
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
