"use strict";
/**
 * Created by user on 2020/6/14.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpDepsAllDeep = exports.findDepsAllDeep = void 0;
const find_1 = require("./lib/find");
Object.defineProperty(exports, "findDepsAllDeep", { enumerable: true, get: function () { return find_1.findDepsAllDeep; } });
const find_up_1 = require("./lib/find-up");
Object.defineProperty(exports, "findUpDepsAllDeep", { enumerable: true, get: function () { return find_up_1.findUpDepsAllDeep; } });
exports.default = find_up_1.findUpDepsAllDeep;
//# sourceMappingURL=index.js.map