"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumLanguageName = exports.EnumLinkType = exports.EnumYarnLockSourceV1Type = exports.EnumDetectYarnLockInputType = exports.EnumDetectYarnLock = void 0;
var EnumDetectYarnLock;
(function (EnumDetectYarnLock) {
    EnumDetectYarnLock[EnumDetectYarnLock["v1"] = 1] = "v1";
    EnumDetectYarnLock[EnumDetectYarnLock["v2"] = 2] = "v2";
    /**
     * @deprecated do not use this if u want check is version is berry
     * @type {EnumDetectYarnLock.berry}
     */
    EnumDetectYarnLock[EnumDetectYarnLock["berry"] = 2] = "berry";
    EnumDetectYarnLock[EnumDetectYarnLock["v3"] = 3] = "v3";
    /**
     * @deprecated do not use this if u want check is version is berry
     * @alias {EnumDetectYarnLock.v3}
     */
    EnumDetectYarnLock[EnumDetectYarnLock["canary"] = 3] = "canary";
    EnumDetectYarnLock[EnumDetectYarnLock["unknown"] = 0] = "unknown";
})(EnumDetectYarnLock || (exports.EnumDetectYarnLock = EnumDetectYarnLock = {}));
var EnumDetectYarnLockInputType;
(function (EnumDetectYarnLockInputType) {
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["unknown"] = 0] = "unknown";
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["simple"] = 1] = "simple";
    EnumDetectYarnLockInputType[EnumDetectYarnLockInputType["parse_raw"] = 2] = "parse_raw";
})(EnumDetectYarnLockInputType || (exports.EnumDetectYarnLockInputType = EnumDetectYarnLockInputType = {}));
var EnumYarnLockSourceV1Type;
(function (EnumYarnLockSourceV1Type) {
    EnumYarnLockSourceV1Type["success"] = "success";
    EnumYarnLockSourceV1Type["merge"] = "merge";
    EnumYarnLockSourceV1Type["conflict"] = "conflict";
})(EnumYarnLockSourceV1Type || (exports.EnumYarnLockSourceV1Type = EnumYarnLockSourceV1Type = {}));
var EnumLinkType;
(function (EnumLinkType) {
    EnumLinkType["hard"] = "hard";
    EnumLinkType["soft"] = "soft";
})(EnumLinkType || (exports.EnumLinkType = EnumLinkType = {}));
var EnumLanguageName;
(function (EnumLanguageName) {
    EnumLanguageName["node"] = "node";
    EnumLanguageName["unknown"] = "unknown";
})(EnumLanguageName || (exports.EnumLanguageName = EnumLanguageName = {}));
//# sourceMappingURL=index.js.map