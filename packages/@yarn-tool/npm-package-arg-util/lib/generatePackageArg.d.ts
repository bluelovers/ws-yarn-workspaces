import { IParsePackageName, IResult } from './types';
export declare function generatePackageArg(input: Pick<IParsePackageName, 'name' | 'semver' | 'type'>, includeVersion?: boolean): string;
export declare function _allowedResultType(type: IResult["type"]): boolean;
