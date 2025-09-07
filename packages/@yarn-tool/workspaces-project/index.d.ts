import { Project as LernaProject } from '@lerna/project';
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
    get releaseConfig(): import("ts-type").ITSOverwrite<import("ts-type").ITSPickBothDiff<{
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    }> & Pick<{
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    } | {
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, import("ts-type").ITSKeyofBothSame<{
        [k: string]: unknown;
        allowBranch?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        conventionalCommits?: boolean;
        changelogPreset?: string | "@bluelovers/conventional-changelog-bluelovers";
        exact?: boolean;
        createRelease?: "gitlab" | "github";
        noPrivate?: boolean;
    }>> & import("ts-type").ITSPickBothDiff<{
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@yarn-tool/ncu").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    }> & Pick<{
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@yarn-tool/ncu").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    } | {
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, import("ts-type").ITSKeyofBothSame<{
        [k: string]: unknown;
        ignoreChanges?: string | string[];
        message?: string;
    }, {
        concurrency?: number;
        bump?: IReleaseType;
        conventionalCommits?: boolean;
        conventionalGraduate?: boolean;
        distTag?: import("@yarn-tool/ncu").IPackageJsonTag;
        npmClient?: import("@ts-type/package-dts/lerna-json").INpmClient;
        allowBranch?: import("@ts-type/package-dts/lib/types").IBranch[];
        noPrivate?: boolean;
    }>>, {
        changelogPreset: import("@ts-type/package-dts/lerna-json").ILernaJsonCommand["version"]["changelogPreset"];
        conventionalGraduate: import("@ts-type/package-dts/lerna-json").ILernaJsonCommand["publish"]["conventionalGraduate"];
        bump: IReleaseType;
    }>;
    existsLernaConfigFile(): boolean;
}
export default WorkspacesProject;
