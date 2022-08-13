import type { IPackageJson } from '@ts-type/package-dts';
import type { ILernaJsonCommand } from '@ts-type/package-dts/lerna-json';
import type { IPackageJsonDependenciesField, IDependency } from '@ts-type/package-dts/lib/package-json/types';
import type { FileResult, HostedGitResult, URLResult, AliasResult, RegistryResult } from 'npm-package-arg';
import type { ITSOverwrite } from 'ts-type';
import { IReleaseType } from '@ts-type/package-dts/lerna-json';
export declare const enum EnumWorkspacesProject {
    workspace = "packages/*",
    independent = "independent"
}
export interface IWorkspacesProjectInternal {
    defaultWorkspace: string;
    workspaces: string[];
    releaseConfig: ITSOverwrite<ILernaJsonCommand["version"] & ILernaJsonCommand["publish"], {
        changelogPreset: ILernaJsonCommand["version"]['changelogPreset'];
        conventionalGraduate: ILernaJsonCommand["publish"]['conventionalGraduate'];
        bump: IReleaseType;
    }>;
}
export type IResolvedResult = FileResult | HostedGitResult | URLResult | AliasResult | RegistryResult;
export interface IPackedManifestCore extends Record<IPackageJsonDependenciesField, IDependency> {
    name: string;
    location: string;
    private: boolean;
    resolved: IResolvedResult;
    rootPath: string;
    __isLernaPackage: boolean;
    bin: Record<string, string>;
    scripts: IPackageJson["scripts"];
    /**
     * package.json
     */
    manifestLocation: string;
    /**
     * node_modules
     */
    nodeModulesLocation: string;
    /**
     * node_modules/.bin
     */
    binLocation: string;
    version: string;
    contents: string;
    toJSON(): IPackageJson;
    refresh(): Promise<IPackedManifest>;
    serialize(): Promise<IPackedManifest>;
    updateLocalDependency(resolved: IResolvedResult, depVersion: string, savePrefix: string): any;
}
export interface IPackedManifest extends IPackedManifestCore, Omit<IPackageJson, keyof IPackedManifestCore> {
}
