"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigPaths = void 0;
const tslib_1 = require("tslib");
const readpkg_1 = require("./readpkg");
const array_hyper_unique_1 = require("array-hyper-unique");
const upath2_1 = require("upath2");
const listpkg_1 = (0, tslib_1.__importDefault)(require("./listpkg"));
function tsConfigPaths(ls) {
    let cwd;
    if (typeof ls == 'string') {
        cwd = ls;
        ls = (0, listpkg_1.default)(cwd);
    }
    if (typeof ls[0] == 'string') {
        ls = (0, readpkg_1.readPackages)(ls, cwd);
    }
    return Object.values(ls).reduce(function (a, v) {
        if (v.path !== '.' && v.path !== '') {
            a[v.name + '/*'] = (0, array_hyper_unique_1.array_unique)([
                (0, upath2_1.join)(v.path, '*'),
                (0, upath2_1.join)(v.fullpath, '*'),
            ]);
        }
        return a;
    }, {});
}
exports.tsConfigPaths = tsConfigPaths;
exports.default = tsConfigPaths;
//# sourceMappingURL=tsconfig.js.map