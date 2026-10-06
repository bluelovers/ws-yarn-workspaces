"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUpdateAbleVersionByNpmPackageArgResult = isUpdateAbleVersionByNpmPackageArgResult;
exports.isUpdateAbleVersion = isUpdateAbleVersion;
exports.handleSemverForDependencies = handleSemverForDependencies;
const tslib_1 = require("tslib");
/**
 * 依賴版本是否可更新的判斷 (Decide whether a dependency version can be updated)
 *
 * 只有「單一且可比對」的 semver range 才能安全地改寫成新的版本，
 * 複雜 range（例如 `>=1 <3 || ^4`）改寫後可能破壞原本的約束。
 *
 * Only a single, comparable semver range can be safely rewritten to a new
 * version; rewriting complex ranges such as `>=1 <3 || ^4` could break the
 * original constraint.
 */
const npm_package_arg_util_1 = tslib_1.__importDefault(require("@yarn-tool/npm-package-arg-util"));
const detect_1 = require("@yarn-tool/npm-package-arg-util/lib/detect");
const parseSimpleSemVerRange_1 = tslib_1.__importDefault(require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange"));
const checker_1 = require("@lazy-node/semver-simple-parse/lib/checker");
/**
 * 依 npa 結果判斷版本是否可更新 (Decide updateability from an npa result)
 *
 * Decide whether the version of an npa result can be updated.
 *
 * @param npaResult `npa()` 的解析結果 (The result of `npa()`)
 *
 * @returns 可更新時回傳該 range 物件；非 registry 結果、tag 或不可更新時回傳 `undefined`
 *
 * The range object when updatable, otherwise `undefined` (non-registry
 * result, tag, or an un-updatable range).
 */
function isUpdateAbleVersionByNpmPackageArgResult(npaResult) {
    /**
     * tag（如 `latest`）的 `fetchSpec` 不是 semver range，直接略過以免誤判
     *
     * A tag such as `latest` has a non-semver fetchSpec, so it is skipped to
     * avoid a false positive.
     */
    if ((0, detect_1.isRegistryResult)(npaResult) && npaResult.type !== 'tag') {
        return isUpdateAbleVersion(npaResult.fetchSpec);
    }
}
/**
 * 判斷 semver range 是否可更新 (Decide whether a semver range is updatable)
 *
 * Decide whether a semver range is a single updatable comparator.
 *
 * @param version semver range 字串，例如 `^1.2.3` (A semver range such as `^1.2.3`)
 *
 * @returns 可更新時回傳解析後的 range 物件；否則回傳 `undefined`
 *
 * The parsed range object when updatable, otherwise `undefined`.
 */
function isUpdateAbleVersion(version) {
    const list = (0, parseSimpleSemVerRange_1.default)(version);
    /**
     * 只接受單一段落：多段 range 組合起來語意複雜，改寫有破壞約束的風險
     *
     * Only a single segment is accepted: combined ranges are complex enough that
     * rewriting them risks changing the intended constraint.
     */
    if (list.length === 1) {
        let semver = list[0];
        /**
         * 物件化檢查可過濾掉純字元之類無法參與比較的解析結果
         *
         * The object-like check filters out parse results such as bare characters
         * that cannot take part in a comparison.
         */
        if ((0, checker_1.isSimpleSemVerObjectLike)(semver)) {
            return semver;
        }
    }
}
/**
 * 檢查依賴字串是否可更新 (Check whether a dependency specifier is updatable)
 *
 * Check whether a dependency specifier can be updated.
 *
 * @param packageName 含或不含版本的套件字串 (Package string with or without a version)
 *
 * @returns 可更新時回傳 range 物件，否則回傳 `undefined`
 *
 * The range object when updatable, otherwise `undefined`.
 */
function handleSemverForDependencies(packageName) {
    const result = (0, npm_package_arg_util_1.default)(packageName);
    return isUpdateAbleVersionByNpmPackageArgResult(result);
}
//# sourceMappingURL=handleSemverForDependencies.js.map