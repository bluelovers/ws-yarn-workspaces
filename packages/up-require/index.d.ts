/// <reference types="node" />
declare const MODULE_NOT_FOUND: "MODULE_NOT_FOUND";
export { MODULE_NOT_FOUND };
export interface IErrnoException extends NodeJS.ErrnoException, Error {
    code?: string | typeof MODULE_NOT_FOUND;
    module?: NodeModule;
    startModule?: NodeModule;
    /**
     * all module list for search
     */
    list?: NodeModule[];
}
/**
 * Require package module from highest module.
 */
export declare function requireFromTopParent<T = any>(id: string, startModule?: NodeModule): T;
/**
 * get all module and parents by start module
 */
export declare function getAllModule(startModule?: NodeModule): NodeModule[];
/**
 * Require module from module list
 * (order is desc, from last one to first one)
 */
export declare function requireFromModuleList<T = any>(id: string, ls: NodeModule[], startModule: NodeModule): T;
/**
 * @alias requireFromTopParent
 */
export declare function upRequire<T = any>(id: string, startModule?: NodeModule): T;
/**
 * @alias requireFromTopParent
 */
export declare function requireUp<T = any>(id: string, startModule?: NodeModule): T;
/**
 * Require package module by parent module require.
 */
export declare function requireParent<T = any>(id: string, startModule: NodeModule): T;
/**
 * Require package module start from parent module.
 */
export declare function requireFromParentUp<T = any>(id: string, startModule?: NodeModule): T;
/**
 * normalize Error data for debug
 */
export declare function _createError(err: IErrnoException, data: {
    id?: string;
    code?: string | typeof MODULE_NOT_FOUND;
    module?: NodeModule;
    startModule?: NodeModule;
    list?: NodeModule[];
}): IErrnoException;
/**
 * find module by exports
 */
export declare function getModuleByExports<T = any>(exportModule: T, req?: NodeRequire): INodeModule<T>;
/**
 * find module by full file path
 */
export declare function getModuleByFile<T = any>(file: string, requireIfNotExists?: boolean, req?: NodeRequire): INodeModule<T>;
export interface INodeRequireCache {
    [k: string]: NodeModule;
}
/**
 * return require.cache for typescript
 */
export declare function getRequireCache(req?: NodeRequire): INodeRequireCache;
export interface INodeModule<T = any> extends NodeModule {
    exports: T;
    require: NodeRequire;
    id: string;
    filename: string;
    loaded: boolean;
    parent: NodeModule | null;
    children: NodeModule[];
    paths: string[];
}
/**
 * get main module
 */
export declare function getMainModule<T = any>(id?: string): INodeModule<T>;
/**
 * get module by package id like require(id)
 */
export declare function getModuleByID<T = any>(id: string, requireIfNotExists?: boolean, req?: NodeRequire): INodeModule<T>;
export default requireFromTopParent;
