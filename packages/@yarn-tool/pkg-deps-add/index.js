"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumResultAddDependencies = void 0;
exports._checkDependenciesExists = _checkDependenciesExists;
exports.checkDependenciesExists = checkDependenciesExists;
exports._checkDependenciesExistsAll = _checkDependenciesExistsAll;
exports.checkDependenciesExistsAll = checkDependenciesExistsAll;
exports._add_to_deps_field_core = _add_to_deps_field_core;
exports._add_to_deps_field = _add_to_deps_field;
exports.addDependencies = addDependencies;
exports.addDependenciesIfNotExists = addDependenciesIfNotExists;
exports.addDependenciesOverwrite = addDependenciesOverwrite;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
/**
 * 寫入依賴的結果列舉 (Result of adding a dependency)
 *
 * 刻意跳過 0，讓 `null`（完全未寫入任何欄位）可與這兩個狀態明確區分。
 *
 * 0 is deliberately skipped so `null` (nothing written at all) stays distinct
 * from these two states.
 */
var EnumResultAddDependencies;
(function (EnumResultAddDependencies) {
    /**
     * 本次有寫入或更新 (Written or updated by this call)
     */
    EnumResultAddDependencies[EnumResultAddDependencies["changed"] = 2] = "changed";
    /**
     * 套件已存在且未變更 (Already present, unchanged)
     */
    EnumResultAddDependencies[EnumResultAddDependencies["exists"] = 1] = "exists";
})(EnumResultAddDependencies || (exports.EnumResultAddDependencies = EnumResultAddDependencies = {}));
/**
 * 檢查單一依賴記錄是否含指定套件 (Check a single dependency record for a package)
 *
 * Check whether one dependency record contains the given package.
 *
 * @param record 依賴欄位的鍵值對，可為唯讀陣列型別的版本字串
 *               The dependency record, whose values may be readonly string arrays
 * @param name 套件名稱 (Package name)
 *
 * @returns 型別守衛：`true` 時保證該鍵存在且版本字串非空
 *
 * A type guard: when `true`, the key is guaranteed to exist with a non-empty
 * version value.
 */
