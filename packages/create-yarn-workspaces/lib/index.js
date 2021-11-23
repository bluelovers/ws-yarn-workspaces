"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultTsconfig = exports.getDefaultPackageJson = void 0;
function getDefaultPackageJson(name) {
    let json = {
        "name": name,
        "version": "1.0.0",
        "private": true,
        "packageManager": "yarn@^1.22.11",
        "workspaces": [
            "packages/*",
        ],
        keywords: [],
        "scripts": {
            "test:all": "lerna run test --concurrency 1",
            "build:all": "lerna run build --concurrency 1",
            "preversion": "yt ws run test",
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
            "postpublishOnly:ws-root-changelog": "ynpx ws-root-changelog & git commit ./CHANGELOG.md -m \"chore(changelog): update changelog toc in workspaces root\" & echo update changelog toc in workspaces root",
            "test": "yarn-tool ws run test",
            "install:reset-lockfile": "yarn-tool install --reset-lockfile",
            "tsc:showConfig": "ynpx get-current-tsconfig -p",
        },
        "dependencies": {
            "ts-type": "^1.2.32",
            "tslib": "^2.3.0",
        },
        "devDependencies": {
            "@types/jest": "^26.0.24",
            "@bluelovers/tsconfig": "^1.0.20",
            "@types/node": "*",
        },
        "peerDependencies": {
            "lerna": "*",
            "yarn": "*",
            "ynpx": "*",
            "@yarn-tool/require-resolve": "*",
            "yarn-tool": "*",
            "@bluelovers/conventional-changelog-bluelovers": "*",
        },
        "resolutions": {},
    };
    [
        'preversion',
        'version',
        'prepublishOnly',
        'postversion',
        'publish',
        'prepublish',
        'postpublish',
        'postpublishOnly',
    ].forEach(k => {
        var _a;
        var _b;
        (_a = (_b = json.scripts)[k]) !== null && _a !== void 0 ? _a : (_b[k] = `echo workspaces ${k}`);
    });
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