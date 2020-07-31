"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYarnLockParseV2 = exports.isYarnLockParseV1 = exports.yarnLockParse = void 0;
const lockfile_1 = require("@yarnpkg/lockfile");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const types_1 = require("@yarn-tool/detect-yarnlock-version/lib/types");
const parsers_1 = require("@yarnpkg/parsers");
function yarnLockParse(yarnlock_old) {
    let verType = detectYarnLockVersion_1.detectYarnLockVersion(yarnlock_old);
    let data;
    let meta;
    switch (verType) {
        case types_1.EnumDetectYarnLock.berry:
            ({ __metadata: meta, ...data } = parsers_1.parseSyml(yarnlock_old));
            break;
        case types_1.EnumDetectYarnLock.v1:
            ({ object: data, ...meta } = lockfile_1.parse(yarnlock_old));
            break;
        default:
            throw new TypeError(`can't detect yarn.lock`);
    }
    return {
        verType,
        meta,
        data,
    };
}
exports.yarnLockParse = yarnLockParse;
function isYarnLockParseV1(data) {
    return data.verType === types_1.EnumDetectYarnLock.v1;
}
exports.isYarnLockParseV1 = isYarnLockParseV1;
function isYarnLockParseV2(data) {
    return data.verType === types_1.EnumDetectYarnLock.v2;
}
exports.isYarnLockParseV2 = isYarnLockParseV2;
exports.default = yarnLockParse;
//# sourceMappingURL=index.js.map