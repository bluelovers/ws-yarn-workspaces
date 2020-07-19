/**
 * Created by user on 2018/11/28/028.
 */
import { defaultCopyStaticFiles } from '@yarn-tool/static-file';
import { parseStaticPackagesPaths } from 'workspaces-config';
export declare function npmVersion(npmClient?: string, cwd?: string): any;
export declare function getTargetDir(options: {
    inputName: string;
    cwd: string;
    targetName?: string;
    hasWorkspace?: string;
    workspacePrefix?: string;
    workspacesConfig?: ReturnType<typeof parseStaticPackagesPaths>;
}): {
    targetDir: string;
    targetName: string;
    cwd: string;
};
export { defaultCopyStaticFiles };
export declare function copyStaticFiles(file_map: Record<string, string> | [string, string, string?][], options: {
    cwd: string;
    staticRoot?: string;
    overwrite?: boolean;
}): [string, string, string?][];
