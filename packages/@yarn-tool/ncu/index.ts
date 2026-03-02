/**
 * @yarn-tool/ncu
 *
 * A wrapper tool for npm-check-updates that checks and updates package dependencies.
 * 提供依賴版本檢查與更新的核心功能，封裝 npm-check-updates 並擴展其能力。
 *
 * 此模組是 yarn-tool 生態系統中處理依賴版本管理的核心組件，提供以下功能：
 * - 封裝 npm-check-updates 的主要功能
 * - 擴展支援 semver 版本範圍處理
 * - 整合版本快取機制提升效能
 * - 提供 yargs CLI 選項設定
 * - 支援 yarn.lock 的 resolutions 更新
 *
 * This module is the core component for dependency version management in the yarn-tool ecosystem,
 * providing the following features:
 * - Wraps core functionality of npm-check-updates
 * - Extended support for semver version range processing
 * - Integrated version caching mechanism for performance
 * - Provides yargs CLI option configuration
 * - Supports yarn.lock resolutions updates
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { npmCheckUpdates } from '@yarn-tool/ncu';
 *
 * // 檢查並更新 package.json 中的依賴版本
 * // Check and update dependencies in package.json
 * const result = await npmCheckUpdates(cache, {
 *   json_old: packageJson,
 *   upgrade: true,
 * });
 *
 * console.log(result.list_updated); // { "package-name": "new-version" }
 * console.log(result.json_changed); // true if any updates were made
 * ```
 */

/**
 * 類型定義匯出 / Type definitions export
 * 包含所有介面、列舉和類型別名
 * Contains all interfaces, enums, and type aliases
 */
export * from './lib/types';

/**
 * 版本快取儲存匯出 / Version cache store export
 * 提供遠端套件版本查詢的快取機制
 * Provides caching mechanism for remote package version queries
 */
export * from './lib/store';

/**
 * CLI 選項設定匯出 / CLI options configuration export
 * 用於整合 yargs 命令列解析器
 * Used for integrating with yargs command line parser
 */
export * from './lib/cli';

/**
 * 遠端套件查詢功能匯出 / Remote package query functions export
 * 提供從 npm registry 查詢套件版本資訊的功能
 * Provides functions to query package version info from npm registry
 */
export * from './lib/remote';

/**
 * 工具函數匯出 / Utility functions export
 * 包含版本比較、semver 處理等輔助函數
 * Contains helper functions for version comparison, semver processing, etc.
 */
export * from './lib/util';

/**
 * 選項處理函數匯出 / Options processing functions export
 * 用於處理和標準化 ncu 選項
 * Used for processing and standardizing ncu options
 */
export * from './lib/options';

/**
 * 更新功能匯出 / Update functions export
 * 包含核心的 npmCheckUpdates 和 checkResolutionsUpdate 函數
 * Contains core npmCheckUpdates and checkResolutionsUpdate functions
 */
export * from './lib/update';

/**
 * 模組預設導出 / Module default export
 * 導出整個模組的命名空間，便於使用 `import ncu from '@yarn-tool/ncu'`
 * Exports the entire module namespace for convenient usage with `import ncu from '@yarn-tool/ncu'`
 */
export default exports as typeof import('./index');
