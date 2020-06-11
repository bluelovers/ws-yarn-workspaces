"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsYarnLock = exports.writeYarnLockfile = exports.readYarnLockfile = exports.checkAndReadYarnLockfile = exports.checkAndReadYarnLockfileUnsafe = exports.checkYarnLockfileUnsafeCore = exports.existsYarnLockfile = void 0;
const fs_extra_1 = require("fs-extra");
const parse_1 = require("./parse");
const path_1 = require("path");
const fs_1 = require("fs");
function existsYarnLockfile(file) {
    return fs_extra_1.pathExistsSync(file);
}
exports.existsYarnLockfile = existsYarnLockfile;
function checkYarnLockfileUnsafeCore(buf) {
    return buf.length > 0;
}
exports.checkYarnLockfileUnsafeCore = checkYarnLockfileUnsafeCore;
function checkAndReadYarnLockfileUnsafe(file) {
    if (existsYarnLockfile(file)) {
        let buf = fs_extra_1.readFileSync(file);
        if (checkYarnLockfileUnsafeCore(buf)) {
            return buf;
        }
    }
}
exports.checkAndReadYarnLockfileUnsafe = checkAndReadYarnLockfileUnsafe;
function checkAndReadYarnLockfile(file) {
    let buf = checkAndReadYarnLockfileUnsafe(file);
    if (buf === null || buf === void 0 ? void 0 : buf.length) {
        try {
            return parse_1.parse(buf);
        }
        catch (e) {
            console.trace(e);
        }
    }
}
exports.checkAndReadYarnLockfile = checkAndReadYarnLockfile;
function readYarnLockfile(file) {
    let buf = fs_extra_1.readFileSync(file);
    return parse_1.parse(buf);
}
exports.readYarnLockfile = readYarnLockfile;
function writeYarnLockfile(file, data) {
    return fs_extra_1.writeFileSync(file, parse_1.stringify(data));
}
exports.writeYarnLockfile = writeYarnLockfile;
function fsYarnLock(root) {
    let yarnlock_file = path_1.join(root, 'yarn.lock');
    let yarnlock_exists = fs_1.existsSync(yarnlock_file);
    let yarnlock_old = yarnlock_exists && fs_extra_1.readFileSync(yarnlock_file, 'utf8') || null;
    return {
        yarnlock_file,
        yarnlock_exists,
        yarnlock_old,
    };
}
exports.fsYarnLock = fsYarnLock;
//# sourceMappingURL=fs.js.map