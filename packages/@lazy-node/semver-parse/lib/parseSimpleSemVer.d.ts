import { SimpleSemVer } from './SimpleSemVer';
import { ISimpleSemVerObject, IToSimpleSemVerObject } from './types';
export declare function parseSimpleSemVer<T extends ISimpleSemVerObject = ISimpleSemVerObject>(version: string): IToSimpleSemVerObject<SimpleSemVer<IToSimpleSemVerObject<T>>>;
export default parseSimpleSemVer;
