"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envObject = exports.envPathObject = exports.envPathKey = exports.processEnv = exports.delimiter = void 0;
const value_from_record_1 = require("value-from-record");
const path_env_1 = require("path-env");
const path_1 = require("path");
const delimiter = path_1.delimiter;
exports.delimiter = delimiter;
function processEnv(ignoreErrors) {
    try {
        return process.env;
    }
    catch (e) {
        if (!ignoreErrors) {
            throw e;
        }
    }
}
exports.processEnv = processEnv;
function envPathKey(env) {
    return (0, value_from_record_1.keyFromRecord)('PATH', env !== null && env !== void 0 ? env : processEnv());
}
exports.envPathKey = envPathKey;
function envPathObject(env, key, delim) {
    return envObject(env, key, delim).path;
}
exports.envPathObject = envPathObject;
function envObject(env, key, delim) {
    env !== null && env !== void 0 ? env : (env = processEnv());
    key !== null && key !== void 0 ? key : (key = envPathKey(env));
    delim !== null && delim !== void 0 ? delim : (delim = delimiter);
    if (typeof env.entries === 'function') {
        env = env.entries();
    }
    return (0, path_env_1.pathEnv)(env, key, delim);
}
exports.envObject = envObject;
exports.default = envPathObject;
//# sourceMappingURL=index.js.map