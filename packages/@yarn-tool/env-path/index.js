"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envPathObject = exports.envPathKey = exports.processEnv = exports.delimiter = void 0;
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
function envPathKey(env = processEnv()) {
    return (0, value_from_record_1.keyFromRecord)('PATH', env);
}
exports.envPathKey = envPathKey;
function envPathObject(env = processEnv(), key, delim = delimiter) {
    key !== null && key !== void 0 ? key : (key = envPathKey(env));
    return (0, path_env_1.pathString)((0, value_from_record_1.valueFromRecord)(key, env), delim);
}
exports.envPathObject = envPathObject;
exports.default = envPathObject;
//# sourceMappingURL=index.js.map