/**
 * 工作區根目錄腳本預設 / Workspace Root Scripts Preset
 *
 * 提供 Yarn/Lerna 工作區根目錄的預設 npm scripts
 * Provides default npm scripts for Yarn/Lerna workspace root
 */
import { EnumScriptsEntry } from '../../field/scripts';
/**
 * 產生「全部執行」與「僅變更執行」腳本對 / Generate "all" and "since" script pairs
 *
 * 為指定腳本名稱產生對應的 `:all`（全部工作區）與 `:since`（僅變更）版本
 * Generates corresponding `:all` (all workspaces) and `:since` (changed only) versions
 *
 * @template T - 基礎腳本名稱 / Base script name
 * @param script - 基礎腳本名稱 / Base script name
 * @returns 包含 all 與 since 變體的腳本物件 / Object containing all and since variants
 *
 * @example
 * ```typescript
 * _runAllOrSince('test')
 * // 返回: { 'test:all': 'yarn-tool ws run test --concurrency 1', 'test:since': 'node --run test:all -- --since' }
 * ```
 */
export declare function _runAllOrSince<T extends string>(script: T): ({ [x in `${T}:all`]: string; } & { [y in `${T}:since`]: string; });
/**
 * 工作區根目錄預設腳本 / Default scripts for workspace root
 *
 * 適用於 monorepo 工作區根目錄的完整管理腳本集合
 * Complete management script set for monorepo workspace root
 *
 * @returns 包含工作區管理腳本的物件 / Object containing workspace management scripts
 *
 * 核心功能 / Core features:
 * - 跨工作區腳本執行（全部或僅變更）/ Cross-workspace script execution (all or changed only)
 * - Lerna 發布流程 / Lerna publishing workflow
 * - 發布前檢查與準備 / Pre-publish checks and preparation
 * - 相依工作區連結修復 / Dependency workspace links fixing
 * - 統一依賴更新 / Unified dependency updates
 * - 發布後變更日誌更新 / Post-publish changelog updates
 *
 * 包含腳本 / Includes scripts:
 * - test: 執行變更工作區測試 / Run changed workspaces tests
 * - test:all|test:since: 全部/變更測試 / All/changed tests
 * - test:tsd:all|test:tsd:since: 型別檢查 / Type checking
 * - test:snapshot:all|test:snapshot:since: 快照更新 / Snapshot updates
 * - build:all|build:since: 建構 / Build
 * - review:all|review:since: 審查 / Review
 * - coverage:all|coverage:since: 覆蓋率 / Coverage
 * - lint:all|lint:since: 檢查 / Lint
 * - preversion: 版本更新前測試 / Pre-version test
 * - postversion: 版本更新後修復 / Post-version fix
 * - lerna:publish: Lerna 發布 / Lerna publish
 * - lerna:publish:yes|lerna:publish:yes:force: 確認發布 / Confirmed publish
 * - lerna:publish:yes:patch|minor|major: 特定版本發布 / Specific version publish
 * - prepublishOnly:root: 發布前檢查與修復 / Pre-publish checks and fixes
 * - prepublishOnly:lockfile: 鎖定檔同步 / Lockfile sync
 * - prepublishOnly:check-bin: 二進位檔檢查 / Binary check
 * - prepare:fix-ws-links: 工作區連結修復 / Workspace links fix
 * - prepublishOnly:update: 發布前更新 / Pre-publish update
 * - ncu:root|ncu:ws: 根目錄/工作區依賴更新 / Root/workspace dependency updates
 * - sort-package-json:root|sort-package-json:ws: package.json 排序 / package.json sorting
 * - postpublishOnly: 發布後執行 / Post-publish execution
 * - postpublishOnly:ws-root-changelog: 根目錄變更日誌更新 / Root changelog update
 * - tsc:showConfig: TypeScript 設定顯示 / TypeScript config display
 */
export declare function defaultWorkspaceRootScripts(): {
    /** 發布前檢查與修復 / Pre-publish checks and fixes */
    "prepublishOnly:root": string;
    /** 鎖定檔同步 / Lockfile sync */
    "prepublishOnly:lockfile": string;
    /** 二進位檔檢查 / Binary check */
    "prepublishOnly:check-bin": string;
    /** 工作區連結修復 / Workspace links fix */
    "prepare:fix-ws-links": string;
    /** 發布前更新 / Pre-publish update */
    "prepublishOnly:update": string;
    /** 依賴更新 / Dependency updates */
    ncu: string;
    "ncu:root": string;
    "ncu:ws": string;
    /** package.json 排序 / package.json sorting */
    "sort-package-json": string;
    "sort-package-json:root": string;
    "sort-package-json:ws": string;
    /** 發布後執行 / Post-publish execution */
    postpublishOnly: string;
    /** 根目錄變更日誌更新 / Root changelog update */
    "postpublishOnly:ws-root-changelog": string;
    /** TypeScript 設定顯示 / TypeScript config display */
    "tsc:showConfig": string;
    /** 版本更新前測試 / Test before version bump */
    preversion: EnumScriptsEntry;
    /** 版本更新後修復 / Fix after version bump */
    postversion: string;
    /** Lerna 發布 / Lerna publish */
    "lerna:publish": string;
    "lint:all": string;
    "lint:since": string;
    "coverage:all": string;
    "coverage:since": string;
    "review:all": string;
    "review:since": string;
    "build:all": string;
    "build:since": string;
    "test:snapshot:all": string;
    "test:snapshot:since": string;
    "test:tsd:all": string;
    "test:tsd:since": string;
    "test:all": string;
    "test:since": string;
    test: string;
    "ci:install": string;
    "test:jest:clearCache": string;
    "install:resetLockfile": string;
    "install:frozenLockfile": string;
    "ws:fix-all": string;
    "ws:fix-all:resetStaticFiles": string;
};
