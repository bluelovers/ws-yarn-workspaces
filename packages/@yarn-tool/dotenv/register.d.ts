/**
 * 副作用入口：載入本模組即執行一次 wsEnvConfig()，
 * 供 `node -r @yarn-tool/dotenv/register` 或測試設定中直接註冊環境變數。
 *
 * Side-effect entry: importing this module runs wsEnvConfig() once,
 * for registering env vars via `node -r @yarn-tool/dotenv/register` or in test setup.
 */
declare const _default: {
    path: string;
    cwd: string;
    current: string;
    fileExists: boolean;
    error?: Error & {
        code: "OBJECT_REQUIRED" | (string & {});
    } & {
        code?: string;
    };
    parsed?: import("dotenv").DotenvParseOutput & NodeJS.ProcessEnv;
};
export default _default;
