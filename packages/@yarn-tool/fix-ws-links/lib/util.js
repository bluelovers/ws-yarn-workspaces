"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSymbolicLink = exports.sameRealpath = void 0;
const fs_extra_1 = require("fs-extra");
function sameRealpath(dir0, dir1) {
    try {
        let real01 = fs_extra_1.realpathSync(dir0);
        let real02 = fs_extra_1.realpathSync(dir1);
        return real01 === real02;
    }
    catch (e) {
    }
}
exports.sameRealpath = sameRealpath;
function isSymbolicLink(dir0) {
    let stats = fs_extra_1.lstatSync(dir0);
    return stats.isSymbolicLink();
}
exports.isSymbolicLink = isSymbolicLink;
//# sourceMappingURL=util.js.map