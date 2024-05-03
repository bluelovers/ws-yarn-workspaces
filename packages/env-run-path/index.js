"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRunPath = processRunPath;
exports.processRunPathEnv = processRunPathEnv;
const lib_1 = require("./lib");
function processRunPath(options = {}) {
    let { binPaths, execPath, envPath, pathKey, delimiter, processEnv } = (0, lib_1.processRunPathCore)(options);
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
exports.default = processRunPathEnv;
//# sourceMappingURL=index.js.map