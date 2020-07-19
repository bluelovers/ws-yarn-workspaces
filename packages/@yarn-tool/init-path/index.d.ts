import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';
export declare function getTargetDir(options: {
    inputName: string;
    cwd: string;
    targetName?: string;
    hasWorkspace?: string;
    workspacePrefix?: string;
    workspacesConfig?: IParseStaticPackagesPathsReturnType;
}): {
    targetDir: string;
    targetName: string;
    cwd: string;
};
export default getTargetDir;
