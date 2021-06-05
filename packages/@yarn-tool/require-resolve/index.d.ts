/// <reference types="node" />
export declare const SymbolCurrentDirectory: unique symbol;
export declare const SymbolGlobal: unique symbol;
export declare const SymbolGlobalNpm: unique symbol;
export declare const SymbolGlobalYarn: unique symbol;
export declare const SymbolModuleMain: unique symbol;
declare type IPathItem = typeof SymbolCurrentDirectory | typeof SymbolGlobal | typeof SymbolGlobalNpm | typeof SymbolGlobalYarn | typeof SymbolModuleMain;
export interface IOptionsCore {
    paths?: (string | IPathItem)[];
}
export interface IOptions extends IOptionsCore {
    map?: Record<string, string>;
    require?: NodeRequire;
    includeGlobal?: boolean | IPathItem[];
    includeCurrentDirectory?: boolean;
    cwd?: string;
}
export declare function requireResolveCore(name: string, options?: IOptions): string;
export declare type IErrorModuleNotFound<E> = E & {
    code: string | 'MODULE_NOT_FOUND';
    requireStack: string[];
};
export declare function handleOptionsPaths(paths: IOptionsCore["paths"], cwd?: string): string[];
export declare function isErrorModuleNotFound<T extends Error>(error: T): error is IErrorModuleNotFound<T>;
export declare function requireExtra<T extends any>(name: string, options?: IOptions): T;
export declare function importExtra<T extends any>(name: string, options?: IOptions): Promise<T>;
export declare function requireResolveExtra(name: string, options?: IOptions): {
    result: string;
    error: IErrorModuleNotFound<Error>;
};
export declare function _unshiftArray<T extends any>(array: T[], item: T): T[];
export default requireResolveExtra;
