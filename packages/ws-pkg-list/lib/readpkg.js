"use strict";
/**
 * Created by user on 2020/6/5.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackages = readPackages;
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
function readPackages(ls, cwd) {
    cwd = cwd || process.cwd();
    return ls.reduce(function (a, p) {
        let pp = (0, upath2_1.resolve)(cwd, p);
        let f = (0, upath2_1.join)(pp, 'package.json');
        let pkg = JSON.parse((0, fs_extra_1.readFileSync)(f).toString());
        a[pkg.name] = {
            name: pkg.name,
            path: p,
            fullpath: pp,
            config: pkg,
            manifestLocation: f,
        };
        return a;
    }, {});
}
exports.default = readPackages;
//# sourceMappingURL=readpkg.js.map