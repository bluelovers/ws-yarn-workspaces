"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.defaultCopyStaticFilesTsdx = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var _m, _o, _p, _q, _r, _s, _t;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_m = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_m["posttest"] = "yarn run build");
    pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts:bundle";
    (_c = (_o = pkg.scripts)["build:dts:bundle"]) !== null && _c !== void 0 ? _c : (_o["build:dts:bundle"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner & echo build:dts");
    (_d = (_p = pkg.scripts)["build:tsdx"]) !== null && _d !== void 0 ? _d : (_p["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index");
    (_e = (_q = pkg.scripts)["build:dts:copy"]) !== null && _e !== void 0 ? _e : (_q["build:dts:copy"] = "copy .\\src\\index.d.ts .\\dist\\index.d.ts & echo build:dts");
    (_f = (_r = pkg.scripts)["build:dts:tsc:emit"]) !== null && _f !== void 0 ? _f : (_r["build:dts:tsc:emit"] = "tsc --emitDeclarationOnly --declaration --noEmit false");
    (_g = (_s = pkg.scripts)["build:dts:tsc"]) !== null && _g !== void 0 ? _g : (_s["build:dts:tsc"] = "yarn run build:dts:tsc:emit && yarn run build:dts:copy");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_h = pkg.unpkg) !== null && _h !== void 0 ? _h : (pkg.unpkg = "dist/index.umd.js");
    (_j = pkg.exports) !== null && _j !== void 0 ? _j : (pkg.exports = {});
    (_k = (_t = pkg.exports)['.']) !== null && _k !== void 0 ? _k : (_t['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    (_l = pkg.keywords) !== null && _l !== void 0 ? _l : (pkg.keywords = []);
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