"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockStringify = yarnLockStringify;
exports._yarnLockStringifyRaw = _yarnLockStringifyRaw;
exports.yarnLockStringifyRaw = yarnLockStringifyRaw;
exports._yarnLockStringifyRawCore = _yarnLockStringifyRawCore;
const detectYarnLockVersionByObject_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersionByObject");
const detectYarnLockVersion_1 = require("@yarn-tool/detect-yarnlock-version/lib/detectYarnLockVersion");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parsed_to_json_1 = require("@yarn-tool/yarnlock-parsed-to-json");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
const detect_yarnlock_version_1 = require("@yarn-tool/detect-yarnlock-version");
const v1_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v1");
const v2_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2");
function yarnLockStringify(yarnlock_old) {
    let verType = (0, detect_yarnlock_version_1.detectYarnLockVersionByParsed)(yarnlock_old);
    if (verType) {
        yarnlock_old = (0, yarnlock_parsed_to_json_1.yarnLockParsedToRawJSON)(yarnlock_old);
    }
    else {
        verType = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnlock_old);
    }
    if (verType) {
        return _yarnLockStringifyRawCore(verType, yarnlock_old).content;
    }
    else {
        verType = (0, detectYarnLockVersion_1.detectYarnLockVersion)(yarnlock_old);
        if (verType) {
            return yarnlock_old.toString();
        }
    }
    throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
}
function _yarnLockStringifyRaw(yarnlockRawJSON) {
    const verType = (0, detectYarnLockVersionByObject_1.detectYarnLockVersionByObject)(yarnlockRawJSON);
    return _yarnLockStringifyRawCore(verType, yarnlockRawJSON);
}
function yarnLockStringifyRaw(yarnlockRawJSON) {
    return _yarnLockStringifyRaw(yarnlockRawJSON).content;
}
function _yarnLockStringifyRawCore(verType, yarnlockRawJSON) {
    let fn;
    switch (verType) {
        case yarnlock_types_1.EnumDetectYarnLock.v3:
        case yarnlock_types_1.EnumDetectYarnLock.v2:
            fn = v2_1.stringifyYarnLockRawV2;
            break;
        case yarnlock_types_1.EnumDetectYarnLock.v1:
            fn = v1_1.stringifyYarnLockRawV1;
            break;
        default:
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
    return {
        verType,
        fn,
        json: yarnlockRawJSON,
        content: fn(yarnlockRawJSON),
    };
}
exports.default = yarnLockStringify;
//# sourceMappingURL=index.js.map