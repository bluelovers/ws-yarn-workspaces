"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTsconfig = exports.getDefaultPackageJson = void 0;
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy");
function getDefaultPackageJson(name) {
    let json = {
        "name": name,
        "version": "1.0.0",
        "private": true,
        "packageManager": "yarn@1.22.19",
        "workspaces": [
            "packages/*",
        ],
        keywords: [
            "create-by-yarn-tool",
        ],
        "scripts": (0, ws_root_scripts_1.defaultWorkspaceRootScripts)(),
        "dependencies": {
            "ts-type": ">=2",
            "tslib": ">=2",
        },
        "devDependencies": {
            "@types/jest": "^28.1.6",
            "@bluelovers/tsconfig": "^1.0.30",
            "@types/node": "*",
            "@yarn-tool/ws-find-up-paths": "*",
        },
        "peerDependencies": {
            "lerna": "*",
            "yarn": "*",
            "ynpx": "*",
            "typescript": "*",
            "ts-node": "*",
            "@yarn-tool/require-resolve": "*",
            "yarn-tool": "*",
            "@bluelovers/conventional-changelog-bluelovers": "*",
        },
        "resolutions": {},
    };
    (0, dummy_1.fillDummyScripts)(json.scripts, 'workspaces');
    return json;
}
exports.getDefaultPackageJson = getDefaultPackageJson;
function getDefaultTsconfig() {
    return {
        extends: "@bluelovers/tsconfig/esm/mapfile.json",
    };
}
exports.getDefaultTsconfig = getDefaultTsconfig;
//# sourceMappingURL=index.js.map