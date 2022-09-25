"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSharedRootScripts = void 0;
function defaultSharedRootScripts() {
    return {
        "ci:install": `yarn install --frozen-lockfile && yarn add -W ${[
            "yarn-tool",
            "lerna",
            "ynpx",
            "ts-node",
            "ts-jest",
            "jest",
            "typescript@next",
        ].join(" ")}`,
        "test:jest:clearCache": "jest --clearCache",
        "install:resetLockfile": "yarn-tool install --reset-lockfile",
        "install:frozenLockfile": "yarn-tool install --frozen-lockfile",
    };
}
exports.defaultSharedRootScripts = defaultSharedRootScripts;
//# sourceMappingURL=shared-root-scripts.js.map