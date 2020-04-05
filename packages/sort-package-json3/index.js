"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJson = void 0;
// @ts-ignore
const sort_package_json_1 = require("sort-package-json");
const sort_package_json_scripts_1 = __importDefault(require("sort-package-json-scripts"));
function sortPackageJson(pkg) {
    pkg = sort_package_json_1.sortPackageJson(pkg);
    if (typeof pkg.scripts === 'object') {
        // @ts-ignore
        pkg.scripts = sort_package_json_scripts_1.default(pkg.scripts);
    }
    if (typeof pkg.betterScripts === 'object') {
        // @ts-ignore
        pkg.betterScripts = sort_package_json_scripts_1.default(pkg.betterScripts);
    }
    return pkg;
}
exports.sortPackageJson = sortPackageJson;
exports.default = sortPackageJson;
//# sourceMappingURL=index.js.map