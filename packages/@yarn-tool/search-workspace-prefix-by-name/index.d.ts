import { IParseStaticPackagesPathsReturnType } from 'workspaces-config';
export declare function searchWorkspacePrefixByName({ inputName, workspacesConfig, }: {
    inputName: string;
    cwd?: string;
    targetName?: string;
    hasWorkspace?: string;
    workspacePrefix?: string;
    workspacesConfig: IParseStaticPackagesPathsReturnType;
}): string;
export default searchWorkspacePrefixByName;
