/// <reference types="node" />
import { IRecordLike } from 'value-from-record';
import { IPathDelimiter } from 'path-env2';
export type { IPathDelimiter };
declare const delimiter: IPathDelimiter;
export { delimiter };
export declare function processEnv(ignoreErrors?: boolean): NodeJS.ProcessEnv;
export declare function envPathKey(env?: IRecordLike<string, any>): string;
export declare function getEnvPathValue(env?: IRecordLike<string, any>, key?: string): string;
export declare function setEnvPathValue(value: string | string[], env?: IRecordLike<string, string>, key?: string, delim?: IPathDelimiter): IRecordLike<string, string>;
export declare function envPathObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): {
    get: {
        factory(): import("path-env2").IPathFactory;
        string(): string;
        array(): import("path-env2").IPathArray;
        delim(): IPathDelimiter;
        name(): string;
    };
    set: {
        factory(x: import("path-env2").IPathFactory): import("path-env2").IEnvFactory;
        string(x: string): import("path-env2").IEnvFactory;
        array(x: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
        delim(x: IPathDelimiter): import("path-env2").IEnvFactory;
        name(x: string): import("path-env2").IEnvFactory;
    };
    append(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    prepend(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    surround(addend: import("path-env2").IPathArray): import("path-env2").IEnvFactory;
    deduplicate(): import("path-env2").IEnvFactory;
};
export declare function envObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): import("path-env2").IEnvFactory;
export default envPathObject;
