export type { IOptionsRequireResolveCore, IOptionsRequireResolve, IErrorModuleNotFound, IOptionsRequireResolveNode, IPackageCoreInfo, IPackageInfo, IResolveResult, IPathItem, IPackageJson, } from './types';
export { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, defaultMap, handleOptionsPaths, getTargetName, unshiftArray, isValidPathSymbol, validSymbols, type IPathItem as IPathItemType, } from './util';
export { isErrorModuleNotFound, createModuleNotFoundError, } from './error';
export { requireResolveCore, requireResolveExtra, buildResolvePaths, } from './core';
export { requireExtra, importExtra, tryRequireExtra, tryImportExtra, } from './loader';
export { resolvePackageCore, resolvePackageRoot, resolvePackageJsonLocation, createResolveLocationFn, readModulePackageJson, resolvePackage, } from './package';
