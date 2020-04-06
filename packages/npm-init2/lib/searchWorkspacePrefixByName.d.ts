import { parseStaticPackagesPaths } from 'workspaces-config';
export declare function searchWorkspacePrefixByName({ inputName, workspacesConfig, }: {
    inputName: string;
    cwd?: string;
    targetName?: string;
    hasWorkspace?: string;
    workspacePrefix?: string;
    workspacesConfig: ReturnType<typeof parseStaticPackagesPaths>;
}): string;
export default searchWorkspacePrefixByName;
