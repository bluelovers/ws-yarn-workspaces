"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRunPathEnv = exports.processRunPath = void 0;
const lib_1 = require("./lib");
function processRunPath(options = {}) {
    let { binPaths, execPath, envPath, pathKey, delimiter, processEnv } = lib_1.processRunPathCore(options);
    let result = [];
    if (options.includeEnvPath) {
        result.push(envPath);
    }
    let binPathString = binPaths.join(delimiter);
    if (options.prepend) {
        result.unshift(binPathString);
    }
    else {
        result.push(binPathString);
    }
    if (options.appendExecPath) {
        result.push(execPath);
    }
    return {
        result: result.join(delimiter),
        processEnv,
        pathKey,
        delimiter,
    };
}
exports.processRunPath = processRunPath;
function processRunPathEnv(options = {}) {
    let { processEnv, pathKey, result } = processRunPath({
        ...options,
        includeEnvPath: true,
    });
    if (!options.overwrite) {
        processEnv = {
            ...processEnv,
        };
    }
    processEnv[pathKey] = result;
    return processEnv;
}
exports.processRunPathEnv = processRunPathEnv;
exports.default = processRunPathEnv;
//# sourceMappingURL=index.js.map