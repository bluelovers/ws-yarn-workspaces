"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectYarnLockVersionByObject = detectYarnLockVersionByObject;
exports._checkV2Row = _checkV2Row;
exports.checkV2 = checkV2;
exports.checkV1 = checkV1;
exports._checkExistsMetaCore = _checkExistsMetaCore;
exports.checkExistsMeta = checkExistsMeta;
const util_1 = require("./util");
const detectYarnLockVersionWithMetadata_1 = require("./detectYarnLockVersionWithMetadata");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
function detectYarnLockVersionByObject(yarnLockObject) {
    if (typeof yarnLockObject !== 'object') {
        return yarnlock_types_1.EnumDetectYarnLock.unknown;
    }
    const version = (0, detectYarnLockVersionWithMetadata_1.detectYarnLockVersionWithMetadata)(yarnLockObject);
    if (version && checkV2(yarnLockObject)) {
        return version;
    }
    else if (typeof yarnLockObject.type === 'string' && yarnLockObject.object && checkV1(yarnLockObject.object)) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
    else if (!('__metadata' in yarnLockObject) && checkV2(yarnLockObject)) {
        return yarnlock_types_1.EnumDetectYarnLock.v3;
    }
    else if (!('type' in yarnLockObject) && !('object' in yarnLockObject) && checkV1(yarnLockObject)) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
    return yarnlock_types_1.EnumDetectYarnLock.unknown;
}
function _checkV2Row(row) {
    // @ts-ignore
    return row.version && row.resolution && row.linkType;
}
/**
 * check v2 and v3
 */
function checkV2(obj) {
    const { entryKeys: ks, verType, existsEntries, onlyExistsMeta } = _checkExistsMetaCore(obj);
    if (existsEntries) {
        const k = ks[0];
        if (_checkV2Row(obj[k])) {
            return verType || yarnlock_types_1.EnumDetectYarnLock.v3;
        }
        return yarnlock_types_1.EnumDetectYarnLock.unknown;
    }
    /**
     * ncu 模式時可能會造成只剩下 __metadata
     * 而其他項目都被移除的狀況
     * 這時候改用 __metadata 來判斷
     */
    else if (onlyExistsMeta) {
        return verType;
    }
}
function checkV1(obj) {
    let ks = Object.keys(obj)
        .slice(2);
    let k = ks[0];
    if (ks.length && obj[k].version && obj[k].resolved) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
}
function _checkExistsMetaCore(obj) {
    const entryKeys = Object.keys(obj)
        .filter(k => k !== '__metadata');
    const metaVersion = (0, util_1.getMetadataVersion)(obj);
    const emptyEntries = entryKeys.length === 0;
    const existsEntries = entryKeys.length > 0;
    const existsMeta = !!metaVersion;
    const onlyExistsMeta = emptyEntries && existsMeta;
    return {
        verType: (0, detectYarnLockVersionWithMetadata_1._detectYarnLockVersionWithMetadataCore)(metaVersion),
        metaVersion,
        existsMeta,
        emptyEntries,
        existsEntries,
        onlyExistsMeta,
        // @ts-ignore
        meta: obj.__metadata,
        entryKeys,
    };
}
function checkExistsMeta(obj) {
    return _checkExistsMetaCore(obj).onlyExistsMeta;
}
exports.default = detectYarnLockVersionByObject;
//# sourceMappingURL=detectYarnLockVersionByObject.js.map