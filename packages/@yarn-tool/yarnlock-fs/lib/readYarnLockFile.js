"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndReadYarnLockFileSafe = void 0;
const existsYarnLockFile_1 = require("./existsYarnLockFile");
const fs_extra_1 = require("fs-extra");
const notEmpty_1 = require("./notEmpty");
function checkAndReadYarnLockFileSafe(file, options) {
    if ((0, existsYarnLockFile_1.existsYarnLockFile)(file)) {
        let buf = (0, fs_extra_1.readFileSync)(file, options);
        if ((0, notEmpty_1.notEmpty)(buf)) {
            return buf;
        }
    }
}
exports.checkAndReadYarnLockFileSafe = checkAndReadYarnLockFileSafe;
//# sourceMappingURL=readYarnLockFile.js.map