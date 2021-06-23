"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJson = void 0;
const tslib_1 = require("tslib");
// @ts-ignore
const sort_package_json_1 = require("sort-package-json");
const sort_package_json_scripts_1 = (0, tslib_1.__importDefault)(require("sort-package-json-scripts"));
const is_plain_obj_1 = (0, tslib_1.__importDefault)(require("is-plain-obj"));
function sortPackageJson(pkg) {
    pkg = (0, sort_package_json_1.sortPackageJson)(pkg);
    if ((0, is_plain_obj_1.default)(pkg.scripts)) {
        // @ts-ignore
        pkg.scripts = (0, sort_package_json_scripts_1.default)(pkg.scripts);
    }
    if ((0, is_plain_obj_1.default)(pkg.betterScripts)) {
        // @ts-ignore
        pkg.betterScripts = (0, sort_package_json_scripts_1.default)(pkg.betterScripts);
    }
    return pkg;
}
exports.sortPackageJson = sortPackageJson;
exports.default = sortPackageJson;
//# sourceMappingURL=index.js.map