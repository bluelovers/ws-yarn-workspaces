"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumPackageManagersNpmMethod = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("@ts-type/package-dts/lib/package-json/types"), exports);
/**
 * npm 套件管理器的版本查詢方法 (npm resolution methods)
 * 鍵為我們對外使用的版本策略 (versionTarget)，值為 `npm-check-updates`
 * 內部 package-manager 方法名稱；兩者命名不同，因此需要這張對照表。
 * Keys are the public version strategies, values are the method names inside
 * `npm-check-updates`; the two vocabularies differ, hence this mapping table.
 */
var EnumPackageManagersNpmMethod;
(function (EnumPackageManagersNpmMethod) {
    EnumPackageManagersNpmMethod["major"] = "greatestMajor";
    EnumPackageManagersNpmMethod["minor"] = "greatestMinor";
    EnumPackageManagersNpmMethod["latest"] = "latest";
    EnumPackageManagersNpmMethod["greatest"] = "greatest";
    EnumPackageManagersNpmMethod["newest"] = "newest";
})(EnumPackageManagersNpmMethod || (exports.EnumPackageManagersNpmMethod = EnumPackageManagersNpmMethod = {}));
//# sourceMappingURL=types.js.map