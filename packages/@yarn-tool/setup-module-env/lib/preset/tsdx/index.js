"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCopyStaticFilesTsdx = void 0;
exports.updatePackageJson = updatePackageJson;
exports.setup = setup;
const scripts_1 = require("@yarn-tool/pkg-entry-util/lib/field/scripts");
const fix_1 = require("./fix");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function updatePackageJson(pkg, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var _q, _r, _s, _t, _u, _v, _w, _x, _y;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    if ((0, scripts_1.scriptsEntryIsNoTestSpecified)(pkg.scripts["test"])) {
        pkg.scripts["test"] = void 0;
    }
    (_b = (_q = pkg.scripts)["test"]) !== null && _b !== void 0 ? _b : (_q["test"] = "jest --passWithNoTests" /* EnumScriptsEntry.JEST_TEST */);
    (_c = (_r = pkg.scripts)["posttest"]) !== null && _c !== void 0 ? _c : (_r["posttest"] = "yarn run build");
    if (!((_d = pkg.scripts["build"]) === null || _d === void 0 ? void 0 : _d.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    (_e = (_s = pkg.scripts)["build:dts:bundle"]) !== null && _e !== void 0 ? _e : (_s["build:dts:bundle"] = "ynpx @bluelovers/dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle" /* EnumScriptsEntry.BUILD_DTS_BUNDLE */);
    (_f = (_t = pkg.scripts)["build:tsdx"]) !== null && _f !== void 0 ? _f : (_t["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node");
    (_g = (_u = pkg.scripts)["build:dts:copy"]) !== null && _g !== void 0 ? _g : (_u["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_h = (_v = pkg.scripts)["build:dts:tsc:emit"]) !== null && _h !== void 0 ? _h : (_v["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_j = (_w = pkg.scripts)["build:dts:tsc"]) !== null && _j !== void 0 ? _j : (_w["build:dts:tsc"] = [
        'yarn run build:dts:copy',
        'yarn run build:dts:tsc:emit',
        'yarn run build:dts:copy',
    ].join(' && '));
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_k = pkg.unpkg) !== null && _k !== void 0 ? _k : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    (_l = pkg.exports) !== null && _l !== void 0 ? _l : (pkg.exports = {});
    (_m = (_x = pkg.exports)['.']) !== null && _m !== void 0 ? _m : (_x['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    pkg.exports['./src/*'] = './src/*';
    (_o = (_y = pkg.exports)['./package.json']) !== null && _o !== void 0 ? _o : (_y['./package.json'] = './package.json');
    (_p = pkg.keywords) !== null && _p !== void 0 ? _p : (pkg.keywords = []);
    if (!pkg.keywords.includes("create-by-tsdx" /* EnumTsdx.keyword */)) {
        pkg.keywords.push("create-by-tsdx" /* EnumTsdx.keyword */);
    }
    (0, fix_1.fixTsdxPackage)(pkg, config);
    return pkg;
}
const _defaultCopyStaticFilesTsdx = [
    ['tsconfig.json', 'file/tsconfig.tsdx.json.tpl', 'tsconfig.json'],
    ['test/tsconfig.json', 'file/test/tsconfig.json.tpl', 'test/tsconfig.json'],
    ['src/index.cts', 'file/tsdx/index.cts'],
];
exports.defaultCopyStaticFilesTsdx = Object.freeze(_defaultCopyStaticFilesTsdx);
function setup(config) {
    let { pkg, file_map, targetDir, } = config;
    pkg = updatePackageJson(pkg, config);
    file_map = [
        ...exports.defaultCopyStaticFilesTsdx,
        ...file_map,
    ];
    (0, fs_extra_1.ensureDirSync)((0, path_1.resolve)(targetDir, 'src'));
    return {
        ...config,
        pkg,
        file_map,
    };
}
//# sourceMappingURL=index.js.map