/**
 * @yarn-tool/node-modules - Node.js 模組路徑尋找工具
 * @yarn-tool/node-modules - Node.js module path finding utilities
 *
 * 這個套件提供了在 Node.js 專案中尋找模組路徑的工具函數，
 * 特別適用於 Yarn Workspaces 環境。
 *
 * This package provides utility functions for finding module paths in Node.js projects,
 * especially useful in Yarn Workspaces environments.
 *
 * @author user
 * @created 2020/6/5
 */
import { findModulesPackagePaths } from './lib/find-paths';
export { wsFindPackageHasModules } from './lib/ws-find-paths';
export * from './lib/find-paths';
export default findModulesPackagePaths;
