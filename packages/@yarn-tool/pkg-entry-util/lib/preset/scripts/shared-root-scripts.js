"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSharedRootScripts = void 0;
function defaultSharedRootScripts() {
    return {
        "ci:install": `yarn install --frozen-lockfile && yarn add -W ${[
            "yarn-tool",
            "lerna@6",
            "ynpx",
            "ts-node",
            "ts-jest",
            "jest",
            "typescript@next",
            '@bluelovers/jest-config',
            'tsx',
        ].join(" ")}`,
        "test:jest:clearCache": "jest --clearCache",
        "install:resetLockfile": "yarn-tool install --reset-lockfile",
        "install:frozenLockfile": "yarn-tool install --frozen-lockfile",
        "ws:fix-all": "yarn-tool fix-all  --overwriteHostedGitInfo",
        "ws:fix-all:resetStaticFiles": "yarn run ws:fix-all -- --resetStaticFiles",
    };
}
exports.defaultSharedRootScripts = defaultSharedRootScripts;
//# sourceMappingURL=shared-root-scripts.js.map