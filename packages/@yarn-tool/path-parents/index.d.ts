export declare function pathUpToWorkspacesGenerator(cwd?: string, options?: {
    ignoreCurrentDirectory?: boolean;
}): Generator<string, void, unknown>;
export declare function pathUpToWorkspaces(cwd?: string): string[];
export default pathUpToWorkspaces;
