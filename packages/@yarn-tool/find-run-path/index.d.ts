declare type ProcessEnvCore<P> = P & {
    Path: string;
};
export declare type ProcessEnv = ProcessEnvCore<typeof process.env>;
export interface IOptionsFindBinPath {
    cwd?: string;
    stopPath?: string | string[] | boolean;
}
export interface IOptionsGetRunPathCore<P = ProcessEnv> extends IOptionsFindBinPath {
    envPath?: string;
    execPath?: string;
    processEnv?: P | ProcessEnv;
}
export interface IOptionsGetRunPath<P = ProcessEnv> extends IOptionsGetRunPathCore<P> {
    prepend?: boolean;
    appendExecPath?: boolean;
    includeEnvPath?: boolean;
}
export declare function processRunPath<P = ProcessEnv>(options?: IOptionsGetRunPath<P>): {
    result: string;
    processEnv: P;
    pathKey: string;
    delimiter: ";" | ":";
};
export interface IOptionsGetRunPathEnv<P = ProcessEnv> extends IOptionsGetRunPath<P> {
    overwrite?: boolean;
}
export declare function processRunPathEnv<P = ProcessEnv>(options?: IOptionsGetRunPathEnv<P>): ProcessEnvCore<P>;
export default processRunPathEnv;
