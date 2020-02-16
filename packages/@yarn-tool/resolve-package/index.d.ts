import type { IPackageJson } from '@ts-type/package-dts';
export declare function resolvePackage(name: string): {
    name: string;
    pkgRoot: string;
    pkg: IPackageJson<any>;
};
export default resolvePackage;
