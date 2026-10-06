/**
 * @fileoverview 套件解析模組 - 重新匯出 @yarn-tool/require-resolve 的套件解析功能
 * Package resolution module - Re-exports package resolution functions from @yarn-tool/require-resolve
 *
 * 此模組提供解析 Node.js 套件的根目錄與 package.json 路徑的功能。
 * This module provides functionality to resolve Node.js package root and package.json paths.
 *
 * @module @yarn-tool/resolve-package
 * @deprecated
 */
/**
 * 從 @yarn-tool/require-resolve 重新匯出所有套件解析功能
 * Re-export all package resolution functions from @yarn-tool/require-resolve
 *
 * 本套件僅為相容層 (Compatibility layer)，實際實作維持在來源套件以避免重複定義
 * This package is only a compatibility layer; the real implementation stays in the source package to avoid duplicate definitions
 */
export { resolvePackageCore, resolvePackageRoot, resolvePackageJsonLocation, createResolveLocationFn, readModulePackageJson, resolvePackage, resolvePackage as default, IOptionsRequireResolve, IOptionsRequireResolveCore, IPackageCoreInfo, IPackageInfo, IPathItem, 
/**
 * @deprecated 使用 IOptionsRequireResolve 代替 / Use IOptionsRequireResolve instead
 */
IOptionsRequireResolve as IOptions, } from '@yarn-tool/require-resolve';
