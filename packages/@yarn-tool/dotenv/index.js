"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsEnvConfig = exports.dotEnvFiles = void 0;
const dotenv_1 = require("dotenv");
const path_parents_1 = require("@yarn-tool/path-parents");
const upath2_1 = require("upath2");
const fs_extra_1 = require("fs-extra");
function dotEnvFiles(options) {
    let { isTest, dev, } = options !== null && options !== void 0 ? options : {};
    isTest = isTest !== null && isTest !== void 0 ? isTest : process.env.NODE_ENV === 'test';
    const mode = isTest ? 'test' : dev ? 'development' : 'production';
    const dotenvFiles = [
        `.env.${mode}.local`,
        // Don't include `.env.local` for `test` environment
        // since normally you expect tests to produce the same
        // results for everyone
        mode !== 'test' && `.env.local`,
        `.env.${mode}`,
        '.env',
    ].filter(Boolean);
    return {
        isTest,
        dev,
        mode,
        dotenvFiles,
    };
}
exports.dotEnvFiles = dotEnvFiles;
function wsEnvConfig(cwd, options) {
    cwd = (0, upath2_1.resolve)(cwd !== null && cwd !== void 0 ? cwd : process.cwd());
    const files = dotEnvFiles(options).dotenvFiles;
    let ret;
    let current;
    let path;
    let fileExists;
    for (current of (0, path_parents_1.pathUpToWorkspacesGenerator)(cwd)) {
        for (let file of files) {
            path = (0, upath2_1.join)(current, file);
            fileExists = (0, fs_extra_1.pathExistsSync)(path);
            // @ts-ignore
            ret = (0, dotenv_1.config)({
                path,
            });
            if (!ret.error) {
                return {
                    ...ret,
                    path,
                    cwd,
                    current,
                    fileExists,
                };
            }
        }
    }
    fileExists = (0, fs_extra_1.pathExistsSync)(path);
    return {
        ...ret,
        path,
        cwd,
        current,
        fileExists,
    };
}
exports.wsEnvConfig = wsEnvConfig;
exports.default = wsEnvConfig;
//# sourceMappingURL=index.js.map