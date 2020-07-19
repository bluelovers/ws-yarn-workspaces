"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTsconfig = exports.getDefaultPackageJson = void 0;
function getDefaultPackageJson(name) {
    return {
        "name": name,
        "version": "1.0.0",
        "private": true,
        "workspaces": [
            "packages/*",
        ],
        "scripts": {
            "preversion": "echo preversion",
            "lerna:publish": "lerna publish",
            "lerna:publish:yes": "lerna publish --yes --bump patch && yarn run postpublishOnly",
            "prepublishOnly:lockfile": "ynpx --quiet sync-lockfile",
            "prepublishOnly:check-bin": "ynpx --quiet @yarn-tool/check-pkg-bin",
            "prepare:fix-ws-links": "ynpx --quiet @yarn-tool/fix-ws-links",
            "ncu": "yarn run ncu:root && yarn run ncu:ws",
            "ncu:root": "yarn-tool ncu -- -u",
            "ncu:ws": "yarn-tool ws exec yarn-tool ncu -- -u",
            "sort-package-json": "yarn run sort-package-json:root && yarn run sort-package-json:ws",
            "sort-package-json:root": "yarn-tool sort",
            "sort-package-json:ws": "yarn-tool ws exec yarn-tool sort",
            "postpublishOnly": "echo postpublishOnly",
            "test": "yarn-tool ws run test",
        },
        "devDependencies": {
            "@bluelovers/tsconfig": "^1.0.19",
            "@types/node": "*",
        },
        "peerDependencies": {
            "lerna": "*",
            "yarn": "*",
            "ynpx": "*",
            "@bluelovers/conventional-changelog-bluelovers": "*",
        },
        "resolutions": {},
    };
}
exports.getDefaultPackageJson = getDefaultPackageJson;
function getDefaultTsconfig() {
    return {
        extends: "@bluelovers/tsconfig/esm/mapfile.json",
    };
}
exports.getDefaultTsconfig = getDefaultTsconfig;
//# sourceMappingURL=index.js.map