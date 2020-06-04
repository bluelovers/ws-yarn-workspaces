"use strict";
/**
 * Created by user on 2020/6/5.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigPaths = void 0;
const readpkg_1 = require("./readpkg");
const array_hyper_unique_1 = require("array-hyper-unique");
const upath2_1 = require("upath2");
const listpkg_1 = __importDefault(require("./listpkg"));
function tsConfigPaths(ls) {
    let cwd;
    if (typeof ls == 'string') {
        cwd = ls;
        ls = listpkg_1.default(cwd);
    }
    if (typeof ls[0] == 'string') {
        ls = readpkg_1.readPackages(ls, cwd);
    }
    return Object.values(ls).reduce(function (a, v) {
        if (v.path !== '.' && v.path !== '') {
            a[v.name + '/*'] = array_hyper_unique_1.array_unique([
                upath2_1.join(v.path, '*'),
                upath2_1.join(v.fullpath, '*'),
            ]);
        }
        return a;
    }, {});
}
exports.tsConfigPaths = tsConfigPaths;
exports.default = tsConfigPaths;
//# sourceMappingURL=tsconfig.js.map