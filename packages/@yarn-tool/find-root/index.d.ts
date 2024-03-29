import { normalize as pathNormalize } from 'upath2';
import { pathIsSame as pathEqual } from 'path-is-same';
import { ITSPickExtra } from 'ts-type/lib/type/record';
export interface IFindRootReturnType {
    cwd: string;
    pkg: string;
    ws: string;
    hasWorkspace: boolean;
    isWorkspace: boolean;
    root: string;
    isRoot: boolean;
}
export interface IFindRootOptions {
    cwd: string;
    skipCheckWorkspace?: boolean | string;
    throwError?: boolean;
    shouldHasWorkspaces?: boolean;
    shouldNotWorkspacesRoot?: boolean;
}
export declare function findRootLazy(options?: Partial<IFindRootOptions>, _throwError?: boolean): IFindRootReturnType;
export declare function findRoot(options: IFindRootOptions, _throwError?: boolean): IFindRootReturnType;
export declare function newFakeRootData(rootData: IFindRootReturnType, input: ITSPickExtra<IFindRootReturnType, 'pkg'>): IFindRootReturnType;
export declare function assertHasWorkspaces<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    hasWorkspace: true;
};
export declare function assertNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    isWorkspace: false;
};
export declare function assertHasAndNotWorkspacesRoot<T extends IFindRootReturnType>(rootData: T): asserts rootData is T & {
    hasWorkspace: true;
    isWorkspace: false;
};
export { pathNormalize, pathEqual };
export declare function listMatchedPatternByPath(ws: string, pkg: string): any;
export default findRoot;
