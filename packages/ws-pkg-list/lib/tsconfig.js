"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsConfigPaths = tsConfigPaths;
const tslib_1 = require("tslib");
const readpkg_1 = require("./readpkg");
const array_hyper_unique_1 = require("array-hyper-unique");
const upath2_1 = require("upath2");
const listpkg_1 = tslib_1.__importDefault(require("./listpkg"));
function tsConfigPaths(ls) {
    let cwd;
    // 傳入字串時視為 cwd，先取得路徑清單再往下解析。
    // A string argument is treated as `cwd`; list the package paths first before further resolution.
    if (typeof ls == 'string') {
        cwd = ls;
        ls = (0, listpkg_1.default)(cwd);
    }
    // 清單元素為字串時尚未讀取 manifest，需先轉成 readPackages() 的索引結構。
    // When the list still contains strings the manifests have not been read yet, so convert via `readPackages()` first.
    if (typeof ls[0] == 'string') {
        ls = (0, readpkg_1.readPackages)(ls, cwd);
    }
    // 路徑為 '.' 或空字串代表工作區根套件本身；不產生 paths 映射，避免 tsconfig 出現自我指向的模糊路徑。
    // A path of '.' or '' is the workspace root package itself; skip it to avoid a self-referencing, ambiguous path mapping in tsconfig.
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
exports.default = tsConfigPaths;
//# sourceMappingURL=tsconfig.js.map