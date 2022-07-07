"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWorkspaceRootScripts = void 0;
const shared_root_scripts_1 = require("./shared-root-scripts");
function defaultWorkspaceRootScripts() {
    return {
        ...(0, shared_root_scripts_1.defaultSharedRootScripts)(),
        "test:all": "lerna run test --concurrency 1",
        "build:all": "lerna run build --concurrency 1",
        "review:all": "lerna run review --concurrency 1",
        "coverage:all": "lerna run coverage --concurrency 1",
        "lint:all": "lerna run lint --concurrency 1",
        "preversion": "yt ws run test",
        "postversion": "yt fix-all",
        "lerna:publish": "yarn run prepublishOnly:root && lerna publish && yarn run postpublishOnly",
        "lerna:publish:yes": "yarn run prepublishOnly:root && lerna publish --yes --bump patch && yarn run postpublishOnly",
        "prepublishOnly:root": "yarn run prepublishOnly:check-bin && yarn run prepare:fix-ws-links",
        "prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
        "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
        "prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
        "prepublishOnly:update": "yarn run ncu && yarn run sort-package-json",
        "ncu": "yarn run ncu:root && yarn run ncu:ws",
        "ncu:root": "yarn-tool ncu -u",
        "ncu:ws": "yarn-tool ws exec yarn-tool ncu -- -u",
        "sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
        "sort-package-json:root": "yarn-tool sort",
        "sort-package-json:ws": "yarn-tool ws sort",
        "postpublishOnly": "yarn run postpublishOnly:ws-root-changelog & echo postpublishOnly",
        "postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git add ./CHANGELOG.md & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
        "test": "yarn-tool ws run test",
        "install:reset-lockfile": "yarn-tool install --reset-lockfile",
        "ws:fix-all": "yarn-tool fix-all  --overwriteHostedGitInfo",
        "tsc:showConfig": "ynpx get-current-tsconfig -p",
    };
}
exports.defaultWorkspaceRootScripts = defaultWorkspaceRootScripts;
//# sourceMappingURL=ws-root-scripts.js.map