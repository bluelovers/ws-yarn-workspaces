"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockStringify = void 0;
const tslib_1 = require("tslib");
const detectYarnLockVersionByObject_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject"));
const lockfile_1 = require("@yarnpkg/lockfile");
const detectYarnLockVersion_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion"));
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
const parsers_1 = require("@yarnpkg/parsers");
function yarnLockStringify(yarnlock_old) {
    var _a;
    let verType = (0, detectYarnLockVersionByObject_1.default)(yarnlock_old);
    if (verType) {
        switch (verType) {
            case types_1.EnumDetectYarnLock.berry:
                return (0, parsers_1.stringifySyml)(yarnlock_old);
            case types_1.EnumDetectYarnLock.v1:
                // @ts-ignore
                return (0, lockfile_1.stringify)((_a = yarnlock_old.object) !== null && _a !== void 0 ? _a : yarnlock_old);
        }
    }
    else {
        verType = (0, detectYarnLockVersion_1.default)(yarnlock_old);
        if (verType) {
            return yarnlock_old.toString();
        }
    }
    throw new TypeError(`can't detect yarn.lock`);
}
exports.yarnLockStringify = yarnLockStringify;
exports.default = yarnLockStringify;
//# sourceMappingURL=index.js.map