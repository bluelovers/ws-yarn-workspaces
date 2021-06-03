export interface IDotenvFilesParams {
    isTest?: boolean;
    dev?: boolean;
}
export declare function dotEnvFiles(options?: IDotenvFilesParams): {
    isTest: boolean;
    dev: boolean;
    mode: string;
    dotenvFiles: string[];
};
export declare function wsEnvConfig<E = typeof process.env>(cwd?: string, options?: IDotenvFilesParams): {
    path: string;
    cwd: string;
    current: string;
    error?: Error;
    parsed?: import("dotenv").DotenvParseOutput;
};
export default wsEnvConfig;
