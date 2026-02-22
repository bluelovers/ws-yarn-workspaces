/**
 * Sort order for package.json keys / package.json 鍵值排序順序
 *
 * This module exports a predefined sort order for package.json keys.
 * The order follows common conventions and best practices for package.json organization.
 *
 * 此模組匯出 package.json 鍵值的預定義排序順序。
 * 順序遵循 package.json 組織的常見慣例和最佳實踐。
 *
 * @module @yarn-tool/sort-package-json-order
 *
 * @example
 * ```typescript
 * import { sortOrder } from '@yarn-tool/sort-package-json-order';
 *
 * // Use with sort-object-keys2
 * import { sortObjectKeys } from 'sort-object-keys2';
 *
 * const sorted = sortObjectKeys(packageJson, { keys: sortOrder, useSource: true });
 * ```
 */

/**
 * Predefined sort order for package.json keys.
 * package.json 鍵值的預定義排序順序。
 *
 * The order is organized in logical groups:
 * 順序按邏輯分組組織：
 *
 * 1. **Metadata** - $schema, name, displayName, version, private, description, categories, keywords
 * 2. **Links** - homepage, bugs, repository, funding
 * 3. **License & Authors** - license, licenses, qna, author, maintainers, contributors, publisher
 * 4. **Entry Points** - sideEffects, type, imports, exports, main, svelte, umd:main, jsdelivr, unpkg, module, source, jsnext:main, browser, react-native
 * 5. **Types** - types, typesVersions, typings
 * 6. **Resources** - style, example, examplestyle, assets
 * 7. **Binaries** - bin, man, directories, files
 * 8. **Workspaces** - workspaces, binary
 * 9. **Scripts** - scripts, betterScripts
 * 10. **Extension Config** - l10n, contributes, activationEvents
 * 11. **Git Hooks** - husky, simple-git-hooks, pre-commit, commitlint, lint-staged, nano-staged
 * 12. **Tool Config** - config, nodemonConfig, browserify, babel, browserslist, xo, prettier, eslintConfig, eslintIgnore, etc.
 * 13. **Testing** - ava, jest, jest-junit, jest-stare, mocha, nyc, c8, tap, tsd, oclif
 * 14. **Dependencies** - resolutions, overrides, dependencies, devDependencies, dependenciesMeta, peerDependencies, peerDependenciesMeta, optionalDependencies, bundledDependencies, bundleDependencies
 * 15. **Environment** - extensionPack, extensionDependencies, flat, packageManager, engines, engineStrict, devEngines, volta, languageName, os, cpu, preferGlobal
 * 16. **Publish** - publishConfig, icon, badges, galleryBanner, preview, markdown, pnpm
 */
export const sortOrder = [
	// Metadata / 元資料
	'$schema',
	'name',
	'displayName',
	'version',
	'stableVersion',
	'private',
	'description',
	'categories',
	'keywords',

	// Links / 連結
	'homepage',
	'bugs',
	'repository',
	'funding',

	// License & Authors / 授權與作者
	'license',
	'licenses',
	'qna',
	'author',
	'maintainers',
	'contributors',
	'publisher',

	// Entry Points / 入口點
	'sideEffects',
	'type',
	'imports',
	'exports',
	'main',
	'svelte',
	'umd:main',
	'jsdelivr',
	'unpkg',
	'module',
	'source',
	'jsnext:main',
	'browser',
	'react-native',

	// Types / 類型
	'types',
	'typesVersions',
	'typings',

	// Resources / 資源
	'style',
	'example',
	'examplestyle',
	'assets',

	// Binaries / 二進位
	'bin',
	'man',
	'directories',
	'files',

	// Workspaces / 工作區
	'workspaces',
	'binary',

	// Scripts / 腳本
	'scripts',
	'betterScripts',

	// Extension Config / 擴充配置
	'l10n',
	'contributes',
	'activationEvents',

	// Git Hooks / Git 鉤子
	'husky',
	'simple-git-hooks',
	'pre-commit',
	'commitlint',
	'lint-staged',
	'nano-staged',

	// Tool Config / 工具配置
	'config',
	'nodemonConfig',
	'browserify',
	'babel',
	'browserslist',
	'xo',
	'prettier',
	'eslintConfig',
	'eslintIgnore',
	'npmpkgjsonlint',
	'npmPackageJsonLintConfig',
	'npmpackagejsonlint',
	'release',
	'remarkConfig',
	'stylelint',

	// Testing / 測試
	'ava',
	'jest',
	'jest-junit',
	'jest-stare',
	'mocha',
	'nyc',
	'c8',
	'tap',
	'tsd',
	'oclif',

	// Dependencies / 依賴
	'resolutions',
	'overrides',
	'dependencies',
	'devDependencies',
	'dependenciesMeta',
	'peerDependencies',
	'peerDependenciesMeta',
	'optionalDependencies',
	'bundledDependencies',
	'bundleDependencies',
	'extensionPack',
	'extensionDependencies',

	// Environment / 環境
	'flat',
	'packageManager',
	'engines',
	'engineStrict',
	'devEngines',
	'volta',
	'languageName',
	'os',
	'cpu',
	'preferGlobal',

	// Publish / 發布
	'publishConfig',
	'icon',
	'badges',
	'galleryBanner',
	'preview',
	'markdown',
	'pnpm',
] as const;

