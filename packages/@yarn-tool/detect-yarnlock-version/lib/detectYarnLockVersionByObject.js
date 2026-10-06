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
/**
 * 由已解析的 lockfile 物件判斷格式版本，全程不接觸原始字串。
 *
 * Detects the lockfile format from an already-parsed object without ever
 * touching the raw string.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 偵測到的版本列舉，無法判定時為 `unknown` /
 * the detected version enum, or `unknown` when undetectable
 */
function detectYarnLockVersionByObject(yarnLockObject) {
    /**
     * 傳入 null、字串等非物件時無法做欄位特徵分析，
     * 直接判定為 unknown，避免後續存取屬性時丟出例外。
     *
     * Non-objects such as null or strings cannot be inspected by field
     * signatures, so they are reported as unknown instead of throwing while
     * reading properties.
     */
    if (typeof yarnLockObject !== 'object') {
        return yarnlock_types_1.EnumDetectYarnLock.unknown;
    }
    const version = (0, detectYarnLockVersionWithMetadata_1.detectYarnLockVersionWithMetadata)(yarnLockObject);
    /**
     * 四個分支代表兩種格式各自的兩種證據來源：
     * Berry 優先看 `__metadata.version`（輔以 v2/v3 列舉特徵驗證），
     * v1 則看 `type` + `object` 包裝或裸露的 `version` / `resolved` 欄位；
     * 皆不符合時回傳 unknown。
     *
     * The four branches represent two evidence sources per format: Berry is
     * validated via `__metadata.version` cross-checked against v2/v3 row
     * signatures, while v1 is recognised either through its `type`+`object`
     * wrapper or through bare `version`/`resolved` fields; anything else is
     * unknown.
     */
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
/**
 * 檢查單一 Berry 項目列是否具備 v2/v3 的欄位特徵。
 *
 * Checks whether a single Berry entry row carries the v2/v3 field signatures.
 *
 * @param row lockfile 中的單一項目列 / a single entry row from the lockfile
 * @returns 三個特徵欄位皆存在時為 true /
 * true when all three signature fields are present
 */
function _checkV2Row(row) {
    // @ts-ignore
    return row.version && row.resolution && row.linkType;
}
/**
 * 檢查物件是否為 v2 或 v3 格式的 Berry lockfile。
 *
 * Checks whether the object is a v2 or v3 Berry lockfile.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 有項目列時回傳驗證通過的版本；僅剩 `__metadata` 時回傳其推得的
 * 版本；無法判定時可能回傳 `unknown` 或 undefined /
 * the validated version when entry rows exist, the version derived from
 * `__metadata` when it is all that remains, or `unknown`/undefined when
 * undecidable
 */
function checkV2(obj) {
    const { entryKeys: ks, verType, existsEntries, onlyExistsMeta } = _checkExistsMetaCore(obj);
    /**
     * 正常情況下應存在項目列：以第一列的欄位特徵驗證整份 lockfile，
     * `verType` 為空（例如缺 `__metadata`）時補上 v3，因為有項目列卻沒有
     * 中繼資料通常是較新的 Berry 格式。
     *
     * The normal case has entry rows: the first row's signatures vouch for the
     * whole lockfile, and a missing `verType` (e.g. no `__metadata`) falls
     * back to v3, since rows without metadata usually mean the newer Berry
     * format.
     */
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
     *
     * In ncu mode every entry may have been removed so only `__metadata`
     * remains; in that case the metadata alone decides the version.
     */
    else if (onlyExistsMeta) {
        return verType;
    }
}
/**
 * 檢查物件是否為 v1 格式的 lockfile。
 *
 * Checks whether the object is a v1-format lockfile.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 特徵欄位齊全時回傳 `v1`，否則回傳 undefined /
 * `v1` when the signature fields are present, otherwise undefined
 */
function checkV1(obj) {
    /**
     * 跑過前兩個鍵值（v1 解析結果開頭固定為額外欄位），
     * 取第一個真正的項目列來檢查 `version` 與 `resolved` 特徵。
     *
     * Skips the first two keys (the v1 parse result always opens with extra
     * fields) and inspects the first real entry row for the `version` and
     * `resolved` signatures.
     */
    let ks = Object.keys(obj)
        .slice(2);
    let k = ks[0];
    if (ks.length && obj[k].version && obj[k].resolved) {
        return yarnlock_types_1.EnumDetectYarnLock.v1;
    }
}
/**
 * 整理判斷格式所需的中繼資料 (metadata) 與項目狀態，
 * 供 checkV2 / checkExistsMeta 等上層函式共用。
 *
 * Gathers the metadata and entry state needed for format detection, shared
 * by higher-level helpers such as checkV2 and checkExistsMeta.
 *
 * @param obj 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 中繼資料版本、是否存在項目列與其鍵值等判斷素材 /
 * the raw facts for detection: metadata version, whether entry rows exist,
 * and their keys
 */
function _checkExistsMetaCore(obj) {
    /**
     * 先排除 `__metadata` 再計數，才能把「真正的項目列」與中繼資料分開統計。
     *
     * Filtering out `__metadata` before counting keeps real entry rows
     * separate from the metadata block.
     */
    const entryKeys = Object.keys(obj)
        .filter(k => k !== '__metadata');
    const metaVersion = (0, util_1.getMetadataVersion)(obj);
    const emptyEntries = entryKeys.length === 0;
    const existsEntries = entryKeys.length > 0;
    const existsMeta = !!metaVersion;
    /**
     * 「只有中繼資料」是 ncu 更新後的特殊狀態：此時唯一的判定依據就是
     * `__metadata.version`，因此單獨標記成旗標回傳。
     *
     * "metadata only" is the special state left behind by ncu updates, where
     * `__metadata.version` becomes the sole evidence, so it is surfaced as its
     * own flag.
     */
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
/**
 * 型別守衛 (type guard)：確認物件僅剩 `__metadata` 且版本欄位可讀。
 *
 * Type guard: verifies the object only keeps `__metadata` with a readable
 * version field.
 *
 * @param obj 要檢查的物件 / the object to check
 * @returns 具備 `__metadata.version` 結構時為 true /
 * true when the `__metadata.version` structure is present
 */
function checkExistsMeta(obj) {
    return _checkExistsMetaCore(obj).onlyExistsMeta;
}
exports.default = detectYarnLockVersionByObject;
//# sourceMappingURL=detectYarnLockVersionByObject.js.map