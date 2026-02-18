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

// 匯出主要的快取路徑取得函數
// Export main cache path getter functions
export { getCachePath, getCachePathAsync } from './lib/getCachePath';
// 匯出快取根目錄取得函數
// Export cache root directory getter functions
export { getCacheRoot, getCacheRootAsync } from './lib/getCacheRoot';
// 匯出名稱正規化函數
// Export name normalization function
export { normalizeName } from './lib/normalizeName';

// 匯出套件模組快取路徑尋找函數
// Export package module cache path finder function
export { findPkgModuleCachePath }
// 匯出套件模組路徑尋找函數
// Export package module path finder function
export { findPkgModulePath }
// 匯出 Yarn 快取路徑尋找函數
// Export Yarn cache path finder function
export { findYarnCachePath }
// 匯出 npm 快取路徑尋找函數
// Export npm cache path finder function
export { findNpmCachePath }
// 匯出作業系統暫存路徑尋找函數
// Export OS temp path finder function
export { findOSTempPath }

// 匯出所有類型定義
// Export all type definitions
export * from './lib/types';

// 預設匯出 getCachePath 函數
// Default export getCachePath function
export default getCachePath;
