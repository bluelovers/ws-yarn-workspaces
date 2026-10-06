"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.formatPackageTag = formatPackageTag;
/**
 * 驗證並補齊標籤選項
 * Validate and fill in tag options
 *
 * @param options - 原始輸入選項 / Raw input options
 * @returns 補齊後的選項 / Completed options
 * @throws Error 當版本或（需要時）名稱缺失時 / When the version or, if required, the name is missing
 */
function handleOptions(options) {
    var _a, _b, _c;
    /** 版本優先取明確欄位，其次才回頭讀 pkg，讓覆寫較直覺 / Prefer the explicit field over pkg so overriding stays intuitive */
    let version = (_a = options.version) !== null && _a !== void 0 ? _a : options.pkg.version;
    let cwd = options.cwd || process.cwd();
    /**
     * 提前失敗：沒有版本號就無法產生標籤，
     * 讓 git 先失敗只會留下難懂的錯誤訊息
     *
     * Fail early: without a version no tag can be formed, and letting git fail
     * first would only produce a confusing message
     */
    if (!(version === null || version === void 0 ? void 0 : version.length)) {
        throw new Error(`tag version must be provided`);
    }
    let tag = version;
    /** 前綴預設空字串，使後續組串不需判斷 undefined / Default to empty string so later concatenation needs no undefined check */
    let tagPrefix = (_b = options.tagPrefix) !== null && _b !== void 0 ? _b : '';
    let name = (_c = options.name) !== null && _c !== void 0 ? _c : options.pkg.name;
    /**
     * excludeName 時允許沒有套件名稱：
     * 此時標籤只用版本，名稱非必要
     *
     * When excludeName is set a package name may be absent,
     * since the tag then consists of the version only
     */
    if (!options.excludeName && !(name === null || name === void 0 ? void 0 : name.length)) {
        throw new Error(`pkg name must be provided`);
    }
    return {
        ...options,
        cwd,
        name,
        version,
        tagPrefix,
    };
}
/**
 * 依選項組出標籤名稱（不執行 git）
 * Build the tag name from options (no git execution)
 *
 * 組裝順序刻意為「版本 → 前綴 → 名稱」，
 * 使 tagPrefix 作用在版本號之前（如 v1.0.0）再冠上 `<name>@`。
 *
 * Assembly order is deliberately version → prefix → name, so the prefix
 * applies before the name is added (e.g. `pkg@v1.0.0`).
 *
 * @param options - 原始輸入選項 / Raw input options
 * @returns 標籤名稱 / Tag name
 * @throws Error 當版本或（需要時）名稱缺失時 / When the version or, if required, the name is missing
 */
function formatPackageTag(options) {
    var _a, _b, _c;
    let tag = (_a = options.version) !== null && _a !== void 0 ? _a : options.pkg.version;
    /** 與 handleOptions 相同的前置檢查，確保純函式單獨呼叫也安全 / Same guard as handleOptions so the pure function is safe when called alone */
    if (!(tag === null || tag === void 0 ? void 0 : tag.length)) {
        throw new Error(`tag version must be provided`);
    }
    if (((_b = options.tagPrefix) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        tag = `${options.tagPrefix}${tag}`;
    }
    /** 預設標籤為 `<name>@<version>`，可用 excludeName 改為純版本 / Default tag is `<name>@<version>`; excludeName switches to version only */
    if (!options.excludeName) {
        let name = (_c = options.name) !== null && _c !== void 0 ? _c : options.pkg.name;
        if (!(name === null || name === void 0 ? void 0 : name.length)) {
            throw new Error(`pkg name must be provided`);
        }
        tag = `${name}@${tag}`;
    }
    return tag;
}
//# sourceMappingURL=core.js.map