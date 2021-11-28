import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function updatePackageJson<P extends IPackageJson>(pkg: P): P;
export declare function setup<P extends IPackageJson>(config: {
    pkg: P;
}): {
    pkg: P;
};
