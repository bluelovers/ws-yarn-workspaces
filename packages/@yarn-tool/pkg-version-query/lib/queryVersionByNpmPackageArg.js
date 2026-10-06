"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVersionByNpmPackageArg = parseVersionByNpmPackageArg;
exports._parseVersionByNpmPackageArgCore = _parseVersionByNpmPackageArgCore;
exports.queryVersionByNpmPackageArgWithCache = queryVersionByNpmPackageArgWithCache;
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const queryVersion_1 = require("./queryVersion");
/**
 * 把 npm 套件參數字串（如 `lodash@^4.0.0`）解析成名稱與版本兩段，
 * 對應 npm/yarn 指令列慣用的 `<pkg>[@<version>]` 語法，
 * 讓呼叫端不必自己切字串（版本範圍內可能含 @，手動分割會切錯）。
 *
 * Parses an npm package argument string such as `lodash@^4.0.0` into name + version,
 * matching the `<pkg>[@<version>]` CLI convention. Hand-splitting is avoided because
 * a version range itself may contain `@` (e.g. `@scope/pkg@^1.0.0`).
 *
 * @param input npm 套件參數字串 / npm package argument string
 * @returns 名稱與版本物件 / An object holding name and version
 */
function parseVersionByNpmPackageArg(input) {
    return _parseVersionByNpmPackageArgCore((0, npm_package_arg_util_1.npa)(input));
}
/**
 * 從 npa 解析結果取出本次查詢真正需要的欄位，
 * 拆成 core 版是為了隔離 npa 的回傳型別，避免其內部型別變動影響對外 API。
 *
 * Extracts only the fields this package needs from an npa result.
 * The core split isolates npa's return type so its internal type changes
 * do not leak into this package's public API.
 *
 * @param result npa 的解析結果 / An npa parse result
 * @returns 名稱與版本物件 / An object holding name and version
 */
function _parseVersionByNpmPackageArgCore(result) {
    const { name, fetchSpec: version } = result;
    return {
        name,
        version,
    };
}
/**
 * 以 npm 套件參數語法查詢版本（含快取），
 * 等同於先 parse 再呼叫 queryVersionWithCache，方便直接吃 CLI 風格輸入。
 *
 * Queries a version with cache support using npm package argument syntax;
 * equivalent to parsing first and then calling queryVersionWithCache,
 * which lets callers pass CLI-style input directly.
 *
 * @param input npm 套件參數字串，如 `lodash@^4.0.0` / npm package argument, e.g. `lodash@^4.0.0`
 * @param options 查詢與快取選項 / Query and cache options
 * @returns 解析出的版本字串 / The resolved version string
 */
function queryVersionByNpmPackageArgWithCache(input, options) {
    const { name, version } = parseVersionByNpmPackageArg(input);
    return (0, queryVersion_1.queryVersionWithCache)(name, version, options);
}
exports.default = queryVersionByNpmPackageArgWithCache;
//# sourceMappingURL=queryVersionByNpmPackageArg.js.map