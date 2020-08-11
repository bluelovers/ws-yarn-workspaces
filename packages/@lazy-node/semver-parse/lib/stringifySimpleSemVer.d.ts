import { ISimpleSemVerObject } from './types';
import SimpleSemVer from './SimpleSemVer';
export declare function stringifySimpleSemVer(obj: ISimpleSemVerObject | SimpleSemVer): string;
export declare function stringifySemverFull(obj: ISimpleSemVerObject | SimpleSemVer): string;
export default stringifySimpleSemVer;
