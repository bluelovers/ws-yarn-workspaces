import { IFindRootReturnType } from '@yarn-tool/find-root';
import { ScopeJson } from './format/json';
export declare class WorkspacesScope {
    rootData: IFindRootReturnType;
    _root_package_json: ScopeJson<'workspaces'>;
    _root_lerna_json: ScopeJson<'packages'>;
    _root_pnpm_workspace_yaml: ScopeJson<'packages'>;
    constructor(cwd?: string);
    get changed(): boolean;
    resolvePath(...paths: [string, ...string[]]): string;
    add(scope: string): string;
    remove(scope: string): string;
    /**
     * @deprecated
     * @alias syncValue
     */
    sync(): string[];
    save(): void;
    get value(): string[];
    syncValue(): string[];
}
export default WorkspacesScope;
