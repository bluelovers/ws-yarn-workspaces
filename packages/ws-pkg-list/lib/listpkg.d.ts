/**
 * Created by user on 2020/6/5.
 */
/**
 * 列出目前 Yarn Workspaces（工作區）內所有套件的資料夾路徑。
 * List the folder paths of every package inside the current Yarn Workspace.
 *
 * @param cwd 起始目錄，用來尋找工作區根目錄；也可直接傳入布林值當作 absolute。Starting directory used to locate the workspace root; a boolean may also be passed as `absolute` for backward compatibility.
 * @param absolute 是否回傳絕對路徑，false 時回傳相對於 cwd 的路徑。Whether to return absolute paths; when false, paths are relative to `cwd`.
 */
export declare function workspacesPackagesList(absolute?: boolean): string[];
export declare function workspacesPackagesList(cwd?: string, absolute?: boolean): string[];
export default workspacesPackagesList;
