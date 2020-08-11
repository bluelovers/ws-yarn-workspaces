import { SimpleSemVer } from './SimpleSemVer';
import { ISimpleSemVer, IToSimpleSemVerObjectOrOperator } from './types';
export declare function parseSimpleSemVerRange(str: string): IToSimpleSemVerObjectOrOperator<SimpleSemVer<ISimpleSemVer>>[];
export default parseSimpleSemVerRange;
