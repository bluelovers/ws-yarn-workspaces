"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPkgScripts = defaultPkgScripts;
exports.defaultPkgNotOldExists = defaultPkgNotOldExists;
function defaultPkgScripts() {
    return {
        "test": "yarn run test:jest",
        "coverage": "yarn run test -- --coverage",
        "test:jest": "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */,
        "test:snapshot": "yarn run test -- -u",
        "test:jest:snapshot": "yarn run test:jest -- -u",
        "test:jest:coverage": "yarn run test:jest -- --coverage",
        "test:tsd": "ynpx tsd",
        "tsc:showConfig": "ynpx get-current-tsconfig -p",
    };
}
function defaultPkgNotOldExists() {
    return {
        ...defaultPkgScripts(),
        "test:mocha": "ynpx --quiet -p ts-node -p mocha mocha -- --require ts-node/register \"!(node_modules)/**/*.{test,spec}.{ts,tsx}\"",
        "test:tsdx": "ynpx @bluelovers/tsdx test --passWithNoTests",
        "build:dts:bundle": "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle" /* EnumScriptsEntry.BUILD_DTS_BUNDLE */,
        "build:dts:copy": "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts",
        "build:dts:tsc:emit": "tsc --emitDeclarationOnly --declaration --noEmit false",
        "build:dts:tsc": "yarn run build:dts:tsc:emit && yarn run build:dts:copy",
        "build:tsdx": "ynpx @bluelovers/tsdx build --target node --name index",
        "build:microbundle": "ynpx microbundle --target node",
        "lint": "yarn run lint:eslint",
        "lint:eslint": "ynpx eslint --ext .ts,.tsx,.mts,.cts ./",
        "review": "yarn run review:coverage",
        "review:test": "yarn run lint && yarn run test",
        "review:coverage": "yarn run lint && yarn run coverage",
        "sort-package-json": "yarn-tool sort",
        "tsc:default": "tsc -p tsconfig.json",
        "tsc:esm": "tsc -p tsconfig.esm.json",
    };
}
//# sourceMappingURL=pkg-scripts.js.map