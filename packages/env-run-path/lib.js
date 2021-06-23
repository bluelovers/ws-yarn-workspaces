"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRunPathCore = exports.getExePath = exports.findBinPath = void 0;
const tslib_1 = require("tslib");
const path_1 = require("path");
const find_root_1 = (0, tslib_1.__importDefault)(require("@yarn-tool/find-root"));
const core_1 = (0, tslib_1.__importDefault)(require("./core"));
const path_key_1 = (0, tslib_1.__importDefault)(require("path-key"));
function findBinPath(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    if (!options.cwd || typeof stopPath === 'boolean' || !stopPath) {
        let rootData = (0, find_root_1.default)({
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
    let { history, result } = (0, core_1.default)({
        ...options,
        cwd,
        stopPath,
    });
    return {
        result,
        history,
    };
}
exports.findBinPath = findBinPath;
function getExePath(options) {
    let { cwd = process.cwd(), execPath = process.execPath, } = options;
    return (0, path_1.resolve)(cwd, execPath, '..');
}
exports.getExePath = getExePath;
function processRunPathCore(options = {}) {
    const pathKey = (0, path_key_1.default)();
    let processEnv = (options.processEnv || process.env);
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
exports.processRunPathCore = processRunPathCore;
//# sourceMappingURL=lib.js.map