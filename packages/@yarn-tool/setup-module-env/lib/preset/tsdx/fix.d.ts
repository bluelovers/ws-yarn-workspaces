import { IPackageJson } from '@ts-type/package-dts/package-json';
import { ISetupTsdxOptions } from './index';
import { ITSPickExtra } from 'ts-type/lib/type/record';
export declare function fixTsdxPackage<P extends IPackageJson>(pkg: P, config: ITSPickExtra<ISetupTsdxOptions<P>, 'rootData'>): P;
