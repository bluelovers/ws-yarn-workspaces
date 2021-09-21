/// <reference types="node" />
import { IRecordLike } from 'value-from-record';
export declare type IPathDelimiter = ':' | ';';
declare const delimiter: IPathDelimiter;
export { delimiter };
export declare function processEnv(ignoreErrors?: boolean): NodeJS.ProcessEnv;
export declare function envPathKey(env?: IRecordLike<string, any>): string;
export declare function getEnvPathValue(env?: IRecordLike<string, any>, key?: string): string;
export declare function setEnvPathValue(value: string | string[], env?: IRecordLike<string, string>, key?: string, delim?: IPathDelimiter): IRecordLike<string, string>;
export declare function envPathObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): {
    get: {
        factory: () => import("path-env").PathFactory;
        string: () => string;
        array: () => import("path-env").PathArray;
        delim: () => import("path-env").PathDelimiter;
        name: () => string;
    };
    set: {
        factory: (x: import("path-env").PathFactory) => import("path-env").EnvFactory;
        string: (x: string) => import("path-env").EnvFactory;
        array: (x: import("path-env").PathArray) => import("path-env").EnvFactory;
        delim: (x: import("path-env").PathDelimiter) => import("path-env").EnvFactory;
        name: (x: string) => import("path-env").EnvFactory;
    };
    append: (addend: import("path-env").PathArray) => import("path-env").EnvFactory;
    prepend: (addend: import("path-env").PathArray) => import("path-env").EnvFactory;
    surround: (addend: import("path-env").PathArray) => import("path-env").EnvFactory;
    deduplicate: () => import("path-env").EnvFactory;
};
export declare function envObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): import("path-env").EnvFactory;
export default envPathObject;
