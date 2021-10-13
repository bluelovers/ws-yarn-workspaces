export declare function listChangelog(cwd: string): string[];
export declare function _findWorkspacesRootPath(cwd?: string): string;
export declare function getWorkspacesRootChangelogPath(cwd?: string, filename?: string): string;
export declare function outputWorkspacesRootChangelog(cwd?: string, filename?: string): {
    file: string;
    md: string;
};
export declare function outputWorkspacesRootChangelogAsync(cwd?: string, filename?: string): Promise<{
    file: string;
    md: string;
}>;
export declare function createWorkspacesRootChangelog(cwd?: string): string;
export default createWorkspacesRootChangelog;
