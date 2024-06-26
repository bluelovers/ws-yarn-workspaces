"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBinPath = findBinPath;
exports.getExePath = getExePath;
exports.processRunPathCore = processRunPathCore;
const path_1 = require("path");
const find_root_1 = require("@yarn-tool/find-root");
const core_1 = require("./core");
const env_path_1 = require("@yarn-tool/env-path");
function findBinPath(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    if (!options.cwd || typeof stopPath === 'boolean' || !stopPath) {
        let rootData = (0, find_root_1.findRoot)({
            cwd,
        });
        if (stopPath === true || stopPath == null) {
            stopPath = [rootData.root];
        }
        else if (!stopPath) {
            stopPath = [];
        }
        if (!options.cwd) {
            cwd = rootData.pkg;
        }
    }
    let { history, result } = (0, core_1.findBinPathCore)({
        ...options,
        cwd,
        stopPath,
    });
    return {
        result,
        history,
    };
}
function getExePath(options) {
    let { cwd = process.cwd(), execPath = process.execPath, } = options;
    return (0, path_1.resolve)(cwd, execPath, '..');
}
function processRunPathCore(options = {}) {
    let processEnv = (options.processEnv || (0, env_path_1.processEnv)());
    const pathKey = (0, env_path_1.envPathKey)(processEnv);
    let { cwd = process.cwd(), execPath = process.execPath, envPath = processEnv[pathKey], } = options;
    let { result } = findBinPath(options);
    const execPathDir = getExePath({
        cwd,
        execPath,
    });
    return {
        pathKey,
        envPath,
        binPaths: result,
        execPath: execPathDir,
        delimiter: path_1.delimiter,
        processEnv,
    };
}
//# sourceMappingURL=lib.js.map