/**
 * Created by user on 2018/5/14/014.
 */
declare function findWorkspacePackageJson(cwd?: string): string;
declare namespace findWorkspacePackageJson {
    var findPkg: typeof findWorkspacePackageJson;
    var default: typeof findWorkspacePackageJson;
}
export = findWorkspacePackageJson;
