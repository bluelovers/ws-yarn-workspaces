"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackages = void 0;
const upath2_1 = require("upath2");
const fs_1 = require("fs");
function readPackages(ls, cwd) {
    cwd = cwd || process.cwd();
    return ls.reduce(function (a, p) {
        let pp = upath2_1.resolve(cwd, p);
        let f = upath2_1.join(pp, 'package.json');
        let pkg = JSON.parse(fs_1.readFileSync(f).toString());
        a[pkg.name] = {
            name: pkg.name,
            path: p,
            fullpath: pp,
            config: pkg,
        };
        return a;
    }, {});
}
exports.readPackages = readPackages;
exports.default = readPackages;
//# sourceMappingURL=readpkg.js.map