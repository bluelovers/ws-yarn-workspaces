"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delimiter = void 0;
exports.processEnv = processEnv;
exports.envPathKey = envPathKey;
exports.getEnvPathValue = getEnvPathValue;
exports.setEnvPathValue = setEnvPathValue;
exports.envPathObject = envPathObject;
exports.envObject = envObject;
const value_from_record_1 = require("value-from-record");
const path_env2_1 = require("path-env2");
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
function envPathKey(env) {
    return (0, value_from_record_1.keyFromRecord)('PATH', env !== null && env !== void 0 ? env : processEnv());
}
function getEnvPathValue(env, key) {
    env !== null && env !== void 0 ? env : (env = processEnv());
    key !== null && key !== void 0 ? key : (key = envPathKey(env));
    return (0, value_from_record_1.valueFromRecord)(key, env);
}
function setEnvPathValue(value, env, key, delim) {
    env !== null && env !== void 0 ? env : (env = processEnv());
    key !== null && key !== void 0 ? key : (key = envPathKey(env));
    if (typeof value !== 'string') {
        value = [...value].join(delim !== null && delim !== void 0 ? delim : delimiter);
    }
    return (0, value_from_record_1.setRecordValue)(value, key, env);
}
function envPathObject(env, key, delim) {
    return envObject(env, key, delim).path;
}
function envObject(env, key, delim) {
    env !== null && env !== void 0 ? env : (env = processEnv());
    key !== null && key !== void 0 ? key : (key = envPathKey(env));
    delim !== null && delim !== void 0 ? delim : (delim = delimiter);
    if (typeof env.entries === 'function') {
        env = Object.fromEntries((0, value_from_record_1.entriesOfRecord)(env));
    }
    return (0, path_env2_1.pathEnv)(env, key, delim);
}
exports.default = envPathObject;
//# sourceMappingURL=index.js.map