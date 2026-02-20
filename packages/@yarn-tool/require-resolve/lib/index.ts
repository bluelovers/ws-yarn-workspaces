// 類型定義 / Type definitions
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

// Symbols 和工具函數 / Symbols and utility functions
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

// 錯誤處理 / Error handling
export {
	isErrorModuleNotFound,
	createModuleNotFoundError,
} from './error';

// 核心解析功能 / Core resolution functions
export {
	requireResolveCore,
	requireResolveExtra,
	buildResolvePaths,
} from './core';

// 模組載入 / Module loading
export {
	requireExtra,
	importExtra,
	tryRequireExtra,
	tryImportExtra,
} from './loader';

// 套件解析 / Package resolution
export {
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
} from './package';