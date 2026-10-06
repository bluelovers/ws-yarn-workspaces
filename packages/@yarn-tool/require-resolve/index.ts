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

/**
 * ============================================================================
 * 重新匯出 lib 模組的所有內容 / Re-export all content from lib module
 * ============================================================================
 */

export type {
	IOptionsRequireResolveCore,
	IOptionsRequireResolve,
	IErrorModuleNotFound,
	IOptionsRequireResolveNode,
	IPackageCoreInfo,
	IPackageInfo,
	IResolveResult,
	IPathItem,
	IPackageJson,
} from './lib/types';

export {
	defaultMap,
	handleOptionsPaths,
	getTargetName,
	_unshiftArray,
} from './lib/util';

export {
	isErrorModuleNotFound,
	createModuleNotFoundError,
} from './lib/error';

export {
	requireResolveCore,
	requireResolveExtra,
	buildResolvePaths,
} from './lib/core';

export {
	requireExtra,
	importExtra,
	tryRequireExtra,
	tryImportExtra,
} from './lib/loader';

export {
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
} from './lib/package';

/**
 * ============================================================================
 * 預設匯出 / Default export
 * ============================================================================
 */

export { requireResolveExtra as default } from './lib/core';
