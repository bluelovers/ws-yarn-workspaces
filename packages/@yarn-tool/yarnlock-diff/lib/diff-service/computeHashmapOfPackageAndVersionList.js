"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeHashmapOfPackageAndVersionList = computeHashmapOfPackageAndVersionList;
const parseYarnLockRowV1_1 = require("@yarn-tool/yarnlock-util/lib/v1/parseYarnLockRowV1");
const parseYarnLockRowV2_1 = require("@yarn-tool/yarnlock-util/lib/v2/parseYarnLockRowV2");
const array_hyper_unique_1 = require("array-hyper-unique");
const semver_1 = require("semver");
const reduceYarnLockParsedEntries_1 = require("@yarn-tool/yarnlock-util/lib/util/reduceYarnLockParsedEntries");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
/**
 * `reduce` 的疊代器：把一份已解析的 lockfile 攤平並累加到對照表上。
 * The `reduce` accumulator: flatten one parsed lockfile and merge it into the map.
 *
 * 採用 `Array.prototype.reduce` 形式（ accumulator 在前）是為了直接串在
 * `reduceYarnLockParsedEntries` 之上，不必先展開成中間陣列。
 * The reduce-style signature (accumulator first) lets it chain directly onto
 * `reduceYarnLockParsedEntries` without materializing an intermediate array.
 *
 * @param alreadyComputedPackage 已累加的對照表 / The map accumulated so far
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @returns 累加後的對照表；每一輪都會重新去重並以鬆散 semver 排序 / The accumulated map,
 *          re-deduplicated and sorted with loose semver on every pass
 */
function computeHashmapOfPackageAndVersionList(alreadyComputedPackage, parsedOldPackage) {
    /**
     * 具名的列解析器需依版本挑選，因此以 `let` 延後指派；
     * `fn` 一定會在下方的 assert 回呼內被賦值，TypeScript 無法自行推論這點。
     * The row parser depends on the lockfile version, so it is assigned late via `let`; `fn` is
     * always assigned inside the assert callback below, which TypeScript cannot infer on its own.
     */
    let fn;
    /**
     * 用 assert 而非單純的 if：不支援的版本（例如未來的 v4）必須在這裡就失敗，
     * 否則後續會用錯誤的解析器產生看似合理的錯誤資料。
     * Uses an assert instead of a plain if: unsupported versions (such as a future v4) must fail
     * here, otherwise the wrong parser would produce plausible-looking but wrong data.
     */
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage, (verType, parsedOldPackage) => {
        if (verType === yarnlock_types_1.EnumDetectYarnLock.v1) {
            fn = parseYarnLockRowV1_1.parseYarnLockRowV1;
        }
        else {
            fn = parseYarnLockRowV2_1.parseYarnLockRowV2;
        }
    });
    /*
    if (isYarnLockParsedV1(parsedOldPackage))
    {
        fn = v1
    }
    else if (isYarnLockParsedV2(parsedOldPackage))
    {
        fn = v2
    }
    else
    {
        throw new TypeError(`can't detect yarn.lock version`)
    }
     */
    /**
     * 逐列解析後累加：某些列（例如僅供相依性參考、無法解析出名稱的列）會回傳空值，
     * 這類列必須略過，否則會寫入 `undefined` 鍵並污染比對結果。
     * Parse and accumulate row by row: some rows (such as reference-only rows that yield no
     * name) return an empty value and must be skipped, otherwise an `undefined` key would be
     * written into the map and corrupt the comparison.
     */
    alreadyComputedPackage = (0, reduceYarnLockParsedEntries_1.reduceYarnLockParsedEntries)(alreadyComputedPackage, parsedOldPackage, (alreadyComputedPackage, [packageName, packageData]) => {
        var _a;
        var _b;
        const result = fn(packageName, packageData);
        if (typeof result !== 'undefined' && result !== null) {
            (_a = alreadyComputedPackage[_b = result.name]) !== null && _a !== void 0 ? _a : (alreadyComputedPackage[_b] = []);
            alreadyComputedPackage[result.name].push(result.version);
        }
        return alreadyComputedPackage;
    });
    /**
     * 每一輪都要重新整理：同一個套件可能在多份 lockfile 中出現、
     * 或在 lockfile 內被多個相依性以不同範圍重複列出，不去重會導致表格重複列印。
     * Re-normalize on every pass: the same package may appear across several lockfiles, or be
     * listed multiple times inside one lockfile for different ranges; without deduplication the
     * table would print duplicate rows.
     */
    Object.keys(alreadyComputedPackage)
        .forEach((name) => {
        (0, array_hyper_unique_1.array_unique_overwrite)(alreadyComputedPackage[name]);
        /**
         * `compareLoose` 而非嚴格 semver 比較：lockfile 內可能含有
         * 無法完全解析的版本字串，鬆散比較只會退化而不會拋錯。
         * `compareLoose` rather than a strict semver comparison: lockfiles can contain
         * version strings that do not parse strictly, and a loose comparison degrades
         * gracefully instead of throwing.
         */
        alreadyComputedPackage[name].sort(semver_1.compareLoose);
    });
    return alreadyComputedPackage;
}
//# sourceMappingURL=computeHashmapOfPackageAndVersionList.js.map