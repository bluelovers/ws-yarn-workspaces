"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.defaultCopyStaticFilesTsdx = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _o, _p, _q, _r, _s, _t, _u;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_o = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_o["posttest"] = "yarn run build");
    if (!((_c = pkg.scripts["build"]) === null || _c === void 0 ? void 0 : _c.includes('run build:tsdx'))) {
        pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    }
    (_d = (_p = pkg.scripts)["build:dts:bundle"]) !== null && _d !== void 0 ? _d : (_p["build:dts:bundle"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner & echo build:dts");
    (_e = (_q = pkg.scripts)["build:tsdx"]) !== null && _e !== void 0 ? _e : (_q["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index");
    (_f = (_r = pkg.scripts)["build:dts:copy"]) !== null && _f !== void 0 ? _f : (_r["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_g = (_s = pkg.scripts)["build:dts:tsc:emit"]) !== null && _g !== void 0 ? _g : (_s["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_h = (_t = pkg.scripts)["build:dts:tsc"]) !== null && _h !== void 0 ? _h : (_t["build:dts:tsc"] = "yarn run build:dts:tsc:emit && yarn run build:dts:copy");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_j = pkg.unpkg) !== null && _j !== void 0 ? _j : (pkg.unpkg = "dist/index.umd.production.min.cjs");
    (_k = pkg.exports) !== null && _k !== void 0 ? _k : (pkg.exports = {});
    (_l = (_u = pkg.exports)['.']) !== null && _l !== void 0 ? _l : (_u['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    (_m = pkg.keywords) !== null && _m !== void 0 ? _m : (pkg.keywords = []);
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