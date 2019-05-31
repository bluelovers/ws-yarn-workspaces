export declare function findRoot(options: {
    cwd: string;
    skipCheckWorkspace?: boolean | string;
    throwError?: boolean;
}, _throwError?: boolean): {
    pkg: string;
    ws: string;
    hasWorkspace: boolean;
    isWorkspace: boolean;
    root: string;
};
export declare function pathNormalize(input: string): string;
export declare function pathEqual(a: string, b: string): boolean;
export declare function listMatchedPatternByPath(ws: string, pkg: string): any;
export default findRoot;
