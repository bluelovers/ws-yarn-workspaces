/**
 * 依 workspace 結構過濾要安裝的套件 (Filter install targets by workspace layout)
 *
 * 當使用者在 workspace 根目錄執行指令時，安裝應改由工作區內的本地套件承接，
 * 因此這裡先辨識根目錄角色，再決定是否委派給 `installDepsFromWorkspaces`。
 *
 * When a command runs at the workspace root, installs must be handled by the
 * local workspace packages instead, so the root role is detected first and the
 * work is delegated to `installDepsFromWorkspaces` when appropriate.
 */
import { IOptionsInstallDepsFromWorkspaces } from './types';
import { IPackageJson } from '@ts-type/package-dts';
/**
 * `filterInstallDeps` 的選項 (Options for `filterInstallDeps`)
 *
 * 目前與 workspace 安裝選項相同，保留別名是為了日後可單獨擴充。
 * Alias of the workspace install options, kept so it can diverge later.
 */
export interface IOptionsInstallDeps extends IOptionsInstallDepsFromWorkspaces {
}
/**
 * 過濾出不屬於工作區本地套件的套件名稱
 *
 * Filter out package names that are not local workspace packages.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，預設使用 `process.cwd()` (Install options, defaults to `process.cwd()`)
 *
 * @returns 若目前位於 workspace 根目錄，回傳由本地套件處理後的結果；
 * 否則只回傳 `cwd` 與原封不動的 `packageNames`，表示沒有任何項目被處理。
 *
 * Returns the outcome produced by local packages when running at a workspace
 * root; otherwise only `cwd` and the untouched `packageNames`, meaning nothing
 * was handled.
 */
export declare function filterInstallDeps(packageNames: string[], options?: IOptionsInstallDeps): {
    cwd: string;
    packageNames: string[];
    pkg: IPackageJson;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    added: import("./types").IAddedList;
    exists: string[];
    updated: boolean;
} | {
    cwd: string;
    packageNames: string[];
    pkg?: undefined;
    rootData?: undefined;
    added?: undefined;
    exists?: undefined;
    updated?: undefined;
};
