"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextVersionRecommendedByPackageFindUp = exports.nextVersionRecommendedByPackage = void 0;
const ws_1 = require("./ws");
const index_1 = require("@yarn-tool/find-root/index");
const index_2 = require("@ts-type/package-dts/index");
const path_1 = require("path");
function nextVersionRecommendedByPackage(pkg, options) {
    if (typeof pkg.version !== 'string' || !pkg.version.length) {
        throw new TypeError(`pkg.version is require`);
    }
    return {
        ...ws_1.nextVersionRecommendedByWorkspacesFindUp(pkg.version, options),
        pkg,
    };
}
exports.nextVersionRecommendedByPackage = nextVersionRecommendedByPackage;
function nextVersionRecommendedByPackageFindUp(options) {
    var _a;
    options !== null && options !== void 0 ? options : (options = {});
    (_a = options.cwd) !== null && _a !== void 0 ? _a : (options.cwd = process.cwd());
    let rootData = index_1.findRoot(options);
    let pkg = index_2.readPackageJson(path_1.join(rootData.pkg, 'package.json'));
    options.cwd = rootData.root;
    return nextVersionRecommendedByPackage(pkg, options);
}
exports.nextVersionRecommendedByPackageFindUp = nextVersionRecommendedByPackageFindUp;
//# sourceMappingURL=pkg.js.map