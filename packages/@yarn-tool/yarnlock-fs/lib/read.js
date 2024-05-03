"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsYarnLock = fsYarnLock;
exports.fsYarnLockSafe = fsYarnLockSafe;
const path_1 = require("path");
const readYarnLockFile_1 = require("./readYarnLockFile");
const notEmpty_1 = require("./notEmpty");
const fs_extra_1 = require("fs-extra");
/**
 * @deprecated
 */
function fsYarnLock(root) {
    let yarnlock_file = (0, path_1.join)(root, 'yarn.lock');
    let yarnlock_exists = (0, fs_extra_1.pathExistsSync)(yarnlock_file);
    let yarnlock_old = yarnlock_exists && (0, fs_extra_1.readFileSync)(yarnlock_file, 'utf8') || null;
    return {
        yarnlock_file,
        yarnlock_exists,
        yarnlock_old,
    };
}
function fsYarnLockSafe(root) {
    const yarnlock_file = (0, path_1.join)(root, 'yarn.lock');
    const yarnlock_old = (0, readYarnLockFile_1.checkAndReadYarnLockFileSafe)(yarnlock_file, 'utf8');
    const yarnlock_exists = (0, notEmpty_1.notEmpty)(yarnlock_old);
    return {
        yarnlock_file,
        yarnlock_exists,
        yarnlock_old,
    };
}
exports.default = fsYarnLockSafe;
//# sourceMappingURL=read.js.map