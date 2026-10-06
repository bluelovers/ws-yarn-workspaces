"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageInfo = getPackageInfo;
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const core_1 = require("@yarn-tool/pkg-version-query/lib/core");
const package_json_1 = require("package-json");
/**
 * 查詢套件資訊 (Query package info)
 *
 * Query package info from the npm registry.
 *
 * @param packageName 套件名稱字串，或已解析過的套件名稱物件
 *                   A name string, or an already parsed package name object
 * @param excludeVersion 是否忽略輸入的版本，一律查詢 `latest`
 *                       Ignore the input version and always query `latest`
 *
 * @returns 套件的簡要版本資訊；套件不存在時回傳 `undefined`
 *
 * Abbreviated version info, or `undefined` when the package does not exist.
 */
function getPackageInfo(packageName, excludeVersion) {
    var _a, _b;
    const data = typeof packageName === 'string' ? (0, packageNameToTypes_1.packageNameToTypes)(packageName) : packageName;
    let version = 'latest';
    /**
     * 只有在明確帶有版本且未要求排除時才使用該版本，
     * 否則一律以 `latest` 查詢，避免 tag 類輸入解析出無效 range。
     *
     * Uses the given version only when one was supplied and not excluded;
     * otherwise queries `latest` so tag-like input never yields an invalid range.
     */
    if (!excludeVersion && ((_a = data.semver) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        version = (_b = data.semver) !== null && _b !== void 0 ? _b : 'latest';
    }
    return (0, core_1._queryVersion)(data.name, {
        version,
        //fullMetadata: true,
    })
        /**
         * 版本不存在（例如指定了過舊的 range）時降級到 `latest`，而不是直接失敗
         *
         * Falls back to `latest` when the version is missing (e.g. an old range)
         * instead of failing outright.
         */
        .catch(package_json_1.VersionNotFoundError, () => {
        return (0, core_1._queryVersion)(data.name, {
            version: 'latest',
            //fullMetadata: true,
        });
    })
        /**
         * 整個套件不存在時回傳 `undefined`，由上層決定是否回報 `NOT_EXISTS`
         *
         * A wholly unknown package yields `undefined`, letting the caller report
         * NOT_EXISTS.
         */
        .catch(package_json_1.PackageNotFoundError, err => void 0);
}
//# sourceMappingURL=getPackageInfo.js.map