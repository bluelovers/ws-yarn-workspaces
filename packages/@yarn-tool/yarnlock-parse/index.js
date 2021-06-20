"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertYarnLockParsedIsSupported = exports.isYarnLockParsedV2 = exports.isYarnLockParsedV1 = exports.yarnLockParse = void 0;
const lockfile_1 = require("@yarnpkg/lockfile");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
const parsers_1 = require("@yarnpkg/parsers");
const yarnlock_error_1 = __importDefault(require("@yarn-tool/yarnlock-error"));
function yarnLockParse(yarnlock_old) {
    let verType = detectYarnLockVersion_1.detectYarnLockVersion(yarnlock_old);
    let data;
    let meta;
    switch (verType) {
        case types_1.EnumDetectYarnLock.berry:
            ({ __metadata: meta, ...data } = parsers_1.parseSyml(yarnlock_old.toString()));
            break;
        case types_1.EnumDetectYarnLock.v1:
            ({ object: data, ...meta } = lockfile_1.parse(yarnlock_old.toString()));
            break;
        default:
            throw yarnlock_error_1.default();
    }
    return {
        verType,
        meta,
        data,
    };
}
exports.yarnLockParse = yarnLockParse;
function isYarnLockParsedV1(data) {
    return data.verType === types_1.EnumDetectYarnLock.v1;
}
exports.isYarnLockParsedV1 = isYarnLockParsedV1;
function isYarnLockParsedV2(data) {
    return data.verType === types_1.EnumDetectYarnLock.v2;
}
exports.isYarnLockParsedV2 = isYarnLockParsedV2;
function assertYarnLockParsedIsSupported(parsedOldPackage, cb) {
    if (isYarnLockParsedV1(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(types_1.EnumDetectYarnLock.v1, parsedOldPackage);
    }
    else if (isYarnLockParsedV2(parsedOldPackage)) {
        return cb === null || cb === void 0 ? void 0 : cb(types_1.EnumDetectYarnLock.v2, parsedOldPackage);
    }
    throw yarnlock_error_1.default();
}
exports.assertYarnLockParsedIsSupported = assertYarnLockParsedIsSupported;
exports.default = yarnLockParse;
//# sourceMappingURL=index.js.map