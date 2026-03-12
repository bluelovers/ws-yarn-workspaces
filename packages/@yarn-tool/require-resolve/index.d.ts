/**
 * @yarn-tool/require-resolve
 *
 * 擴充版 require.resolve，支援在額外路徑中搜尋模組
 * An extended require.resolve with support for searching modules in extra paths
 *
 * @module @yarn-tool/require-resolve
 * @author bluelovers
 * @license ISC
 */
export type { IOptionsRequireResolveCore, IOptionsRequireResolve, IErrorModuleNotFound, IOptionsRequireResolveNode, IPackageCoreInfo, IPackageInfo, IResolveResult, IPathItem, IPackageJson, } from './lib/types';
export { defaultMap, handleOptionsPaths, getTargetName, unshiftArray, } from './lib/util';
import { unshiftArray } from './lib/util';
export { isErrorModuleNotFound, createModuleNotFoundError, } from './lib/error';
export { requireResolveCore, requireResolveExtra, buildResolvePaths, } from './lib/core';
export { requireExtra, importExtra, tryRequireExtra, tryImportExtra, } from './lib/loader';
export { resolvePackageCore, resolvePackageRoot, resolvePackageJsonLocation, createResolveLocationFn, readModulePackageJson, resolvePackage, } from './lib/package';
/**
 * @deprecated 使用 unshiftArray 代替 / Use unshiftArray instead
 *
 * 將元素插入陣列開頭（若不存在）
 * Unshift item to array if not already at beginning
 *
 * @typeParam T - 陣列元素類型 / Array element type
 * @param array - 目標陣列 / Target array
 * @param item - 要插入的元素 / Item to insert
 * @returns 修改後的陣列 / Modified array
 */
export { unshiftArray as _unshiftArray };
export { requireResolveExtra as default } from './lib/core';
