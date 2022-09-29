import { IOptionsPkgListable } from 'ws-pkg-list';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import Bluebird from 'bluebird';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { INpmAutoFixAll } from '../../index';
export declare function _handler(cwd: string, ...argv: Parameters<IOptionsPkgListable["handler"]>): {
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
    prefix: string;
};
export type IEntry = ReturnType<typeof _handler>;
export interface IOptionsRunEachPackages extends ITSRequiredPick<IFillPkgHostedInfoOptions & INpmAutoFixAll, 'overwriteHostedGitInfo' | 'branch' | 'rootData' | 'hostedGitInfo' | 'resetStaticFiles'> {
}
export declare function _runEachPackagesAsync(list: IEntry[], options: IOptionsRunEachPackages): Bluebird<void[]>;
export declare function _initPkgListableByRootData(rootData: Pick<IFindRootReturnType, 'root' | 'hasWorkspace'>): {
    pkg: import("@ts-type/package-dts").IPackageJson<any>;
    manifestLocation: string;
    name: string;
    version: string;
    private: boolean;
    location: string;
    prefix: string;
}[];
