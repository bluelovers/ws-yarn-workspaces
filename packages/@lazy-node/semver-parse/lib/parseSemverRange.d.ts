import { SimpleSemVer } from './SimpleSemVer';
import { ISimpleSemVer } from './types';
export declare function parseSemverRange(str: string): SimpleSemVer<ISimpleSemVer>[];
export default parseSemverRange;
