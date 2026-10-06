"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYarnLockTag = updateYarnLockTag;
const fromContent_1 = require("@yarn-tool/yarnlock-entries/lib/fromContent");
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const semver_1 = require("semver");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const const_1 = require("@lazy-node/semver-ampersand/lib/const");
const parseSimpleSemVerRange_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange");
const package_json_1 = require("package-json");
const debug_color2_1 = require("debug-color2");
/**
 * 更新 yarn.lock（v1 與 Berry）中的 `tag` 與 `npm:` 別名 (alias) 項目，
 * 回傳新舊 lockfile 內容與差異報告；不直接寫入磁碟。
 *
 * Updates `tag` and `npm:` alias entries in a yarn.lock (v1 and Berry),
 * returning the old/new lockfile content and a diff report without touching
 * the disk.
 *
 * @param yarnlock_old 原始 lockfile 內容 / the original lockfile content
 * @returns 標準化的新舊內容、是否改變與更新報告 /
 * normalised old/new content, whether it changed, and the update report
 */
async function updateYarnLockTag(yarnlock_old) {
    /**
     * 先解析再重新序列化，確保新舊內容以同一套正規化 (normalise) 規則比較，
     * 避免僅因格式差異就被判定為有變動。
     *
     * Re-parse and re-serialise so old/new content is compared under the same
     * normalisation rules, avoiding false positives caused by formatting alone.
     */
    const obj = (0, fromContent_1.fromContent)(yarnlock_old);
    yarnlock_old = obj.stringify();
    /**
     * 報告採懶初始化 (lazy init)，沒有任何更新時保持空物件。
     *
     * The report is lazily initialised so it stays an empty object when nothing updates.
     */
    let report = {};
    /**
     * 以非同步映射逐一檢查每個項目，registry 查詢為 I/O 密集，需等待全部完成。
     *
     * Walk every entry with an async map; registry queries are I/O bound, so all of them must settle.
     */
    await obj.mapAsync(async (data, key) => {
        var _a, _b;
        /**
         * tag 項目：直接以原本的 tag 查詢目前可取得的最新版本。
         *
         * Tag entries: query the currently resolvable latest version with the original tag.
         */
        if (data.value.type === 'tag') {
            let { semver, version, name } = data.value;
            let version_new = await (0, queryVersion_1.queryVersionWithCache)(name, semver);
            /**
             * 只有新版本存在、字串不同且嚴格較高時才移除項目；
             * `gt` 檢查可避免降級 (downgrade) 與同版本的無謂改寫。
             *
             * Only remove the entry when a new version exists, differs as a string,
             * and is strictly greater; the `gt` check prevents downgrades and
             * pointless rewrites of the same version.
             */
            if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version && (0, semver_1.gt)(version_new, version)) {
                obj.del(key);
                (_a = report.removed) !== null && _a !== void 0 ? _a : (report.removed = {});
                report.removed[key] = {
                    from: version,
                    to: version_new,
                };
            }
        }
        /**
         * 別名 (alias) 項目：例如 `pkg@npm:other@^1.0.0`，需先拆解 sub-spec 才能查詢。
         *
         * Alias entries such as `pkg@npm:other@^1.0.0` need their sub-spec parsed before querying.
         */
        else if (data.value.type === 'alias') {
            let npaResult = (0, npm_package_arg_util_1.npa)(data.key);
            //			console.dir({
            //				data,
            //				npaResult,
            //			})
            /**
             * 僅處理 npm: 前綴的別名，其他 spec 型別交由 yarn 原本的解析行為決定。
             *
             * Only npm:-prefixed aliases are handled; other spec types keep yarn's own resolution.
             */
            if (npaResult.rawSpec.startsWith('npm:')) {
                let name = npaResult.subSpec.name;
                let version = data.value.version;
                let semver;
                let version_new;
                /**
                 * 依 sub-spec 型別推導要查詢的 semver range：
                 * 範圍型別保留原樣（多範圍亦然），
                 * 固定版本改用 `^` 以便升級到同次版本 (minor) 的更新版本。
                 *
                 * Derive the semver range to query by sub-spec type: ranges are kept
                 * as-is (including multi-part ranges), while exact versions are
                 * widened to `^` so newer compatible versions can be found.
                 */
                if (npaResult.subSpec.type === 'range') {
                    /**
                     * `*` / `any` 之類的萬用範圍無法表達「高於目前版本」，
                     * 因此改為 `>目前版本`，確保查詢結果一定比鎖定版本新。
                     *
                     * Wildcard ranges like `*`/`any` cannot express "newer than the
                     * current version", so `>current` guarantees a strictly newer result.
                     */
                    if (npaResult.subSpec.fetchSpec === const_1.EnumSemverVersion.ANY || npaResult.subSpec.fetchSpec === const_1.EnumSemverVersion.STAR) {
                        semver = '>' + version;
                    }
                    else if ((0, parseSimpleSemVerRange_1.parseSimpleSemVerRange)(npaResult.subSpec.fetchSpec).length > 1) {
                        semver = npaResult.subSpec.fetchSpec;
                    }
                    else {
                        semver = npaResult.subSpec.fetchSpec;
                    }
                }
                else if (npaResult.subSpec.type === 'tag') {
                    semver = npaResult.subSpec.fetchSpec;
                }
                else if (npaResult.subSpec.type === 'version') {
                    semver = '^' + version;
                }
                /**
                 * 未列於上述分支的 sub-spec 型別會使 semver 保持 undefined，
                 * 以此守衛 (guard) 略過查詢，避免以無效 range 呼叫 registry；
                 * 查詢時若版本不存在僅發出警告並回傳 null，
                 * 讓單一失效的項目不至於中斷整批 lockfile 更新。
                 *
                 * Sub-spec types not covered above leave semver undefined, so this
                 * guard skips the query instead of hitting the registry with an
                 * invalid range; a missing version only warns and resolves to null,
                 * so one broken entry cannot abort the whole lockfile update.
                 */
                if (typeof semver === 'string') {
                    version_new = await (0, queryVersion_1.queryVersionWithCache)(name, semver)
                        .catch(package_json_1.VersionNotFoundError, (e) => {
                        debug_color2_1.console.warn(String(e), `, by '${data.key}'`);
                        return null;
                    });
                }
                /**
                 * 與 tag 分支相同的嚴格升級判斷，
                 * 確保只有真的找到較新版本才移除別名項目。
                 *
                 * Same strict upgrade check as the tag branch, ensuring an alias
                 * entry is only removed when a newer version was actually found.
                 */
                if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version && (0, semver_1.gt)(version_new, version)) {
                    obj.del(key);
                    (_b = report.removed) !== null && _b !== void 0 ? _b : (report.removed = {});
                    report.removed[key] = {
                        from: version,
                        to: version_new,
                    };
                }
            }
        }
    });
    /**
     * 重新序列化取得最終內容，與標準化後的舊內容比對即可判斷是否真的有變動。
     *
     * Re-serialise to get the final content; comparing it with the normalised
     * old content tells whether anything actually changed.
     */
    let yarnlock_new = obj.stringify();
    return {
        yarnlock_old,
        yarnlock_new,
        yarnlock_changed: yarnlock_old !== yarnlock_new,
        report,
    };
}
//# sourceMappingURL=updateYarnLockTag.js.map