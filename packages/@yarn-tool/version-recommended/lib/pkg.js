"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackage = nextVersionRecommendedByPackage;
exports.nextVersionRecommendedByPackageFindUp = nextVersionRecommendedByPackageFindUp;
const ws_1 = require("./ws");
const find_root_1 = require("@yarn-tool/find-root");
const package_dts_1 = require("@ts-type/package-dts");
const path_1 = require("path");
function nextVersionRecommendedByPackage(pkg, options) {
    if (typeof pkg.version !== 'string' || !pkg.version.length) {
        throw new TypeError(`pkg.version is require`);
    }
    return {
        ...(0, ws_1.nextVersionRecommendedByWorkspacesFindUp)(pkg.version, options),
        pkg,
    };
}
function nextVersionRecommendedByPackageFindUp(options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    let rootData = (0, find_root_1.findRoot)(options);
    let pkg = (0, package_dts_1.readPackageJson)((0, path_1.join)(rootData.pkg, 'package.json'));
    options.cwd = rootData.root;
    // @ts-ignore
    return nextVersionRecommendedByPackage(pkg, options);
}
//# sourceMappingURL=pkg.js.map