import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function sortPackageJson<T extends Record<string, any> = IPackageJson>(pkg: T): T;
export default sortPackageJson;
