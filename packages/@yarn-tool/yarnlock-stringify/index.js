"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockStringify = void 0;
const detectYarnLockVersionByObject_1 = __importDefault(require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject"));
const lockfile_1 = require("@yarnpkg/lockfile");
const detectYarnLockVersion_1 = __importDefault(require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion"));
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
const parsers_1 = require("@yarnpkg/parsers");
function yarnLockStringify(yarnlock_old) {
    var _a;
    let verType = detectYarnLockVersionByObject_1.default(yarnlock_old);
    if (verType) {
        switch (verType) {
            case types_1.EnumDetectYarnLock.berry:
                return parsers_1.stringifySyml(yarnlock_old);
            case types_1.EnumDetectYarnLock.v1:
                // @ts-ignore
                return lockfile_1.stringify((_a = yarnlock_old.object) !== null && _a !== void 0 ? _a : yarnlock_old);
        }
    }
    else {
        verType = detectYarnLockVersion_1.default(yarnlock_old);
        if (verType) {
            return yarnlock_old.toString();
        }
    }
    throw new TypeError(`can't detect yarn.lock`);
}
exports.yarnLockStringify = yarnLockStringify;
exports.default = yarnLockStringify;
//# sourceMappingURL=index.js.map