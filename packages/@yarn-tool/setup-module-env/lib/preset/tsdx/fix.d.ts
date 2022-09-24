import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
export declare function fixTsdxPackage<P extends IPackageJson>(pkg: P, config?: Partial<ISetupTsdxOptions<P>>): P;
