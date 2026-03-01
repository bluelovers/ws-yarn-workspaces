/**
 * 套件腳本預設 / Package Scripts Preset
 *
 * 提供標準套件（非根目錄、非工作區根目錄）的預設 npm scripts
 * Provides default npm scripts for standard packages (non-root, non-workspace-root)
 */

import { EnumScriptsEntry } from '../../field/scripts';

/**
 * 標準套件預設腳本 / Default scripts for standard packages
 *
 * 適用於一般套件專案的常用測試與建構腳本
 * Common test and build scripts for general package projects
 *
 * @returns 包含標準腳本的物件 / Object containing standard scripts
 *
 * 包含腳本 / Includes scripts:
 * - test: 執行 Jest 測試 / Run Jest tests
 * - coverage: 執行測試並產生覆蓋率報告 / Run tests with coverage
 * - test:jest: Jest 測試命令 / Jest test command
 * - test:snapshot: 更新測試快照 / Update test snapshots
 * - test:jest:snapshot: 更新 Jest 快照 / Update Jest snapshots
 * - test:jest:coverage: Jest 測試含覆蓋率 / Jest test with coverage
 * - test:tsd: 執行 TypeScript 型別檢查 / Run TypeScript type checking
 * - tsc:showConfig: 顯示 TypeScript 設定 / Show TypeScript config
 */
export function defaultPkgScripts()
{
	return {
		"test": "node --run test:jest",
		"coverage": "yarn run test -- --coverage",
		"test:jest": EnumScriptsEntry.JEST_TEST,
		"test:snapshot": "yarn run test -- -u",
		"test:jest:snapshot": "node --run test:jest -- -u",
		"test:jest:coverage": "node --run test:jest -- --coverage",
		"test:tsd": "ynpx tsd",
		"tsc:showConfig": "ynpx get-current-tsconfig -p",
	}
}

/**
 * 新套件預設腳本 / Default scripts for new packages
 *
 * 適用於初始化新套件時的完整腳本集合
 * Complete set of scripts for initializing new packages
 *
 * @returns 包含完整開發腳本的物件 / Object containing complete development scripts
 *
 * 額外包含腳本 / Additional scripts:
 * - test:mocha: Mocha 測試執行 / Mocha test execution
 * - test:tsdx: TSDX 測試 / TSDX testing
 * - build:dts:bundle: 建構型別宣告檔 / Build type declaration files
 * - build:dts:copy: 複製型別宣告檔 / Copy type declaration files
 * - build:dts:tsc:emit: TypeScript 型別輸出 / TypeScript type emit
 * - build:dts:tsc: 完整型別建構 / Complete type build
 * - build:tsdx: TSDX 建構 / TSDX build
 * - build:microbundle: Microbundle 建構 / Microbundle build
 * - lint: ESLint 檢查 / ESLint check
 * - lint:eslint: ESLint 執行 / ESLint execution
 * - review: 完整審查流程 / Complete review process
 * - review:test: 測試審查 / Test review
 * - review:coverage: 覆蓋率審查 / Coverage review
 * - sort-package-json: 排序 package.json / Sort package.json
 * - tsc:default: 預設 TypeScript 編譯 / Default TypeScript compilation
 * - tsc:esm: ESM TypeScript 編譯 / ESM TypeScript compilation
 */
export function defaultPkgNotOldExists()
{
	return {
		...defaultPkgScripts(),
		"test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
		"test:tsdx": "ynpx @bluelovers/tsdx test --passWithNoTests",
		"build:dts:bundle": EnumScriptsEntry.BUILD_DTS_BUNDLE,
		"build:dts:copy": "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts",
		"build:dts:tsc:emit": "tsc --emitDeclarationOnly --declaration --noEmit false",
		"build:dts:tsc": "node --run build:dts:tsc:emit && node --run build:dts:copy",
		"build:tsdx": "ynpx @bluelovers/tsdx build --target node --name index",
		"build:microbundle": "ynpx microbundle --target node",
		"lint": "node --run lint:eslint",
		"lint:eslint": "ynpx eslint --ext .ts,.tsx,.mts,.cts ./",
		"review": "node --run review:coverage",
		"review:test": "yarn run lint && yarn run test",
		"review:coverage": "yarn run lint && yarn run coverage",
		"sort-package-json": "yarn-tool sort",
		"tsc:default": "tsc -p tsconfig.json",
		"tsc:esm": "tsc -p tsconfig.esm.json",
	}
}
