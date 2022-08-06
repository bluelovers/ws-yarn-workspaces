"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndReadYarnLockFileSafe = void 0;
const fs_extra_1 = require("fs-extra");
const fs_extra_2 = require("fs-extra");
const notEmpty_1 = require("./notEmpty");
function checkAndReadYarnLockFileSafe(file, options) {
    if ((0, fs_extra_1.pathExistsSync)(file)) {
        let buf = (0, fs_extra_2.readFileSync)(file, options);
        if ((0, notEmpty_1.notEmpty)(buf)) {
            return buf;
        }
    }
}
exports.checkAndReadYarnLockFileSafe = checkAndReadYarnLockFileSafe;
//# sourceMappingURL=readYarnLockFile.js.map