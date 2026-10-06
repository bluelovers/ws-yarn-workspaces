"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWorkspacePrefixByName = searchWorkspacePrefixByName;
const tslib_1 = require("tslib");
const micromatch_1 = tslib_1.__importDefault(require("micromatch"));
/**
 * 依套件名稱搜尋所屬的 workspace prefix（工作區前綴 glob）。
 * Search for the workspace prefix that owns the given package name.
 *
 * @param options.inputName 要查核的套件名稱（如 `@scope/pkg`）。The package name to look up (e.g. `@scope/pkg`).
 * @param options.workspacesConfig 由 workspaces-config 解析出的 prefix/prefixSub 平行陣列。The parallel `prefix`/`prefixSub` arrays resolved by `workspaces-config`.
 * @param options 其餘欄位保留給呼叫端做介面相容，不參與本次運算。Remaining fields are kept for caller compatibility and take no part in this computation.
 * @returns 匹配到的 prefix；無明確匹配時回傳預設值。The matched prefix, falling back to a default when nothing matches explicitly.
 */
function searchWorkspacePrefixByName({ inputName, workspacesConfig, }) {
    let workspacePrefix;
    // 慣用的 packages/* 優先採用；多組 prefix 並存時它是最常見的預設值。
    // Prefer the conventional `packages/*`; with multiple prefixes it is the most common default.
    if (workspacesConfig.prefix.includes("packages/*")) {
        workspacePrefix = "packages/*";
    }
    else {
        // 否則退回第一組 prefix，確保即使後續無匹配也有可回傳的值。
        // Otherwise fall back to the first prefix so there is always a value even if nothing matches later.
        workspacePrefix = workspacesConfig.prefix[0];
    }
    // 只有存在多組 prefix 時才需要逐一比對，單組時預設值即答案。
    // Only compare entry by entry when several prefixes exist; with a single prefix the default is already the answer.
    if (workspacesConfig.prefix.length > 1) {
        for (let i = 0; i < workspacesConfig.prefixSub.length; i++) {
            const prefix = workspacesConfig.prefixSub[i];
            // 以 `子前綴/*` 對套件名稱做 glob 比對；命中的第一組即為所屬 workspace。
            // Glob-match `subPrefix/*` against the package name; the first hit is the owning workspace.
            if (prefix.length && micromatch_1.default.isMatch(inputName, prefix + '/*')) {
                workspacePrefix = workspacesConfig.prefix[i];
                break;
            }
            // 空字串代表根層（無子資料夾）的 prefix；不 break，讓更明確的後續匹配可覆蓋。
            // An empty string is the root-level (no subfolder) prefix; do not `break`, so a more specific later match may still override it.
            if (prefix === '') {
                workspacePrefix = workspacesConfig.prefix[i];
            }
        }
    }
    return workspacePrefix;
}
exports.default = searchWorkspacePrefixByName;
//# sourceMappingURL=index.js.map