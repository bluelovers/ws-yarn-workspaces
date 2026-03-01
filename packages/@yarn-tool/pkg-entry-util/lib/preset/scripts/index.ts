/**
 * 腳本預設模組統一匯出 / Scripts Preset Module Unified Exports
 *
 * 提供各種套件類型的預設 npm scripts，支援 monorepo 與獨立套件開發流程
 * Provides default npm scripts for various package types, supporting monorepo and standalone package development workflows
 *
 * @example
 * ```typescript
 * // 工作區根目錄 / Workspace root
 * import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts';
 * const scripts = defaultWorkspaceRootScripts();
 *
 * // 一般套件 / Regular package
 * import { defaultPkgScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts';
 * const scripts = defaultPkgScripts();
 *
 * // 填充虛擬腳本 / Fill dummy scripts
 * import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts';
 * fillDummyScripts(pkg.scripts, 'my-package');
 * ```
 */

/**
 * 虛擬腳本填充工具 / Dummy scripts filler utility
 *
 * 用於填充 package.json 生命週期腳本佔位符
 * For filling package.json lifecycle script placeholders
 */
export {
	_fillDummyScriptsCore,
	fillDummyScripts,
} from './dummy';

/**
 * 套件腳本預設 / Package scripts preset
 *
 * 標準套件的測試與建構腳本
 * Test and build scripts for standard packages
 */
export {
	defaultPkgScripts,
	defaultPkgNotOldExists,
} from './pkg-scripts';

/**
 * 根目錄套件腳本預設 / Root package scripts preset
 *
 * 獨立套件或 monorepo 根目錄的發布與版本管理腳本
 * Publishing and version management scripts for standalone packages or monorepo root
 */
export {
	defaultRootScripts,
} from './root-scripts';

/**
 * 共享根目錄腳本預設 / Shared root scripts preset
 *
 * 根目錄套件共用的通用管理腳本
 * Common management scripts shared by root packages
 */
export {
	defaultSharedRootScripts,
} from './shared-root-scripts';

/**
 * 工作區根目錄腳本預設 / Workspace root scripts preset
 *
 * Yarn/Lerna 工作區根目錄的完整管理腳本
 * Complete management scripts for Yarn/Lerna workspace root
 */
export {
	_runAllOrSince,
	defaultWorkspaceRootScripts,
} from './ws-root-scripts';
