import { IPackageJson } from '@ts-type/package-dts/package-json';
import { IFindRootReturnType } from '@yarn-tool/find-root';
export declare function fillPkgHostedInfo<P extends Partial<IPackageJson>>(pkg: P, options?: {
    targetDir?: string;
    rootData?: IFindRootReturnType;
    branch?: string;
}): P & {
    homepage: string;
    bugs: {
        url: string;
    };
    repository: {
        type: string | 'git';
        url: string;
    };
};
