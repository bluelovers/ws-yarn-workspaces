"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npa = exports.getSemverFromNpaResult = void 0;
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
var getSemverFromNpaResult_1 = require("./lib/getSemverFromNpaResult");
Object.defineProperty(exports, "getSemverFromNpaResult", { enumerable: true, get: function () { return getSemverFromNpaResult_1.getSemverFromNpaResult; } });
function npa(arg, where) {
    return npm_package_arg_1.default(arg, where);
}
exports.npa = npa;
exports.default = npa;
//# sourceMappingURL=index.js.map