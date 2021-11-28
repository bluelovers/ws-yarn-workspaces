"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.updatePackageJson = void 0;
function updatePackageJson(pkg) {
    var _a, _b, _c, _d, _e;
    var _f, _g, _h;
    (_a = pkg.scripts) !== null && _a !== void 0 ? _a : (pkg.scripts = {});
    (_b = (_f = pkg.scripts)["posttest"]) !== null && _b !== void 0 ? _b : (_f["posttest"] = "yarn run build");
    pkg.scripts["build"] = "yarn run build:tsdx && yarn run build:dts";
    (_c = (_g = pkg.scripts)["build:dts"]) !== null && _c !== void 0 ? _c : (_g["build:dts"] = "ynpx dts-bundle-generator -o ./dist/index.d.ts ./src/index.ts --no-banner --external-inlines ts-type & echo build:dts");
    (_d = (_h = pkg.scripts)["build:tsdx"]) !== null && _d !== void 0 ? _d : (_h["build:tsdx"] = "tsdx build --target node --name index");
    pkg.main = "dist/index.js";
    pkg.module = "dist/index.esm.js";
    pkg.types = pkg.typings = "dist/index.d.ts";
    (_e = pkg.keywords) !== null && _e !== void 0 ? _e : (pkg.keywords = []);
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