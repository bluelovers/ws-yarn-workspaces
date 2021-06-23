"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npaTry = exports.npa = exports.getSemverFromNpaResult = void 0;
const tslib_1 = require("tslib");
const npm_package_arg_1 = (0, tslib_1.__importDefault)(require("npm-package-arg"));
var getSemverFromNpaResult_1 = require("./lib/getSemverFromNpaResult");
Object.defineProperty(exports, "getSemverFromNpaResult", { enumerable: true, get: function () { return getSemverFromNpaResult_1.getSemverFromNpaResult; } });
function npa(arg, where) {
    return (0, npm_package_arg_1.default)(arg, where);
}
exports.npa = npa;
function npaTry(arg, where) {
    try {
        return npa(arg, where);
    }
    catch (e) {
    }
}
exports.npaTry = npaTry;
exports.default = npa;
//# sourceMappingURL=index.js.map