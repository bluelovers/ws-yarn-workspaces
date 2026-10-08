/**
 * @deprecated This package is deprecated, use @yarn-tool/require-resolve instead
 *
 * 從 @yarn-tool/require-resolve 重新匯出所有套件解析功能
 *
 * 本套件僅為相容層 (Compatibility layer)，實際實作維持在來源套件以避免重複定義
 */
export { resolvePackageCore, resolvePackageRoot, resolvePackageJsonLocation, createResolveLocationFn, readModulePackageJson, resolvePackage, resolvePackage as default, IOptionsRequireResolve, IOptionsRequireResolveCore, IPackageCoreInfo, IPackageInfo, IPathItem, 
/**
 * @deprecated 使用 IOptionsRequireResolve 代替 / Use IOptionsRequireResolve instead
 */
IOptionsRequireResolve as IOptions, } from '@yarn-tool/require-resolve';