function _checkDependenciesExists(record, name) {
    var _a;
    /**
     * 先確認 `record` 可能存在（欄位本身可能未定義），再檢查長度大於 0
     *
     * The record itself may be undefined, so it is null-checked before the
     * length test, which also rejects empty version strings.
     */
    return ((_a = record === null || record === void 0 ? void 0 : record[name]) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
/**
 * 檢查指定依賴欄位是否含指定套件 (Check one dependency field for a package)
 *
 * Check whether a specific dependency field lists the given package.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 *
 * @returns 型別守衛：成功時把 `pkg` 窄化成含該欄位與該套件的型別
 *
 * A type guard that narrows `pkg` to include the field and the package.
 */
function checkDependenciesExists(pkg, field, name) {
    return _checkDependenciesExists(pkg[field], name);
}
/**
 * 依指定欄位清單逐一檢查存在性 (Check existence across a list of fields)
 *
 * Check several dependency fields at once and report every hit.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param fields 要檢查的依賴欄位清單 (Dependency fields to check)
 * @param name 套件名稱 (Package name)
 *
 * @returns 以欄位為鍵的布林值，另含 `_field`（命中的欄位）與 `_exists`（是否有任一命中）
 *
 * Booleans keyed by field, plus `_field` (the matching fields) and `_exists`
 * (whether any field matched).
 */
function _checkDependenciesExistsAll(pkg, fields, name) {
    return fields
        .reduce((map, field) => {
        map[field] = checkDependenciesExists(pkg, field, name);
        /**
         * 只有命中時才累積 `_field` 與 `_exists`，
         * 讓回傳值同時提供「哪個欄位」與「是否存在」兩種資訊。
         *
         * Hits accumulate into `_field` and `_exists`, so the result answers
         * both "which field" and "does it exist anywhere".
         */
        if (map[field]) {
            map._field.push(field);
            map._exists = map[field];
        }
        return map;
    }, {
        _exists: false,
        _field: [],
    });
}
/**
 * 檢查四種依賴欄位是否含指定套件 (Check all dependency fields for a package)
 *
 * Check every dependency field for the given package.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 *
 * @returns 同 {@link _checkDependenciesExistsAll}，欄位固定為 `packageJsonDependenciesFields`
 *
 * Same as {@link _checkDependenciesExistsAll} with the fields fixed to
 * `packageJsonDependenciesFields`.
 */
function checkDependenciesExistsAll(pkg, name) {
    return _checkDependenciesExistsAll(pkg, types_1.packageJsonDependenciesFields, name);
}
/**
 * 欄位層的核心寫入 (Low-level write into a dependency field)
 *
 * Core write that only ensures the field object exists before assigning.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 *
 * @returns 同一個 `pkg`（就地修改）
 *
 * The same `pkg`, mutated in place.
 */
function _add_to_deps_field_core(pkg, field, name, semver) {
    var _a;
    /**
     * 欄位可能整個不存在（例如全新的 `package.json`），先建立空物件避免拋錯
     *
     * The whole field may be absent (fresh package.json), so it is created first
     * to avoid writing into undefined.
     */
    (_a = pkg[field]) !== null && _a !== void 0 ? _a : (pkg[field] = {});
    pkg[field][name] = semver;
    return pkg;
}
/**
 * 依覆寫策略把套件寫入指定欄位 (Write a package into a field by overwrite policy)
 *
 * Write a package into one dependency field honouring the overwrite policy.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param override 已存在時是否仍覆寫 (Whether to overwrite when it already exists)
 * @param bool 進入本函式前的結果，供多欄位呼叫端累積狀態
 *             Result so far, accumulated by callers that write several fields
 * @param existsOnly `true` 只在已存在時覆寫、`false` 只在不存在時新增
 *                   `true` overwrites only existing entries, `false` only adds new ones
 *
 * @returns 更新後的 `EnumResultAddDependencies`，未發生變更時沿用傳入的 `bool`
 *
 * The updated `EnumResultAddDependencies`, or the incoming `bool` when nothing
 * changed.
 */
function _add_to_deps_field(pkg, field, name, semver, override, bool, existsOnly) {
    var _a;
    const record = (_a = pkg[field]) !== null && _a !== void 0 ? _a : {};
    const current = record[name];
    /**
     * 版本完全相同時直接回傳原結果，避免把「無變更」誤報成 `changed`
     *
     * An identical version short-circuits, so "no change" is never reported as
     * `changed`.
     */
    if (current !== semver) {
        const length = current === null || current === void 0 ? void 0 : current.length;
        /**
         * `existsOnly` 採三態設計：三種情況各自的寫入條件不同，
         * 合併成單一布林值會喪失「只更新既有依賴」這種常見需求。
         *
         * `existsOnly` is a three-state switch because each mode has its own write
         * condition; collapsing it into a boolean would lose the common
         * "update only what is already listed" behaviour.
         */
        if (existsOnly === true) {
            if (length) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        else if (existsOnly === false) {
            if (!length) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        else {
            if (!length || override === true) {
                _add_to_deps_field_core(pkg, field, name, semver);
                bool = 2 /* EnumResultAddDependencies.changed */;
            }
        }
        /**
         * 已有值卻未寫入時標記為 `exists`；用 `??=` 是為了不覆蓋剛剛設定的 `changed`。
         *
         * An existing value that was not rewritten becomes `exists`; `??=` keeps
         * a freshly assigned `changed` from being overwritten.
         */
        if (length) {
            bool !== null && bool !== void 0 ? bool : (bool = 1 /* EnumResultAddDependencies.exists */);
        }
    }
    return bool;
}
/**
 * 把套件新增到指定的依賴欄位 (Add a package to the chosen dependency fields)
 *
 * Add a package to the dependency fields selected by the options.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 * @param override 已存在時是否仍覆寫 (Whether to overwrite when it already exists)
 * @param existsOnly `true` 只在已存在時覆寫、`false` 只在不存在時新增
 *                   `true` overwrites only existing entries, `false` only adds new ones
 *
 * @returns `{ pkg, bool }`：`pkg` 為被修改的物件，`bool` 為結果列舉；
 * 未指定任何欄位或完全未寫入時 `bool` 為 `null`。
 *
 * `{ pkg, bool }` where `pkg` is the mutated object and `bool` is the result
 * enum; `bool` is `null` when no field was selected or nothing was written.
 */
function addDependencies(pkg, name, semver, options = {}, override, existsOnly) {
    let bool = null;
    /**
     * 三種特殊欄位各自判斷：可能同時啟用（例如 `--dev --peer`），
     * 因此不能用 else-if 只取其中一個。
     *
     * Each special field is tested independently because several may be enabled
     * at once (e.g. `--dev --peer`), so else-if would drop one of them.
     */
    if (options.dev) {
        bool = _add_to_deps_field(pkg, 'devDependencies', name, semver, override, bool, existsOnly);
    }
    if (options.peer) {
        bool = _add_to_deps_field(pkg, 'peerDependencies', name, semver, override, bool, existsOnly);
    }
    if (options.optional) {
        bool = _add_to_deps_field(pkg, 'optionalDependencies', name, semver, override, bool, existsOnly);
    }
    /**
     * 只有在沒有任何特殊欄位被啟用（`bool` 仍為 `null`）時才寫入 `dependencies`，
     * 讓一般情況與 `--dev` 之類的選項互斥，避免同一套件被寫進兩個欄位。
     *
     * `dependencies` is only written when no special field was selected
     * (`bool` is still null), keeping the default path mutually exclusive with
     * flags like `--dev` so one package is not written into two fields.
     */
    if (bool === null) {
        bool = _add_to_deps_field(pkg, 'dependencies', name, semver, override, bool, existsOnly);
    }
    return {
        pkg,
        bool,
    };
}
/**
 * 僅在不存在時新增依賴 (Add the dependency only if missing)
 *
 * Add the dependency only when it is not already listed.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 *
 * @returns 同 {@link addDependencies}，且 `override` 固定為 `false`
 *
 * Same as {@link addDependencies} with `override` fixed to `false`.
 */
function addDependenciesIfNotExists(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, false);
}
/**
 * 一律覆寫依賴版本 (Always overwrite the dependency version)
 *
 * Overwrite the dependency version unconditionally.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 *
 * @returns 同 {@link addDependencies}，且 `override` 固定為 `true`
 *
 * Same as {@link addDependencies} with `override` fixed to `true`.
 */
function addDependenciesOverwrite(pkg, name, semver, options = {}) {
    return addDependencies(pkg, name, semver, options, true);
}
/**
 * 預設匯出 `addDependencies` (Default export)
 *
 * The default export is `addDependencies`.
 */
exports.default = addDependencies;
//# sourceMappingURL=index.js.map