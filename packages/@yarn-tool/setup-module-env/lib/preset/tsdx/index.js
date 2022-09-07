"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.defaultCopyStaticFilesTsdx = exports.updatePackageJson = void 0;
const scripts_1 = require("@yarn-tool/pkg-entry-util/lib/field/scripts");
const dot_values2_1 = require("dot-values2");
function updatePackageJson(pkg, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    if ((0, scripts_1.scriptsEntryIsNoTestSpecified)(pkg.scripts["test"])) {
        pkg.scripts["test"] = void 0;
    }
    (_b = (_u = pkg.scripts)["test"]) !== null && _b !== void 0 ? _b : (_u["test"] = "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */);
    (_c = (_v = pkg.scripts)["posttest"]) !== null && _c !== void 0 ? _c : (_v["posttest"] = "yarn run build");
    if (!((_d = pkg.scripts["build"]) === null || _d === void 0 ? void 0 : _d.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    (_e = (_w = pkg.scripts)["build:dts:bundle"]) !== null && _e !== void 0 ? _e : (_w["build:dts:bundle"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle" /* EnumScriptsEntry.BUILD_DTS_BUNDLE */);
    (_f = (_x = pkg.scripts)["build:tsdx"]) !== null && _f !== void 0 ? _f : (_x["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node");
    (_g = (_y = pkg.scripts)["build:dts:copy"]) !== null && _g !== void 0 ? _g : (_y["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_h = (_z = pkg.scripts)["build:dts:tsc:emit"]) !== null && _h !== void 0 ? _h : (_z["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_j = (_0 = pkg.scripts)["build:dts:tsc"]) !== null && _j !== void 0 ? _j : (_0["build:dts:tsc"] = "yarn run build:dts:tsc:emit && yarn run build:dts:copy");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_k = pkg.unpkg) !== null && _k !== void 0 ? _k : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    (_l = pkg.exports) !== null && _l !== void 0 ? _l : (pkg.exports = {});
    (_m = (_1 = pkg.exports)['.']) !== null && _m !== void 0 ? _m : (_1['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    pkg.exports['./src/*'] = './src/*';
    (_o = (_2 = pkg.exports)['./package.json']) !== null && _o !== void 0 ? _o : (_2['./package.json'] = './package.json');
    (_p = pkg.keywords) !== null && _p !== void 0 ? _p : (pkg.keywords = []);
    pkg.keywords.push('create-by-tsdx');
    if (((_r = (_q = pkg.dependencies) === null || _q === void 0 ? void 0 : _q['tslib']) === null || _r === void 0 ? void 0 : _r.length) > 0) {
        (_s = pkg.devDependencies) !== null && _s !== void 0 ? _s : (pkg.devDependencies = {});
        (_t = (_3 = pkg.devDependencies)['tslib']) !== null && _t !== void 0 ? _t : (_3['tslib'] = pkg.dependencies['tslib']);
        (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
    }
    if ((config === null || config === void 0 ? void 0 : config.rootData.hasWorkspace) && !config.rootData.isWorkspace) {
        (0, dot_values2_1.deleteValue)(pkg, ['dependencies', 'tslib']);
        (0, dot_values2_1.deleteValue)(pkg, ['devDependencies', 'tslib']);
    }
    return pkg;
}
exports.updatePackageJson = updatePackageJson;
const _defaultCopyStaticFilesTsdx = [
    ['tsconfig.json', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.json'],
    ['test/tsconfig.json', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
];
exports.defaultCopyStaticFilesTsdx = Object.freeze(_defaultCopyStaticFilesTsdx);
function setup(config) {
    let { pkg, file_map, } = config;
    pkg = updatePackageJson(pkg, config);
    file_map = [
        ...exports.defaultCopyStaticFilesTsdx,
        ...file_map,
    ];
    return {
        ...config,
        pkg,
        file_map,
    };
}
exports.setup = setup;
//# sourceMappingURL=index.js.map