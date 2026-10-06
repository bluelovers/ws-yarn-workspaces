"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumIsPublishedState = void 0;
exports._isPublishedCoreByNpaResult = _isPublishedCoreByNpaResult;
exports._isPublishedCore = _isPublishedCore;
exports._isPublishedCoreByPackageJSON = _isPublishedCoreByPackageJSON;
exports.isPublishedByNpaResult = isPublishedByNpaResult;
exports.isPublished = isPublished;
exports.isPublishedByPackageJSON = isPublishedByPackageJSON;
const tslib_1 = require("tslib");
/**
 * 檢查 npm 套件是否已發布
 * Check whether an npm package is published
 *
 * 對 registry 的查詢一律以 Promise 表達，
 * package-json 抛出的 PackageNotFoundError / VersionNotFoundError
 * 會在內部轉為結構化結果，避免呼叫端需處理多種例外。
 *
 * Registry lookups are always expressed as a Promise; the
 * PackageNotFoundError / VersionNotFoundError thrown by package-json are
 * converted into structured results so callers need not catch many errors.
 */
const npa_to_deps_query_1 = require("@yarn-tool/npa-to-deps-query");
const npa_to_deps_1 = require("@yarn-tool/npa-to-deps");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const package_json_1 = require("package-json");
/**
 * 查詢狀態列舉：以數值編碼便於快取與序列化
 * Query state enum: numeric codes ease caching and serialization
 */
var EnumIsPublishedState;
(function (EnumIsPublishedState) {
    /** 套件存在且版本符合 / Package exists and the version matches */
    EnumIsPublishedState[EnumIsPublishedState["VersionPublished"] = 0] = "VersionPublished";
    /** 套件存在但版本不存在 / Package exists, but the version does not */
    EnumIsPublishedState[EnumIsPublishedState["VersionNotFound"] = 1] = "VersionNotFound";
    /** 整個套件不存在 / The package itself does not exist */
    EnumIsPublishedState[EnumIsPublishedState["PackageNotFound"] = 2] = "PackageNotFound";
})(EnumIsPublishedState || (exports.EnumIsPublishedState = EnumIsPublishedState = {}));
/**
 * 以 npa 解析結果查詢是否已發布（核心）
 * Query published state from an npa result (core)
 *
 * 依序處理「版本查不到」再「套件查不到」：
 * 特定於版本的失敗先被攔下並標為 VersionNotFound，
 * 套件層級的失敗則留給最後一段作為兜底。
 *
 * Handles "version missing" first, then "package missing": a version-specific
 * failure is intercepted first as VersionNotFound, while the package-level
 * failure is left as the last-resort fallback.
 *
 * @param depsResult - npa 解析結果（可為 Promise）/ npa result (may be a Promise)
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
function _isPublishedCoreByNpaResult(depsResult, options) {
    return bluebird_1.default.resolve(depsResult)
        .then(depsResult => {
        return (0, npa_to_deps_query_1.queryDepsValueByNpaResult)({
            ...depsResult,
            /** 空 operator 讓查詢回傳精確匹配的單一值而非套用範圍運算 / Empty operator makes the query return the exact matching value instead of applying a range operator */
            operator: '',
            /** 要求 fetchQuery=true 以便取得 registry 實際發布的版本 / Request fetchQuery=true to obtain the actually published version */
            fetchQuery: true,
        }, options)
            .then((queryResult) => {
            /** 只有完全相等才算已發布；範圍符合但版本不同不算 / Only exact equality counts as published; a matching range with a different version does not */
            const isPublished = depsResult.semver === queryResult.value;
            return {
                depsResult,
                queryResult,
                exists: true,
                isPublished,
                state: isPublished ? 0 /* EnumIsPublishedState.VersionPublished */ : 1 /* EnumIsPublishedState.VersionNotFound */,
            };
        })
            .catch(package_json_1.VersionNotFoundError, err => {
            /**
             * 套件查得到、版本查不到：
             * 例外在此轉為結果，呼叫端不需自行 catch
             *
             * Package found but version missing:
             * convert the exception into a result here so callers need not catch
             */
            return {
                depsResult,
                exists: true,
                isPublished: false,
                state: 1 /* EnumIsPublishedState.VersionNotFound */,
            };
        })
            .catch(package_json_1.PackageNotFoundError, err => {
            /**
             * 套件本身不存在：isPublished 用 null 表示「未知」，
             * 與「查到了但不符合」的 false 區分
             *
             * The package itself is missing: isPublished is null ("unknown")
             * to distinguish it from false ("found but not matching")
             */
            return {
                depsResult,
                exists: false,
                isPublished: null,
                state: 2 /* EnumIsPublishedState.PackageNotFound */,
            };
        });
    });
}
/**
 * 以輸入字串查詢是否已發布（核心）
 * Query published state from an input string (core)
 *
 * 先以 npa 解析輸入，再委派給 _isPublishedCoreByNpaResult；
 * 以 .then() 串接可確保解析失敗也走 Promise 路徑而非同步拋錯。
 *
 * Parses the input with npa, then delegates to _isPublishedCoreByNpaResult;
 * chaining via .then() keeps parse failures on the Promise path instead of
 * throwing synchronously.
 *
 * @param input - npm 規格字串 / npm spec string
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
function _isPublishedCore(input, options) {
    return bluebird_1.default.resolve()
        .then(() => {
        return (0, npa_to_deps_1.npaToDepsValue)(input, options);
    })
        .then((result) => {
        return _isPublishedCoreByNpaResult(result, options);
    });
}
/**
 * 以 package.json 物件查詢是否已發布（核心）
 * Query published state from a package.json object (core)
 *
 * 組合成 `${name}@${version}` 可沿用與字串輸入完全相同的解析與查詢流程。
 * Composing `${name}@${version}` reuses the exact same parse/query path as string input.
 *
 * @param pkg - 含 name 與 version 的物件 / Object with name and version
 * @param options - registry 查詢選項 / Registry query options
 * @returns 結構化查詢結果 / Structured query result
 */
function _isPublishedCoreByPackageJSON(pkg, options) {
    return _isPublishedCore(`${pkg.name}@${pkg.version}`, options);
}
/**
 * 以 npa 解析結果查詢是否已發布
 * Query whether published from an npa result
 *
 * @param depsResult - npa 解析結果（可為 Promise）/ npa result (may be a Promise)
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
function isPublishedByNpaResult(depsResult, options) {
    return _isPublishedCoreByNpaResult(depsResult, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
/**
 * 以輸入字串查詢是否已發布
 * Query whether published from an input string
 *
 * @param input - npm 規格字串，如 `pkg@1.0.0` / npm spec string, e.g. `pkg@1.0.0`
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
function isPublished(input, options) {
    return _isPublishedCore(input, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
/**
 * 以 package.json 物件查詢是否已發布
 * Query whether published from a package.json object
 *
 * @param pkg - 含 name 與 version 的物件 / Object with name and version
 * @param options - registry 查詢選項 / Registry query options
 * @returns true=已發布、false=版本不存在、null=套件不存在 / true=published, false=version missing, null=package missing
 */
function isPublishedByPackageJSON(pkg, options) {
    return isPublished(`${pkg.name}@${pkg.version}`, options);
}
/**
 * 預設匯出為最常見的「檢查自己的 package.json」情境
 * Default export targets the commonest case: checking your own package.json
 */
exports.default = isPublishedByPackageJSON;
//# sourceMappingURL=index.js.map