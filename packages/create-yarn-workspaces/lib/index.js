"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTsconfig = exports.getDefaultPackageJson = void 0;
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/dummy");
function getDefaultPackageJson(name) {
    let json = {
        "name": name,
        "version": "1.0.0",
        "private": true,
        "packageManager": "yarn@^1.22.11",
        "workspaces": [
            "packages/*",
        ],
        keywords: [
            "create-by-yarn-tool",
        ],
        "scripts": (0, ws_root_scripts_1.defaultWorkspaceRootScripts)(),
        "dependencies": {
            "ts-type": "^1.2.32",
            "tslib": "^2.3.1",
        },
        "devDependencies": {
            "@types/jest": "^27.4.1",
            "@bluelovers/tsconfig": "^1.0.28",
            "@types/node": "*",
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