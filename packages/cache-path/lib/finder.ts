/**
 * 快取來源匯出與預設搜尋順序
 * Cache source re-exports and default search order
 *
 * @module cache-path/lib/finder
 */

import { findEnvCachePath } from './finder/findEnvCachePath';
import { findPkgModuleCachePath, findPkgModulePath } from './finder/findPkgModuleCachePath';
import { findYarnCachePath } from './finder/findYarnCachePath';
import { findNpmCachePath } from './finder/findNpmCachePath';
import { findOSTempPath } from './finder/findOSTempPath';

export { findEnvCachePath }
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
 * 最前面的 findEnvCachePath 讀取 CACHE_DIR_DEV / TEMP_DEV / CACHE_DIR，
 * 屬於呼叫端的明確指定，權限最高；
 * 接著刻意把「專案內路徑」放在其餘來源之前：
 * 在專案中執行時優先使用 node_modules/.cache，離開專案才退回全域快取。
 *
 * 為 useGlobalDefaultFailback 未啟用時的兜底順序（參見 defaultOrderGlobal）。
 */
export const defaultOrder = Object.freeze([
	findEnvCachePath,
	findPkgModulePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
]);

/**
 * 全域優先的快取來源搜尋順序
 * Global-first search order of cache sources
 *
 * useGlobalDefaultFailback 設為 true 時取代 defaultOrder 作為兜底順序：
 * 先嘗試 yarn / npm / tmp 等全域快取，最後才回到專案內的 node_modules；
 * 唯獨環境變數來源 findEnvCachePath 仍排最前，因為明確指定高於一切。
 */
export const defaultOrderGlobal = Object.freeze([
	findEnvCachePath,
	findYarnCachePath,
	findNpmCachePath,
	findOSTempPath,
	findPkgModulePath,
]);
