"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWorkspaceRootScripts = exports._runAllOrSince = exports.defaultSharedRootScripts = exports.defaultRootScripts = exports.defaultPkgNotOldExists = exports.defaultPkgScripts = exports.fillDummyScripts = exports._fillDummyScriptsCore = void 0;
/**
 * 虛擬腳本填充工具 / Dummy scripts filler utility
 *
 * 用於填充 package.json 生命週期腳本佔位符
 * For filling package.json lifecycle script placeholders
 */
var dummy_1 = require("./dummy");
Object.defineProperty(exports, "_fillDummyScriptsCore", { enumerable: true, get: function () { return dummy_1._fillDummyScriptsCore; } });
Object.defineProperty(exports, "fillDummyScripts", { enumerable: true, get: function () { return dummy_1.fillDummyScripts; } });
/**
 * 套件腳本預設 / Package scripts preset
 *
 * 標準套件的測試與建構腳本
 * Test and build scripts for standard packages
 */
var pkg_scripts_1 = require("./pkg-scripts");
Object.defineProperty(exports, "defaultPkgScripts", { enumerable: true, get: function () { return pkg_scripts_1.defaultPkgScripts; } });
Object.defineProperty(exports, "defaultPkgNotOldExists", { enumerable: true, get: function () { return pkg_scripts_1.defaultPkgNotOldExists; } });
/**
 * 根目錄套件腳本預設 / Root package scripts preset
 *
 * 獨立套件或 monorepo 根目錄的發布與版本管理腳本
 * Publishing and version management scripts for standalone packages or monorepo root
 */
var root_scripts_1 = require("./root-scripts");
Object.defineProperty(exports, "defaultRootScripts", { enumerable: true, get: function () { return root_scripts_1.defaultRootScripts; } });
/**
 * 共享根目錄腳本預設 / Shared root scripts preset
 *
 * 根目錄套件共用的通用管理腳本
 * Common management scripts shared by root packages
 */
var shared_root_scripts_1 = require("./shared-root-scripts");
Object.defineProperty(exports, "defaultSharedRootScripts", { enumerable: true, get: function () { return shared_root_scripts_1.defaultSharedRootScripts; } });
/**
 * 工作區根目錄腳本預設 / Workspace root scripts preset
 *
 * Yarn/Lerna 工作區根目錄的完整管理腳本
 * Complete management scripts for Yarn/Lerna workspace root
 */
var ws_root_scripts_1 = require("./ws-root-scripts");
Object.defineProperty(exports, "_runAllOrSince", { enumerable: true, get: function () { return ws_root_scripts_1._runAllOrSince; } });
Object.defineProperty(exports, "defaultWorkspaceRootScripts", { enumerable: true, get: function () { return ws_root_scripts_1.defaultWorkspaceRootScripts; } });
//# sourceMappingURL=index.js.map