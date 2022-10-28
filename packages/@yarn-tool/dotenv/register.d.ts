declare const _default: {
    path: string;
    cwd: string;
    current: string;
    fileExists: boolean;
    error?: Error & {
        code?: string;
    };
    parsed?: import("dotenv").DotenvParseOutput & NodeJS.ProcessEnv;
};
export default _default;
