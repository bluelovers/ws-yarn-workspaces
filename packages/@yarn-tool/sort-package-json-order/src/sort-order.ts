
/**
 * package.json 頂層鍵的預定義排序順序 / Predefined sort order for package.json top-level keys
 *
 * 以純陣列（而非物件）表示順序：陣列的先後即代表鍵的先後，可直接交給
 * sort-object-keys2、sort-package-json 的 keys / sortOrder 選項使用。
 * 未列於此清單的鍵不會排進任何已知群組，其相對次序由排序工具決定，
 * 因此新增或刪除本清單項目是唯一會改變排序結果的方式。
 *
 * The order is a plain array (not an object): array position equals key priority,
 * ready to be passed to the `keys` / `sortOrder` option of sort-object-keys2 and
 * sort-package-json. Keys absent from this list join no known group and their
 * relative order is decided by the sorting utility, so editing this list is the
 * only way to change the result.
 *
 * 群組邊界的註解與 README 的 Sort Order 章節一一對應，修改時請同步更新兩處。
 * The group comments mirror the README "Sort Order" section; keep both in sync.
 *
 * @module @yarn-tool/sort-package-json-order/sort-order
 *
 * @example
 * ```typescript
 * import { sortOrder } from '@yarn-tool/sort-package-json-order';
 *
 * const sorted = sortObjectKeys(packageJson, { keys: sortOrder, useSource: true });
 * ```
 */
export const sortOrder = [
	/**
	 * Metadata / 中繼資料：套件識別與說明，放在最前面便於閱讀
	 * Metadata: package identity and description, kept first for readability
	 */
	'$schema',
	'name',
	'displayName',
	'version',
	'stableVersion',
	'private',
	'description',
	'categories',
	'keywords',
	/**
	 * Links / 連結：專案相關網址，緊接在中繼資料之後
	 * Links: project related URLs, placed right after the metadata
	 */
	'homepage',
	'bugs',
	'repository',
	'funding',
	/**
	 * License & Authors / 授權與作者：法律與責任歸屬資訊
	 * License & authors: legal and attribution information
	 */
	'license',
	'licenses',
	'qna',
	'author',
	'maintainers',
	'contributors',
	'publisher',
	/**
	 * Entry Points / 進入點：各種模組解析入口，依 Node.js 常見優先度排列
	 * Entry points: module resolution entries, ordered by common Node.js precedence
	 */
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
	/**
	 * Types / 型別定義：與型別解析相關的鍵
	 * Types: keys related to type resolution
	 */
	'types',
	'typesVersions',
	'typings',
	/**
	 * Resources / 資源：樣式、範例與附帶檔案
	 * Resources: styles, examples and bundled assets
	 */
	'style',
	'example',
	'examplestyle',
	'assets',
	/**
	 * Binaries / 可執行檔：對外暴露的指令與手冊
	 * Binaries: exposed commands and manuals
	 */
	'bin',
	'man',
	'directories',
	'files',
	/**
	 * Workspaces / 工作區：monorepo 相關設定
	 * Workspaces: monorepo related settings
	 */
	'workspaces',
	'binary',
	/**
	 * Scripts / 腳本：npm scripts 與其替代實作（betterScripts、wireit）
	 * Scripts: npm scripts and their alternatives (betterScripts, wireit)
	 */
	'scripts',
	'betterScripts',
	'wireit',
	/**
	 * Extension Config / 擴充功能設定：VS Code 等擴充環境的設定鍵
	 * Extension config: settings for extension hosts such as VS Code
	 */
	'l10n',
	'contributes',
	'activationEvents',
	/**
	 * Git Hooks / 版本控制鉤子：提交流程相關工具設定
	 * Git hooks: commit workflow tool settings
	 */
	'husky',
	'simple-git-hooks',
	'pre-commit',
	'commitlint',
	'lint-staged',
	'nano-staged',
	/**
	 * Tool Config / 工具設定：編譯器、格式化、檢查工具的設定檔
	 * Tool config: compiler, formatter and linter settings
	 */
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
	/**
	 * Testing / 測試：各測試框架與覆蓋率工具的設定
	 * Testing: settings for test frameworks and coverage tools
	 */
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
	/**
	 * Dependencies / 相依套件：依賴宣告與版本覆寫，放在靠後位置以利 diff 閱讀
	 * Dependencies: dependency declarations and version overrides, kept toward the
	 * end so dependency diffs stay easy to read
	 */
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
	/**
	 * Environment / 環境：執行環境與套件管理器的約束
	 * Environment: constraints on the runtime and package manager
	 */
	'extensionPack',
	'extensionDependencies',
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
	/**
	 * Publish / 發布：僅在發布流程生效的設定，固定為最後一組
	 * Publish: settings that only take effect when publishing, always the last group
	 */
	'publishConfig',
	'icon',
	'badges',
	'galleryBanner',
	'preview',
	'markdown',
	'pnpm',
] as const;

