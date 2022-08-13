"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.defaultCopyStaticFilesTsdx = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var _q, _r, _s, _t, _u, _v, _w, _x, _y;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_q = pkg.scripts)["test"]) !== null && _b !== void 0 ? _b : (_q["test"] = "jest --passWithNoTests");
    (_c = (_r = pkg.scripts)["posttest"]) !== null && _c !== void 0 ? _c : (_r["posttest"] = "yarn run build");
    if (!((_d = pkg.scripts["build"]) === null || _d === void 0 ? void 0 : _d.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    (_e = (_s = pkg.scripts)["build:dts:bundle"]) !== null && _e !== void 0 ? _e : (_s["build:dts:bundle"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle");
    (_f = (_t = pkg.scripts)["build:tsdx"]) !== null && _f !== void 0 ? _f : (_t["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node");
    (_g = (_u = pkg.scripts)["build:dts:copy"]) !== null && _g !== void 0 ? _g : (_u["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_h = (_v = pkg.scripts)["build:dts:tsc:emit"]) !== null && _h !== void 0 ? _h : (_v["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_j = (_w = pkg.scripts)["build:dts:tsc"]) !== null && _j !== void 0 ? _j : (_w["build:dts:tsc"] = "yarn run build:dts:tsc:emit && yarn run build:dts:copy");
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
    pkg.keywords.push('create-by-tsdx');
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
    pkg = updatePackageJson(pkg);
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