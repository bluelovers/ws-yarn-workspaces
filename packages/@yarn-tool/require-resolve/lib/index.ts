/**
 * lib 子模組的彙整匯出入口
 * Aggregated export entry for the lib submodules
 *
 * 依類型、工具、錯誤處理、核心解析、模組載入與套件解析分組，
 * 方便直接從 lib/index 取得單一入口。
 * Groups types, utilities, error handling, core resolution, module loading
 * and package resolution so lib/index can act as a single entry.
 */

/**
 * 類型定義 / Type definitions
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
} from './types';

/**
 * Symbols 和工具函數 / Symbols and utility functions
 */
export {
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
	defaultMap,
	handleOptionsPaths,
	getTargetName,
	unshiftArray,
	isValidPathSymbol,
	validSymbols,
	type IPathItem as IPathItemType,
} from './util';

/**
 * 錯誤處理 / Error handling
 */
export {
	isErrorModuleNotFound,
	createModuleNotFoundError,
} from './error';

/**
 * 核心解析功能 / Core resolution functions
 */
export {
	requireResolveCore,
	requireResolveExtra,
	buildResolvePaths,
} from './core';

/**
 * 模組載入 / Module loading
 */
export {
	requireExtra,
	importExtra,
	tryRequireExtra,
	tryImportExtra,
} from './loader';

/**
 * 套件解析 / Package resolution
 */
export {
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
} from './package';
