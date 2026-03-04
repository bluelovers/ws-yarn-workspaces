"use strict";
/**
 * 工作區根目錄腳本預設 / Workspace Root Scripts Preset
 *
 * 提供 Yarn/Lerna 工作區根目錄的預設 npm scripts
 * Provides default npm scripts for Yarn/Lerna workspace root
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._runAllOrSince = _runAllOrSince;
exports.defaultWorkspaceRootScripts = defaultWorkspaceRootScripts;
const shared_root_scripts_1 = require("./shared-root-scripts");
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
function _runAllOrSince(script) {
    const all = `${script}:all`;
    const since = `${script}:since`;
    return {
        [all]: `yarn-tool ws run ${script} --concurrency 1`,
        [since]: `node --run ${script}:all -- --since`,
    };
}
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
function defaultWorkspaceRootScripts() {
    /**
     * 產生 Lerna 版本遞增與發布命令 / Generate Lerna version bump and publish command
     *
     * @param bump - 版本遞增類型（patch|minor|major）/ Version bump type
     * @returns 組合命令字串 / Combined command string
     */
    const bumpVersion = (bump) => {
        return [
            `node --run prepublishOnly:root`,
            `lerna publish --no-private` + (bump ? ` --yes --bump ${bump}` : ''),
            `yarn run postpublishOnly`,
        ].join(' && ');
    };
    return {
        ...(0, shared_root_scripts_1.defaultSharedRootScripts)(),
        "test": "node --run test:since",
        // 動態產生 all/since 腳本對 / Dynamically generate all/since script pairs
        ..._runAllOrSince('test'),
        ..._runAllOrSince('test:tsd'),
        ..._runAllOrSince('test:snapshot'),
        ..._runAllOrSince('build'),
        ..._runAllOrSince('review'),
        ..._runAllOrSince('coverage'),
        ..._runAllOrSince('lint'),
        /** 版本更新前測試 / Test before version bump */
        "preversion": "yarn run test" /* EnumScriptsEntry.preversion */,
        /** 版本更新後修復 / Fix after version bump */
        "postversion": "yarn-tool fix-all",
        /** Lerna 發布 / Lerna publish */
        "lerna:publish": bumpVersion(),
        // 動態產生各類版本發布腳本 / Dynamically generate version publish scripts
        ...[
            'patch',
            'minor',
            'major',
        ].reduce((a, bump, idx) => {
            if (idx === 0) {
                a[`lerna:publish:yes`] = `node --run lerna:publish:yes:${bump} --`;
                a[`lerna:publish:yes:force`] = `node --run lerna:publish:yes:${bump} -- --force-publish`;
            }
            a[`lerna:publish:yes:${bump}`] = bumpVersion(bump);
            return a;
        }, {}),
        /** 發布前檢查與修復 / Pre-publish checks and fixes */
        "prepublishOnly:root": "node --run prepublishOnly:check-bin && node --run prepare:fix-ws-links",
        /** 鎖定檔同步 / Lockfile sync */
        "prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
        /** 二進位檔檢查 / Binary check */
        "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
        /** 工作區連結修復 / Workspace links fix */
        "prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
        /** 發布前更新 / Pre-publish update */
        "prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
        /** 依賴更新 / Dependency updates */
        "ncu": "node --run ncu:ws",
        "ncu:root": "yarn-tool ncu -u",
        "ncu:ws": "yarn-tool ncu -u --AA",
        /** package.json 排序 / package.json sorting */
        "sort-package-json": "node --run sort-package-json:root && node --run sort-package-json:ws",
        "sort-package-json:root": "yarn-tool sort",
        "sort-package-json:ws": "yarn-tool ws sort",
        /** 發布後執行 / Post-publish execution */
        "postpublishOnly": "node --run postpublishOnly:ws-root-changelog & echo postpublishOnly",
        /** 根目錄變更日誌更新 / Root changelog update */
        "postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git add ./CHANGELOG.md & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
        /** TypeScript 設定顯示 / TypeScript config display */
        "tsc:showConfig": "ynpx get-current-tsconfig -p",
    };
}
//# sourceMappingURL=ws-root-scripts.js.map