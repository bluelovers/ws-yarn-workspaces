export declare const enum EnumCheckPaths {
    root = 1,
    rootPath = 0,
    failed = -1
}
export declare function checkPaths(input: {
    root: any;
    rootPath: any;
}, options?: {
    skipStrictCheck?: boolean;
}): EnumCheckPaths;
