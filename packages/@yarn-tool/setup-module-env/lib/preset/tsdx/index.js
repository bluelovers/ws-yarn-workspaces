"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _j, _k, _l, _m;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_j = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_j["posttest"] = "yarn run build");
    pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts";
    (_c = (_k = pkg.scripts)["build:dts"]) !== null && _c !== void 0 ? _c : (_k["build:dts"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner & echo build:dts");
    (_d = (_l = pkg.scripts)["build:tsdx"]) !== null && _d !== void 0 ? _d : (_l["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_e = pkg.unpkg) !== null && _e !== void 0 ? _e : (pkg.unpkg = "dist/index.umd.js");
    (_f = pkg.exports) !== null && _f !== void 0 ? _f : (pkg.exports = {});
    (_g = (_m = pkg.exports)['.']) !== null && _g !== void 0 ? _g : (_m['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    (_h = pkg.keywords) !== null && _h !== void 0 ? _h : (pkg.keywords = []);
    pkg.keywords.push('create-by-tsdx');
    return pkg;
}
exports.updatePackageJson = updatePackageJson;
function setup(config) {
    let { pkg } = config;
    pkg = updatePackageJson(pkg);
    return {
        pkg,
    };
}
exports.setup = setup;
//# sourceMappingURL=index.js.map