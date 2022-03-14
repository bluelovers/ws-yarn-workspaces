"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.defaultCopyStaticFilesTsdx = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var _p, _q, _r, _s, _t, _u, _v, _w;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_p = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_p["posttest"] = "yarn run build");
    if (!((_c = pkg.scripts["build"]) === null || _c === void 0 ? void 0 : _c.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    (_d = (_q = pkg.scripts)["build:dts:bundle"]) !== null && _d !== void 0 ? _d : (_q["build:dts:bundle"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --inline-declare-global & echo build:dts:bundle");
    (_e = (_r = pkg.scripts)["build:tsdx"]) !== null && _e !== void 0 ? _e : (_r["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index");
    (_f = (_s = pkg.scripts)["build:dts:copy"]) !== null && _f !== void 0 ? _f : (_s["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_g = (_t = pkg.scripts)["build:dts:tsc:emit"]) !== null && _g !== void 0 ? _g : (_t["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_h = (_u = pkg.scripts)["build:dts:tsc"]) !== null && _h !== void 0 ? _h : (_u["build:dts:tsc"] = "yarn run build:dts:tsc:emit && yarn run build:dts:copy");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_j = pkg.unpkg) !== null && _j !== void 0 ? _j : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    (_k = pkg.exports) !== null && _k !== void 0 ? _k : (pkg.exports = {});
    (_l = (_v = pkg.exports)['.']) !== null && _l !== void 0 ? _l : (_v['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    pkg.exports['./src/*'] = './src/*';
    (_m = (_w = pkg.exports)['./package.json']) !== null && _m !== void 0 ? _m : (_w['./package.json'] = './package.json');
    (_o = pkg.keywords) !== null && _o !== void 0 ? _o : (pkg.keywords = []);
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