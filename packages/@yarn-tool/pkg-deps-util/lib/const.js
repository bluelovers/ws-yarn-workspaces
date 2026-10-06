"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumInstallTypesErrorCode = void 0;
/**
 * 安裝目標檢查的錯誤碼 (Error code)
 *
 * 以數值列舉 (Numeric enum) 表示檢查結果，數值本身不具順序意義，
 * 僅供呼叫端以 `===` 比對，避免與字串錯誤碼混淆。
 *
 * Numeric enum describing the result of an install-target check.
 * The numeric values carry no ordering meaning; callers are expected
 * to compare them with `===` instead of relying on string codes.
 */
var EnumInstallTypesErrorCode;
(function (EnumInstallTypesErrorCode) {
    /**
     * 套件可正常安裝 (The package can be installed normally)
     */
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["SUCCESS"] = 0] = "SUCCESS";
    /**
     * 套件不存在於 registry (The package does not exist on the registry)
     */
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["NOT_EXISTS"] = 1] = "NOT_EXISTS";
    /**
     * 套件已棄用 (The package is deprecated)
     */
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["DEPRECATED"] = 2] = "DEPRECATED";
    /**
     * 套件已存在於依賴中，略過安裝 (Already exists in dependencies, skip installing)
     */
    EnumInstallTypesErrorCode[EnumInstallTypesErrorCode["SKIP"] = 3] = "SKIP";
})(EnumInstallTypesErrorCode || (exports.EnumInstallTypesErrorCode = EnumInstallTypesErrorCode = {}));
//# sourceMappingURL=const.js.map