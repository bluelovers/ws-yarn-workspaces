import { normalize as pathNormalize } from 'upath2';
export interface IFindRootReturnType {
    pkg: string;
    ws: string;
    hasWorkspace: boolean;
    isWorkspace: boolean;
    root: string;
}
export interface IFindRootOptions {
    cwd: string;
    skipCheckWorkspace?: boolean | string;
    throwError?: boolean;
}
export declare function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType;
export { pathNormalize };
export declare function pathEqual(a: string, b: string): boolean;
export declare function listMatchedPatternByPath(ws: string, pkg: string): any;
export default findRoot;
