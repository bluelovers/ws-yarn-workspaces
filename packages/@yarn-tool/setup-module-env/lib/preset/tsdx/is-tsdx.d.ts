import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
export declare function isTsdxPackage<P extends IPackageJson>(pkg: P, config?: ISetupTsdxOptions<P>): boolean;
