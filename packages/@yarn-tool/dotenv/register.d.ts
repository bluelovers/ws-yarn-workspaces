declare const _default: {
    path: string;
    cwd: string;
    current: string;
    fileExists: boolean;
    error?: Error & {
        code: "MISSING_DATA" | "INVALID_DOTENV_KEY" | "NOT_FOUND_DOTENV_ENVIRONMENT" | "DECRYPTION_FAILED" | "OBJECT_REQUIRED";
    } & {
        code?: string;
    };
    parsed?: import("dotenv").DotenvParseOutput & NodeJS.ProcessEnv;
};
export default _default;
