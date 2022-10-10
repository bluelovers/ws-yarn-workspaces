import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { PackageJsonLoader } from 'npm-package-json-loader';
export declare function _fixRoot(options: Required<IFillPkgHostedInfoOptions>): {
    root_file_package_json: string;
    root_pkg_json: PackageJsonLoader<import("@ts-type/package-dts").IPackageJson<unknown>>;
    targetDir: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    hostedGitInfo: import("@yarn-tool/pkg-git-info").INpmHostedGitInfo;
    branch: string;
    overwriteHostedGitInfo: boolean;
};
export declare function _fixWsRoot(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'overwriteHostedGitInfo' | 'branch'>): {
    root_file_package_json: string;
    root_pkg_json: PackageJsonLoader<import("@ts-type/package-dts").IPackageJson<unknown>>;
    targetDir: string;
    rootData: import("@yarn-tool/find-root").IFindRootReturnType;
    hostedGitInfo: import("@yarn-tool/pkg-git-info").INpmHostedGitInfo;
    branch: string;
    overwriteHostedGitInfo: boolean;
};
