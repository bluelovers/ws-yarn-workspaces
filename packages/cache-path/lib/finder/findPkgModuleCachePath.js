"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPkgModuleCachePath = exports.findPkgModulePath = exports.findPkgPath = void 0;
const path_1 = require("path");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
function findPkgPath(cwd) {
    return find_root_1.default({
        cwd,
    }).root;
}
exports.findPkgPath = findPkgPath;
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    return path_1.join(findPkgPath(cwd), 'node_modules');
}
exports.findPkgModulePath = findPkgModulePath;
function findPkgModuleCachePath(cwd) {
    return path_1.join(findPkgModulePath(cwd), '.cache');
}
exports.findPkgModuleCachePath = findPkgModuleCachePath;
//# sourceMappingURL=findPkgModuleCachePath.js.map