"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSharedRootScripts = void 0;
function defaultSharedRootScripts() {
    return {
        "ci:install": "yarn install --frozen-lockfile && yarn add -W typescript@next jest ts-jest ts-node ynpx lerna yarn-tool",
        "test:jest:clearCache": "jest --clearCache",
    };
}
exports.defaultSharedRootScripts = defaultSharedRootScripts;
//# sourceMappingURL=shared-root-scripts.js.map