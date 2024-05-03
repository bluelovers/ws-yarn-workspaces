"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPackageJson = getDefaultPackageJson;
exports.getDefaultTsconfig = getDefaultTsconfig;
const ws_root_scripts_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts");
const dummy_1 = require("@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy");
const package_demo_json_1 = require("./package.demo.json");
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
        dependencies: package_demo_json_1.dependencies,
        devDependencies: package_demo_json_1.devDependencies,
        peerDependencies: package_demo_json_1.peerDependencies,
        "resolutions": {},
    };
    (0, dummy_1.fillDummyScripts)(json.scripts, 'workspaces');
    return json;
}
function getDefaultTsconfig() {
    return {
        extends: "@bluelovers/tsconfig/esm/mapfile.json",
    };
}
//# sourceMappingURL=index.js.map