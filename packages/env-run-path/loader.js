"use strict";
/**
 * Created by user on 2019/12/25.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEnv = void 0;
const index_1 = require("./index");
exports.processEnv = (0, index_1.processRunPathEnv)({
    overwrite: true,
    appendExecPath: true,
});
exports.default = exports.processEnv;
//# sourceMappingURL=loader.js.map