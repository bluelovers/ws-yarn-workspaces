"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRunPathCore = exports.getExePath = exports.findBinPath = void 0;
const path_1 = require("path");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const core_1 = __importDefault(require("./core"));
const path_key_1 = __importDefault(require("path-key"));
function findBinPath(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    if (!options.cwd || typeof stopPath === 'boolean' || !stopPath) {
        let rootData = find_root_1.default({
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
    let { history, result } = core_1.default({
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
    return path_1.resolve(cwd, execPath, '..');
}
exports.getExePath = getExePath;
function processRunPathCore(options = {}) {
    const pathKey = path_key_1.default();
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