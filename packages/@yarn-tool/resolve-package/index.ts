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

// 從 @yarn-tool/require-resolve 重新匯出所有套件解析功能
// Re-export all package resolution functions from @yarn-tool/require-resolve
export {
	resolvePackageCore,
	resolvePackageRoot,
	resolvePackageJsonLocation,
	createResolveLocationFn,
	readModulePackageJson,
	resolvePackage,
	IOptions,
} from '@yarn-tool/require-resolve';

// 匯入類型以供預設匯出使用
// Import types for default export
import { resolvePackage } from '@yarn-tool/require-resolve';

export default resolvePackage;
