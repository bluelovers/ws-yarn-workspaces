"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumLanguageName = exports.EnumLinkType = exports.EnumYarnLockSourceV1Type = exports.EnumDetectYarnLockInputType = exports.EnumDetectYarnLock = void 0;
/**
 * lockfile 版本偵測結果的列舉：`v2` 與 `v3` 為目前正式版本，
 * `berry` / `canary` 為歷史別名（已 deprecated），`unknown` 代表無法判斷。
 *
 * Version detection enum of lockfiles: `v2`/`v3` are the current versions, `berry`/
 * `canary` are deprecated historical aliases, and `unknown` means detection failed.
 */
var EnumDetectYarnLock;
(function (EnumDetectYarnLock) {
    /**
     * v1（Yarn Classic，@yarnpkg/lockfile 格式）
     */
    EnumDetectYarnLock[EnumDetectYarnLock["v1"] = 1] = "v1";
    /**
     * v2（Yarn Berry 的既有格式）
     */
    EnumDetectYarnLock[EnumDetectYarnLock["v2"] = 2] = "v2";
    /**
     * @deprecated do not use this if u want check is version is berry
     * @type {EnumDetectYarnLock.berry}
     */
    EnumDetectYarnLock[EnumDetectYarnLock["berry"] = 2] = "berry";
    /**
     * v3（Yarn Berry 較新的 lockfile 格式）
     *
     * v3 (newer lockfile format of Yarn Berry).
     */
    EnumDetectYarnLock[EnumDetectYarnLock["v3"] = 3] = "v3";
    /**
     * @deprecated do not use this if u want check is version is berry
     * @alias {EnumDetectYarnLock.v3}
     */
    EnumDetectYarnLock[EnumDetectYarnLock["canary"] = 3] = "canary";
    /**
     * 無法判斷版本時的預設值，應與 `IValidYarnLockVersion` 排除使用
     */
    EnumDetectYarnLock[EnumDetectYarnLock["unknown"] = 0] = "unknown";
})(EnumDetectYarnLock || (exports.EnumDetectYarnLock = EnumDetectYarnLock = {}));
/**
 * 偵測輸入的來源型別：區分是比對原始字串、簡單比對，
 * 還是已經由 parser 解析過的內容，以決定偵測流程要走到哪一步。
 *
 * Input source of detection: distinguishes raw-string comparison, simple comparison or
 * already-parsed content, deciding how far the detection flow must go.
 */
var EnumDetectYarnLockInputType;
(function (EnumDetectYarnLockInputType) {
    /**
     * 未知來源
     */
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["unknown"] = 0] = "unknown";
    /**
     * 以簡單比對判斷
     */
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["simple"] = 1] = "simple";
    /**
     * 由 parser 解析原始內容後判斷
     */
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["parse_raw"] = 2] = "parse_raw";
})(EnumDetectYarnLockInputType || (exports.EnumDetectYarnLockInputType = EnumDetectYarnLockInputType = {}));
/**
 * v1 原始來源的型別標記：成功解析、合併結果或衝突內容。
 *
 * Source type marker of raw v1: successful parse, merge result or conflict.
 */
var EnumYarnLockSourceV1Type;
(function (EnumYarnLockSourceV1Type) {
    /**
     * 正常解析成功
     */
    EnumYarnLockSourceV1Type["success"] = "success";
    /**
     * 來自 git 合併後的結果
     */
    EnumYarnLockSourceV1Type["merge"] = "merge";
    /**
     * 來自 git 衝突的內容（含衝突標記）
     */
    EnumYarnLockSourceV1Type["conflict"] = "conflict";
})(EnumYarnLockSourceV1Type || (exports.EnumYarnLockSourceV1Type = EnumYarnLockSourceV1Type = {}));
/**
 * 依賴的連結方式：硬連結 (Hard Link) 或符號連結 (Soft Link)。
 *
 * Link mode of a dependency: hard link or soft link.
 */
var EnumLinkType;
(function (EnumLinkType) {
    EnumLinkType["hard"] = "hard";
    EnumLinkType["soft"] = "soft";
})(EnumLinkType || (exports.EnumLinkType = EnumLinkType = {}));
/**
 * 解析結果的語言名稱，目前只有 node 與未知兩種值。
 *
 * Language name of a parse result; currently only node and unknown.
 */
var EnumLanguageName;
(function (EnumLanguageName) {
    EnumLanguageName["node"] = "node";
    EnumLanguageName["unknown"] = "unknown";
})(EnumLanguageName || (exports.EnumLanguageName = EnumLanguageName = {}));
//# sourceMappingURL=index.js.map