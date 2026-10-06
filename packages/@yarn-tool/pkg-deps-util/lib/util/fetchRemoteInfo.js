"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRemoteInfo = fetchRemoteInfo;
const tslib_1 = require("tslib");
/**
 * 批次查詢遠端套件版本 (Batch query of remote package versions)
 *
 * 把使用者輸入的套件字串拆成名稱與版本條件，再向 registry 查詢實際可用版本，
 * 供後續與 yarn.lock 的條目比對。
 *
 * Splits each user input into name and version criteria, queries the registry
 * for the usable version, and feeds the result into the yarn.lock comparison.
 */
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
/**
 * 查詢多個套件的遠端版本資訊 (Query remote version info for multiple packages)
 *
 * Query remote version info for a list of packages.
 *
 * @param packageNames 套件名稱或查詢字串的清單 (List of names or specifiers)
 * @param options 查詢選項，含 `queryOptions` 與 lock 分組設定
 *                Query options, including `queryOptions` and lock grouping settings
 *
 * @returns 以套件名稱為鍵的查詢結果，值含解析資料與 `versionQuery`
 *
 * A record keyed by package name; each value holds the parsed data and the
 * resolved `versionQuery`.
 */
function fetchRemoteInfo(packageNames, options = {}) {
    /**
     * 以 `Bluebird.reduce` 依序查詢：registry 對並發有速率限制，
     * 且依序執行可確保回傳的插入順序與輸入一致。
     *
     * Sequential via Bluebird.reduce: registries rate-limit concurrency, and
     * ordering stays identical to the input order.
     */
    return bluebird_1.default.resolve(packageNames)
        .reduce(async (data, input) => {
        const result = (0, parseArgvPkgName_1.parsePackageName)(input);
        /**
         * 帶 cache 查詢，重複安裝同一套件時避免重複打 registry
         *
         * Cached query avoids hitting the registry again for repeat installs.
         */
        const versionQuery = await (0, queryVersion_1.queryVersionWithCache)(result.name, result.semver, options.queryOptions);
        /**
         * 以名稱為鍵寫入；同名後者覆蓋前者，與使用者預期「以最後一次查詢為準」一致
         *
         * Keyed by name; a later entry overwrites an earlier one, matching the
         * expectation that the last query wins.
         */
        // @ts-ignore
        data[result.name] = {
            ...result,
            versionQuery,
        };
        return data;
    }, {});
}
//# sourceMappingURL=fetchRemoteInfo.js.map