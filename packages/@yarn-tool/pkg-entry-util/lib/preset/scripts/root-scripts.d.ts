/**
 * 根目錄套件腳本預設 / Root Package Scripts Preset
 *
 * 提供根目錄套件（非工作區）的預設 npm scripts
 * Provides default npm scripts for root packages (non-workspace)
 */
/**
 * 根目錄套件預設腳本 / Default scripts for root packages
 *
 * 適用於 monorepo 根目錄或獨立套件的發布與版本管理
 * Suitable for monorepo root or standalone package publishing and version management
 *
 * @returns 包含根目錄管理腳本的物件 / Object containing root management scripts
 *
 * 核心功能 / Core features:
 * - 版本號遞增與發布 / Version bumping and publishing
 * - npm 發布流程 / npm publishing workflow
 * - 發布後自動化（changelog、git 提交與標籤）/ Post-publish automation (changelog, git commit, tags)
 * - 依賴更新與清理 / Dependency updates and cleanup
 *
 * 包含腳本 / Includes scripts:
 * - prepublishOnly:check-bin: 發布前檢查二進位檔 / Check binaries before publish
 * - version:bump: 版本號遞增 / Version bump
 * - npm:publish: npm 發布 / npm publish
 * - npm:publish:bump: 遞增並發布 / Bump and publish
 * - version:bump:patch|minor|major|prerelease: 特定版本遞增 / Specific version bumps
 * - npm:publish:bump:patch|minor|major|prerelease: 特定版本發布 / Specific version publishing
 * - postpublish:git:commit: 發布後提交 / Post-publish git commit
 * - postpublish:git:tag: 發布後標籤 / Post-publish git tag
 * - postpublish:changelog: 更新變更日誌 / Update changelog
 * - postpublish:git:push: 推送標籤 / Push tags
 * - postpublish: 完整發布後流程 / Complete post-publish workflow
 * - ncu: 更新依賴 / Update dependencies
 * - pnpm:dedupe: 清理重複依賴 / Deduplicate dependencies
 * - ncu:pnpm: pnpm 更新 / pnpm update
 */
export declare function defaultRootScripts(): {
    "postpublish:git:commit": string;
    "postpublish:git:tag": string;
    "postpublish:changelog": string;
    "postpublish:git:push": string;
    postpublish: string;
    ncu: string;
    "pnpm:dedupe": string;
    "ncu:pnpm": string;
    "prepublishOnly:check-bin": string;
    "version:bump": string;
    "npm:publish": string;
    "npm:publish:bump": string;
    "ci:install": string;
    "test:jest:clearCache": string;
    "install:resetLockfile": string;
    "install:frozenLockfile": string;
    "ws:fix-all": string;
    "ws:fix-all:resetStaticFiles": string;
    test: string;
    coverage: string;
    "test:jest": import("../..").EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:jest:coverage": string;
    "test:tsd": string;
    "tsc:showConfig": string;
};
