import { IPackageJsonLike } from './util';
export declare type IOptions = {
    pkgRoot?: string;
    usePathResolve?: boolean;
} & ({
    name?: string;
    pkg: IPackageJsonLike;
} | {
    name: string;
    pkg?: IPackageJsonLike;
});
export declare function normalizePackageBins(options: IOptions): Record<string, string>;
export declare function defaultPackageBin(options: IOptions, defaultKey?: string): string;
export default normalizePackageBins;
