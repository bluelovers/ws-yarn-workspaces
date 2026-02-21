import { DotenvParseOutput } from 'dotenv';
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
export declare function wsEnvConfig<E extends {
    [key: string]: any;
} = typeof process.env>(cwd?: string, options?: IDotenvFilesParams): {
    path: string;
    cwd: string;
    current: string;
    fileExists: boolean;
    error?: Error & {
        code: "MISSING_DATA" | "INVALID_DOTENV_KEY" | "NOT_FOUND_DOTENV_ENVIRONMENT" | "DECRYPTION_FAILED" | "OBJECT_REQUIRED";
    } & {
        code?: string;
    };
    parsed?: DotenvParseOutput & E;
};
export default wsEnvConfig;
