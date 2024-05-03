"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionWithMetadata = detectYarnLockVersionWithMetadata;
exports._detectYarnLockVersionWithMetadataCore = _detectYarnLockVersionWithMetadataCore;
const util_1 = require("./util");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function detectYarnLockVersionWithMetadata(yarnLockObject) {
    const metaVersion = (0, util_1.getMetadataVersion)(yarnLockObject);
    return _detectYarnLockVersionWithMetadataCore(metaVersion);
}
function _detectYarnLockVersionWithMetadataCore(metaVersion) {
    switch (metaVersion) {
        case '4':
        case '5':
            return yarnlock_types_1.EnumDetectYarnLock.v2;
        case '6':
            return yarnlock_types_1.EnumDetectYarnLock.v3;
        default:
            if (+metaVersion > 6) {
                return yarnlock_types_1.EnumDetectYarnLock.v3;
            }
            else if (metaVersion === null || metaVersion === void 0 ? void 0 : metaVersion.length) {
                return yarnlock_types_1.EnumDetectYarnLock.unknown;
            }
    }
}
//# sourceMappingURL=detectYarnLockVersionWithMetadata.js.map