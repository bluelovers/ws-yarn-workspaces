"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupYarnLockParsedEntries = groupYarnLockParsedEntries;
const parseYarnLockRowV1_1 = require("../v1/parseYarnLockRowV1");
const parseYarnLockRowV2_1 = require("../v2/parseYarnLockRowV2");
const reduceYarnLockParsedEntries_1 = require("./reduceYarnLockParsedEntries");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
const yarnlock_types_1 = require("@yarn-tool/yarnlock-types");
/**
 * 把一份已解析的 lockfile 依套件名分組，值為 `[版本, 解析結果]` 陣列。
 * Group one parsed lockfile by package name, with `[version, parse result]` pairs as values.
 *
 * 與 `reduceYarnLockParsedEntries` 的差別在於：這裡負責「挑解析器」與「套件名過濾」
 * 兩件版本相關的事，歸約本身則直接沿用同模組的通用實作。
 * Compared to `reduceYarnLockParsedEntries`, this function owns the two version-specific
 * concerns — picking the parser and filtering by package name — while delegating the actual
 * accumulation to the shared generic implementation.
 *
 * @param parsedOldPackage 已解析的 v1 或 v2 lockfile / A parsed v1 or v2 lockfile
 * @param options 選項，目前只有 `names` 過濾 / Options, currently only the `names` filter
 * @returns 套件名 → `[version, IParseNameAndVersionWithNpaResult][]` /
 *          Package name → `[version, IParseNameAndVersionWithNpaResult][]`
 * @throws lockfile 版本不受支援時拋出 / Thrown when the lockfile version is unsupported
 */
function groupYarnLockParsedEntries(parsedOldPackage, options) {
    /**
     * 具名的列解析器需依版本挑選，因此以 `let` 延後指派；
     * `fn` 一定會在下方的 assert 回呼內被賦值，TypeScript 無法自行推論這點。
     * The row parser depends on the lockfile version, so it is assigned late via `let`; `fn` is
     * always assigned inside the assert callback below, which TypeScript cannot infer on its
     * own.
     */
    let fn;
    /**
     * 用 assert 而非單純的 if：不支援的版本必須在這裡就失敗，
     * 否則 `fn` 會維持未初始化，等到回呼中才以難懂的 `undefined is not a function` 爆掉。
     * Uses an assert instead of a plain if: unsupported versions must fail here, otherwise `fn`
     * would stay uninitialized and only blow up later with an inscrutable
     * `undefined is not a function`.
     */
    (0, yarnlock_parse_assert_1.assertYarnLockParsedIsSupported)(parsedOldPackage, (verType, parsedOldPackage) => {
        if (verType === yarnlock_types_1.EnumDetectYarnLock.v1) {
            fn = parseYarnLockRowV1_1.parseYarnLockRowV1;
        }
        else {
            fn = parseYarnLockRowV2_1.parseYarnLockRowV2;
        }
    });
    let names = options === null || options === void 0 ? void 0 : options.names;
    /**
     * 空陣列與「未提供」必須等價：若保留空陣列，
     * 下方的 `names?.includes(...)` 會全部過濾掉，輸出變成空的。
     * An empty array must behave like "not provided": otherwise the `names?.includes(...)` check
     * below would filter everything out and yield an empty result.
     */
    if ((names === null || names === void 0 ? void 0 : names.length) === 0) {
        names = void 0;
    }
    return (0, reduceYarnLockParsedEntries_1.reduceYarnLockParsedEntries)({}, parsedOldPackage, (data, [packageName, packageData]) => {
        var _a, _b;
        const result = fn(packageName, packageData);
        const { name, version } = result;
        /**
         * `names?.includes(name) ?? true`：未設定 `names` 時一律收錄，設定後只保留指定套件。
         * 注意：`result` 為 `undefined`（該列解析失敗）時，上方的解構就已經拋錯，
         * 因此這個過濾條件無法用來略過壞列，只能縮小成功解析的範圍。
         * `names?.includes(name) ?? true`: everything is kept when `names` is unset, otherwise only
         * the listed packages are recorded. Note that a row failing to parse (`result` is
         * `undefined`) already throws at the destructuring above, so this filter cannot skip bad
         * rows — it only narrows the successfully parsed ones.
         */
        if ((_a = names === null || names === void 0 ? void 0 : names.includes(name)) !== null && _a !== void 0 ? _a : true) {
            (_b = data[name]) !== null && _b !== void 0 ? _b : (data[name] = []);
            data[name].push([version, result]);
        }
        return data;
    });
}
//# sourceMappingURL=groupYarnLockParsedEntries.js.map