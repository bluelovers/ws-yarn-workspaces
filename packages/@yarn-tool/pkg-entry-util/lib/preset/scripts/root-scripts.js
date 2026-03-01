"use strict";
/**
 * 根目錄套件腳本預設 / Root Package Scripts Preset
 *
 * 提供根目錄套件（非工作區）的預設 npm scripts
 * Provides default npm scripts for root packages (non-workspace)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRootScripts = defaultRootScripts;
const shared_root_scripts_1 = require("./shared-root-scripts");
const pkg_scripts_1 = require("./pkg-scripts");
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
function defaultRootScripts() {
    /**
     * 產生版本遞增與發布命令 / Generate version bump and publish command
     *
     * @param bump - 版本遞增類型 / Version bump type
     * @returns 組合命令字串 / Combined command string
     */
    const bumpVersion = (bump) => {
        return [
            `node --run version:bump` + (bump ? ` -- --bump ${bump}` : ''),
            `npm publish`,
        ].join(' && ');
    };
    return {
        ...(0, pkg_scripts_1.defaultPkgScripts)(),
        ...(0, shared_root_scripts_1.defaultSharedRootScripts)(),
        "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
        "version:bump": "yarn-tool version",
        "npm:publish": "npm publish",
        "npm:publish:bump": bumpVersion(),
        // 動態產生各類版本遞增腳本 / Dynamically generate version bump scripts
        ...[
            'patch',
            'minor',
            'major',
            'prerelease',
        ].reduce((a, bump, idx) => {
            a[`version:bump:${bump}`] = `node --run version:bump` + (bump ? ` -- --bump ${bump}` : '');
            a[`npm:publish:bump:${bump}`] = bumpVersion(bump);
            return a;
        }, {}),
        "postpublish:git:commit": `git commit -m "chore(release): publish" . & echo postpublish:git:commit`,
        "postpublish:git:tag": `ynpx --quiet @yarn-tool/tag`,
        "postpublish:changelog": `ynpx --quiet @yarn-tool/changelog && git add ./CHANGELOG.md`,
        "postpublish:git:push": `git push --follow-tags`,
        "postpublish": `node --run postpublish:changelog && node --run postpublish:git:commit && node --run postpublish:git:tag && node --run postpublish:git:push`,
        "ncu": "yarn-tool ncu -u",
        "pnpm:dedupe": "pnpm dedupe",
        "ncu:pnpm": "pnpm update",
    };
}
//# sourceMappingURL=root-scripts.js.map