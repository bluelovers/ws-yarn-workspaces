import { IParsePackageName, IResult } from './types';
/**
 * @deprecated
 */
export declare function parseArgvPkgName(input: string): {
    input: string;
    namespace: string;
    name: string;
    version: string;
    result: IResult;
};
export declare function parsePackageName(packageName: string): IParsePackageName;
