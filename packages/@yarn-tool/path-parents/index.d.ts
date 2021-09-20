export interface IOptions {
    ignoreCurrentDirectory?: boolean;
}
export declare function pathUpToWorkspacesGenerator(cwd?: string, options?: IOptions): Generator<string, void, unknown>;
export declare function pathUpToWorkspaces(cwd?: string, options?: IOptions): string[];
export default pathUpToWorkspaces;
