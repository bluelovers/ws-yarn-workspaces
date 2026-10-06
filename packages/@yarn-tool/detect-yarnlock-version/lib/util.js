"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataVersion = getMetadataVersion;
exports._getMetadataVersionCore = _getMetadataVersionCore;
/**
 * 從解析後的 lockfile 物件取出 Berry 的 `__metadata.version` 欄位。
 *
 * Reads the Berry `__metadata.version` field from a parsed lockfile object.
 *
 * @param yarnLockObject 已解析的 lockfile 物件 / a parsed lockfile object
 * @returns 版本字串，沒有 `__metadata` 時為 undefined /
 * the version string, or undefined when `__metadata` is absent
 */
function getMetadataVersion(yarnLockObject) {
    return _getMetadataVersionCore(yarnLockObject['__metadata']);
}
/**
 * 取得 `__metadata` 內的版本欄位。
 *
 * Extracts the version field from a `__metadata` object.
 *
 * @param __metadata Berry 鎖定檔的中繼資料物件 / the Berry lockfile metadata object
 * @returns 版本字串或 undefined / the version string or undefined
 */
function _getMetadataVersionCore(__metadata) {
    var _a;
    return (_a = __metadata === null || __metadata === void 0 ? void 0 : __metadata['version']) === null || _a === void 0 ? void 0 : _a.toString();
}
//# sourceMappingURL=util.js.map