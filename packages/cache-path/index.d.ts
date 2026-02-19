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
export { getCachePath, getCachePathAsync } from './lib/getCachePath';
export { getCacheRoot, getCacheRootAsync } from './lib/getCacheRoot';
export { normalizeName } from './lib/normalizeName';
export { findPkgModuleCachePath };
export { findPkgModulePath };
export { findYarnCachePath };
export { findNpmCachePath };
export { findOSTempPath };
export * from './lib/types';
export default getCachePath;
