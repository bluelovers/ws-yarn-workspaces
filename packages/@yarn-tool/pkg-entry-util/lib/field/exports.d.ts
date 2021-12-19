import { IPackageJson } from '@ts-type/package-dts/package-json';
import { PackageExportsEntry, PackageExportsFallback } from '@ts-type/package-dts/types/package.json';
export declare function _pkgExportsAddPJsonEntryCore<T extends IPackageJson["exports"]>(pkgExports: T): T;
export declare function pkgExportsAddPJsonEntry<T extends IPackageJson>(pkg: T): T;
export declare function _isPackageExportsEntry(entry: string | keyof keyof IPackageJson["exports"], value: PackageExportsEntry | PackageExportsFallback): value is PackageExportsEntry;
export declare function pkgExportsVerify<T extends IPackageJson>(pkg: T, options?: {
    cwd?: string;
}): null;
