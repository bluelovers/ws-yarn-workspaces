import { IParsePackageName, IResult } from './types';
import { ITSPartialPick } from 'ts-type/lib/type/record';
export declare function generatePackageArg(input: Pick<IParsePackageName, 'name'> & ITSPartialPick<IParsePackageName, 'semver' | 'type'>, includeVersion?: boolean): string;
export declare function _allowedResultType(type: IResult["type"]): boolean;
