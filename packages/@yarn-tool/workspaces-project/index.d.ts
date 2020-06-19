import LernaProject from '@lerna/project';
import { IWorkspacesProjectInternal, EnumWorkspacesProject, IPackedManifest } from './lib/types';
import type { ILernaJson, IReleaseType } from '@ts-type/package-dts/lerna-json';
import type { IChangelogPreset } from '@yarn-tool/changelog';
export declare class WorkspacesProject {
    #private;
    /**
     * @see https://github.com/lerna/lerna/tree/master/core/project
     */
    protected _project: LernaProject & {
        config: ILernaJson;
    };
    constructor(cwd?: string, options?: {
        skipStrictCheck?: boolean;
    });
    protected _hasInternal<K extends keyof IWorkspacesProjectInternal>(field: K): boolean;
    protected _getInternal<K extends keyof IWorkspacesProjectInternal>(field: K): IWorkspacesProjectInternal[K];
    protected _setInternal<K extends keyof IWorkspacesProjectInternal>(field: K, value: IWorkspacesProjectInternal[K]): IWorkspacesProjectInternal[K];
    get rootPath(): string;
    get lernaConfigLocation(): string;
    get npmClient(): string;
    set npmClient(value: string);
    get workspaces(): string[];
    get defaultWorkspace(): string;
    set defaultWorkspace(value: string);
    isIndependent(): boolean;
    get version(): string | EnumWorkspacesProject.independent;
    set version(val: string | EnumWorkspacesProject.independent);
    /**
     * @see https://github.com/lerna/lerna/tree/master/core/package
     */
    get manifest(): IPackedManifest;
    get config(): ILernaJson;
    get bump(): IReleaseType;
    get changelogPreset(): IChangelogPreset;
    get releaseConfig(): import("ts-type").ITSOverwrite<{
        [k: string]: unknown;
        allowBranch?: string[];
        message?: string;
    } & {
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        changelogPreset?: string;
    } & {
        [k: string]: unknown;
        ignoreChanges?: string[];
        message?: string;
    } & {
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: string;
    }, {
        changelogPreset: string;
        conventionalGraduate: boolean;
        bump: IReleaseType;
    }>;
    existsLernaConfigFile(): boolean;
}
export default WorkspacesProject;
