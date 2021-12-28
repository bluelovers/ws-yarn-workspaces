import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
import { INpmHostedGitInfo } from '@yarn-tool/pkg-git-info';
import { ITSPickExtra } from 'ts-type/lib/type/record';
export interface IFillPkgHostedInfoOptions {
    targetDir?: string;
    rootData?: IFindRootReturnType;
    branch?: string;
    hostedGitInfo?: INpmHostedGitInfo;
}
export declare type IFillPkgHostedInfoFields = {
    homepage: string;
    bugs: {
        url: string;
    };
    repository: {
        type: string | 'git';
        url: string;
    };
};
export declare function _hostedGitInfoToFields<P extends Partial<IPackageJson>>(pkg: P, options: ITSPickExtra<IFillPkgHostedInfoOptions, 'hostedGitInfo' | 'rootData' | 'targetDir'>): P & IFillPkgHostedInfoFields;
export declare function fillPkgHostedInfo<P extends IPackageJson>(pkg: P, options?: IFillPkgHostedInfoOptions): P & IFillPkgHostedInfoFields;
export default fillPkgHostedInfo;
