import { IResult } from '@yarn-tool/npm-package-arg-util/lib/types';
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
export declare function isUpdateAbleVersionByNpmPackageArgResult<T extends IResult>(npaResult: T): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & Required<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVerObjectBaseCoreOperator> & {
    major?: never;
} & {
    major: string;
});
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
export declare function isUpdateAbleVersion(version: string): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & Required<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVerObjectBaseCoreOperator> & {
    major?: never;
} & {
    major: string;
});
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
export declare function handleSemverForDependencies(packageName: string): import("@lazy-node/semver-simple-parse/lib/types").IToSimpleSemVerObject<import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer>> | (import("@lazy-node/semver-simple-parse/lib/SimpleSemVer").SimpleSemVer<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVer> & Required<import("@lazy-node/semver-simple-parse/lib/types").ISimpleSemVerObjectBaseCoreOperator> & {
    major?: never;
} & {
    major: string;
});
