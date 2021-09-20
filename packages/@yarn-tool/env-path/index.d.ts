/// <reference types="node" />
import { IRecordLike } from 'value-from-record';
export declare type IPathDelimiter = ':' | ';';
declare const delimiter: IPathDelimiter;
export { delimiter };
export declare function processEnv(ignoreErrors?: boolean): NodeJS.ProcessEnv;
export declare function envPathKey(env?: IRecordLike<string, any>): string;
export declare function envPathObject(env?: IRecordLike<string, any>, key?: string, delim?: IPathDelimiter): import("path-env").PathFactory;
export default envPathObject;
