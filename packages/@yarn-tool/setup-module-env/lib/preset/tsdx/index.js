"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h, _j, _k, _l;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_h = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_h["posttest"] = "yarn run build");
    pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts";
    (_c = (_j = pkg.scripts)["build:dts"]) !== null && _c !== void 0 ? _c : (_j["build:dts"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner & echo build:dts");
    (_d = (_k = pkg.scripts)["build:tsdx"]) !== null && _d !== void 0 ? _d : (_k["build:tsdx"] = "ynpx @bluelovers/tsdx build --target node --name index");
    pkg.main = "dist/index.cjs";
    pkg.module = "dist/index.esm.mjs";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_e = pkg.exports) !== null && _e !== void 0 ? _e : (pkg.exports = {});
    (_f = (_l = pkg.exports)['.']) !== null && _f !== void 0 ? _f : (_l['.'] = {});
    pkg.exports['.'].types = "./dist/index.d.ts";
    pkg.exports['.'].import = "./dist/index.esm.mjs";
    pkg.exports['.'].require = "./dist/index.cjs";
    (_g = pkg.keywords) !== null && _g !== void 0 ? _g : (pkg.keywords = []);
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