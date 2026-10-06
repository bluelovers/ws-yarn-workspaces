import { IAddedList, IOptionsInstallDepsFromWorkspaces } from './types';
/**
 * 安裝工作區內的本地套件 (Install workspace-local packages)
 *
 * Install local packages that exist inside the workspace.
 *
 * @param packageNames 要安裝的套件名稱或查詢字串 (Names or specifiers to install)
 * @param options 安裝選項，可指定 `cwd`、`pkg` 等 (Install options such as `cwd` / `pkg`)
 *
 * @returns 回傳 `added`、`exists`、`others`、`updated` 與被修改的 `pkg`；
 * 嚴格模式下若根目錄不是 workspace，會直接拋出例外。
 *
 * Returns `added`, `exists`, `others`, `updated` and the mutated `pkg`;
 * throws when the root is not a valid workspace, because this function is
 * only meaningful in that context.
 */
export declare function installDepsFromWorkspaces(packageNames: string[], options?: IOptionsInstallDepsFromWorkspaces): {
    cwd: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType & {
        hasWorkspace: true;
        isWorkspace: false;
    };
    added: IAddedList;
    exists: string[];
    others: string[];
    pkg: import("@ts-type/package-dts").IPackageJson<unknown>;
    updated: boolean;
};
