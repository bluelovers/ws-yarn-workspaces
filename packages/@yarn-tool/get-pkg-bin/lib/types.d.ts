/**
 * Created by user on 2020/6/13.
 */
import { IPackageJson } from '@ts-type/package-dts';
export declare type IPackageJsonLike = IPackageJson | Record<string, any>;
export declare type IOptions = {
    pkgRoot?: string;
    usePathResolve?: boolean;
    paths?: string[];
} & ({
    name?: string;
    pkg: IPackageJsonLike;
} | {
    name: string;
    pkg?: IPackageJsonLike;
});
