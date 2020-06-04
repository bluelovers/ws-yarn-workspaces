/**
 * Created by user on 2020/6/5.
 */
import IPackageJson from '@ts-type/package-dts';
import { IReadedPackages } from './types';
export declare function readPackages<T = IPackageJson>(ls: string[], cwd?: string): IReadedPackages<T>;
export default readPackages;
