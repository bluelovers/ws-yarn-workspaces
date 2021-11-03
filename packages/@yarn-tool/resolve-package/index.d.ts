import type { IPackageJson } from '@ts-type/package-dts';
export declare function resolvePackage(name: string, options?: {
    /**
     * @see RequireResolve
     */
    paths?: string[];
}): {
    name: string;
    pkgRoot: string;
    pkg: IPackageJson<any>;
    pkgConfigLocation: string;
    entryPointLocation: string;
    resolveLocation(path: string, ...paths: string[]): string;
};
export default resolvePackage;
