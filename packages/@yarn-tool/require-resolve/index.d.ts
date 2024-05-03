import { IPathItem, SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain } from '@yarn-tool/get-paths-by-type';
export { IPathItem, SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, };
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
export type IErrorModuleNotFound<E> = E & {
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
