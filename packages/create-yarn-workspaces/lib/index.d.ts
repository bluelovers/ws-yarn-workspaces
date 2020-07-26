import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function getDefaultPackageJson(name?: string): IPackageJson;
export declare function getDefaultTsconfig(): {
    extends: string;
};
