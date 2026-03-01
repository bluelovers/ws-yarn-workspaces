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
export declare function defaultPkgScripts(): {
    test: string;
    coverage: string;
    "test:jest": EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:jest:coverage": string;
    "test:tsd": string;
    "tsc:showConfig": string;
};
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
export declare function defaultPkgNotOldExists(): {
    "test:mocha": string;
    "test:tsdx": string;
    "build:dts:bundle": EnumScriptsEntry;
    "build:dts:copy": string;
    "build:dts:tsc:emit": string;
    "build:dts:tsc": string;
    "build:tsdx": string;
    "build:microbundle": string;
    lint: string;
    "lint:eslint": string;
    review: string;
    "review:test": string;
    "review:coverage": string;
    "sort-package-json": string;
    "tsc:default": string;
    "tsc:esm": string;
    test: string;
    coverage: string;
    "test:jest": EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:jest:coverage": string;
    "test:tsd": string;
    "tsc:showConfig": string;
};
