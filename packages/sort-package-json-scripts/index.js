"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackageJsonScripts = void 0;
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
const handleKeyOrdersCore_1 = require("./lib/handleKeyOrdersCore");
const handleOptions_1 = __importDefault(require("./lib/handleOptions"));
/**
 * a better sort package.json scripts, by default is follow npm lifecycle scripts
 *
 * origin code fork from https://github.com/keithamus/sort-package-json
 */
function sortPackageJsonScripts(scripts, opts) {
    opts = handleOptions_1.default(opts);
    const keys = handleKeyOrdersCore_1.handleKeyOrdersCore(Object.keys(scripts), opts);
    return sort_object_keys2_1.default(scripts, {
        keys,
        sort: opts.sortKeyFn,
    });
}
exports.sortPackageJsonScripts = sortPackageJsonScripts;
exports.default = sortPackageJsonScripts;
//# sourceMappingURL=index.js.map