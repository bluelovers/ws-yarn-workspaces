import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';
/**
 * 依套件名稱搜尋所屬的 workspace prefix（工作區前綴 glob）。
 * Search for the workspace prefix that owns the given package name.
 *
 * @param options.inputName 要查核的套件名稱（如 `@scope/pkg`）。The package name to look up (e.g. `@scope/pkg`).
 * @param options.workspacesConfig 由 workspaces-config 解析出的 prefix/prefixSub 平行陣列。The parallel `prefix`/`prefixSub` arrays resolved by `workspaces-config`.
 * @param options 其餘欄位保留給呼叫端做介面相容，不參與本次運算。Remaining fields are kept for caller compatibility and take no part in this computation.
 * @returns 匹配到的 prefix；無明確匹配時回傳預設值。The matched prefix, falling back to a default when nothing matches explicitly.
 */
export declare function searchWorkspacePrefixByName({ inputName, workspacesConfig, }: {
    inputName: string;
    cwd?: string;
    targetName?: string;
    hasWorkspace?: string;
    workspacePrefix?: string;
    workspacesConfig: IParseStaticPackagesPathsReturnType;
}): string;
export default searchWorkspacePrefixByName;
