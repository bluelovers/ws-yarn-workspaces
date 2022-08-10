"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockParse = exports._yarnLockParseCore = exports.yarnLockRawV2ToParsed = exports.yarnLockRawV1ToParsed = exports.yarnLockParseRaw = exports._yarnLockParseRaw = exports._yarnLockParseRawCore = void 0;
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
exports._yarnLockParseRawCore = _yarnLockParseRawCore;
function _yarnLockParseRaw(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    return _yarnLockParseRawCore(verType, yarnlock_old);
}
exports._yarnLockParseRaw = _yarnLockParseRaw;
function yarnLockParseRaw(yarnlock_old) {
    return _yarnLockParseRaw(yarnlock_old).parsed;
}
exports.yarnLockParseRaw = yarnLockParseRaw;
function yarnLockRawV1ToParsed(rawParsed) {
    let data;
    let meta;
    ({ object: data, ...meta } = rawParsed);
    return {
        meta,
        data,
    };
}
exports.yarnLockRawV1ToParsed = yarnLockRawV1ToParsed;
function yarnLockRawV2ToParsed(rawParsed) {
    let data;
    let meta;
    ({ __metadata: meta, ...data } = rawParsed);
    return {
        meta,
        data,
    };
}
exports.yarnLockRawV2ToParsed = yarnLockRawV2ToParsed;
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
exports._yarnLockParseCore = _yarnLockParseCore;
function yarnLockParse(yarnlock_old) {
    const verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
    const inputResult = _yarnLockParseRawCore(verType, yarnlock_old);
    return _yarnLockParseCore(inputResult);
}
exports.yarnLockParse = yarnLockParse;
exports.default = yarnLockParse;
//# sourceMappingURL=index.js.map