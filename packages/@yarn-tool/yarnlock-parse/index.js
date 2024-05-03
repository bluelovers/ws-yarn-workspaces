"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._yarnLockParseRawCore = _yarnLockParseRawCore;
exports._yarnLockParseRaw = _yarnLockParseRaw;
exports.yarnLockParseRaw = yarnLockParseRaw;
exports.yarnLockRawV1ToParsed = yarnLockRawV1ToParsed;
exports.yarnLockRawV2ToParsed = yarnLockRawV2ToParsed;
exports._yarnLockParseCore = _yarnLockParseCore;
exports.yarnLockParse = yarnLockParse;
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const v2_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2");
function _yarnLockParseRawCore(verType, yarnlock_old) {
    const source = yarnlock_old.toString();
    let parsed;
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            parsed = (0, v2_1.parseYarnLockRawV2)(source);
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            parsed = (0, v1_1.parseYarnLockRawV1)(source);
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    return {
        verType,
        parsed,
        source,
    };
}
function _yarnLockParseRaw(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    return _yarnLockParseRawCore(verType, yarnlock_old);
}
function yarnLockParseRaw(yarnlock_old) {
    return _yarnLockParseRaw(yarnlock_old).parsed;
}
function yarnLockRawV1ToParsed(rawParsed) {
    let data;
    let meta;
    ({ object: data, ...meta } = rawParsed);
    return {
        meta,
        data,
    };
}
function yarnLockRawV2ToParsed(rawParsed) {
    let data;
    let meta;
    ({ __metadata: meta, ...data } = rawParsed);
    return {
        meta,
        data,
    };
}
function _yarnLockParseCore(inputResult) {
    let fn;
    switch (inputResult.verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            fn = yarnLockRawV2ToParsed;
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            fn = yarnLockRawV1ToParsed;
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    return {
        verType: inputResult.verType,
        ...(fn(inputResult.parsed)),
    };
}
function yarnLockParse(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    const inputResult = _yarnLockParseRawCore(verType, yarnlock_old);
    return _yarnLockParseCore(inputResult);
}
exports.default = yarnLockParse;
//# sourceMappingURL=index.js.map