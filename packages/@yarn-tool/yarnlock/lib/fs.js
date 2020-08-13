"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsYarnLockSafe = exports.fsYarnLock = exports.writeYarnLockFile = exports.readYarnLockFile = exports.checkAndParseYarnLockFile = exports.checkAndReadYarnLockFileUnsafe = exports.checkYarnLockFileUnsafeCore = exports.existsYarnLockFile = void 0;
const fs_extra_1 = require("fs-extra");
const parse_1 = require("./parse");
const path_1 = require("path");
function existsYarnLockFile(file) {
    return fs_extra_1.pathExistsSync(file);
}
exports.existsYarnLockFile = existsYarnLockFile;
function checkYarnLockFileUnsafeCore(buf) {
    return (buf === null || buf === void 0 ? void 0 : buf.length) > 0;
}
exports.checkYarnLockFileUnsafeCore = checkYarnLockFileUnsafeCore;
function checkAndReadYarnLockFileUnsafe(file, options) {
    if (existsYarnLockFile(file)) {
        let buf = fs_extra_1.readFileSync(file, options);
        if (checkYarnLockFileUnsafeCore(buf)) {
            return buf;
        }
    }
}
exports.checkAndReadYarnLockFileUnsafe = checkAndReadYarnLockFileUnsafe;
function checkAndParseYarnLockFile(file, printError) {
    let buf = checkAndReadYarnLockFileUnsafe(file);
    if (buf === null || buf === void 0 ? void 0 : buf.length) {
        try {
            return parse_1.parse(buf);
        }
        catch (e) {
            printError && console.trace(e);
        }
    }
}
exports.checkAndParseYarnLockFile = checkAndParseYarnLockFile;
function readYarnLockFile(file) {
    let buf = fs_extra_1.readFileSync(file);
    return parse_1.parse(buf);
}
exports.readYarnLockFile = readYarnLockFile;
function writeYarnLockFile(file, data) {
    return fs_extra_1.writeFileSync(file, parse_1.stringify(data));
}
exports.writeYarnLockFile = writeYarnLockFile;
/**
 * @deprecated
 */
function fsYarnLock(root) {
    let yarnlock_file = path_1.join(root, 'yarn.lock');
    let yarnlock_exists = fs_extra_1.pathExistsSync(yarnlock_file);
    let yarnlock_old = yarnlock_exists && fs_extra_1.readFileSync(yarnlock_file, 'utf8') || null;
    return {
        yarnlock_file,
        yarnlock_exists,
        yarnlock_old,
    };
}
exports.fsYarnLock = fsYarnLock;
function fsYarnLockSafe(root) {
    const yarnlock_file = path_1.join(root, 'yarn.lock');
    const yarnlock_old = checkAndReadYarnLockFileUnsafe(yarnlock_file, 'utf8');
    const yarnlock_exists = checkYarnLockFileUnsafeCore(yarnlock_old);
    return {
        yarnlock_file,
        yarnlock_exists,
        yarnlock_old,
    };
}
exports.fsYarnLockSafe = fsYarnLockSafe;
exports.default = fsYarnLockSafe;
//# sourceMappingURL=fs.js.map