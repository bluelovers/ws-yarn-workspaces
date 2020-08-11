import { SimpleSemVer } from './SimpleSemVer';
import { ISimpleSemVer } from './types';
export declare function parseSimpleSemVer<T extends ISimpleSemVer = ISimpleSemVer>(version: string): SimpleSemVer<ISimpleSemVer>;
export default parseSimpleSemVer;
