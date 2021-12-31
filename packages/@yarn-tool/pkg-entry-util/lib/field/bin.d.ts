import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function fixBinPath(bin: string, root: string): string;
export declare function fixPkgBinField<T extends IPackageJson>(pkg: T, root: string): T;
