"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemverFromNpaResult = void 0;
exports.npa = npa;
exports.npaTry = npaTry;
const tslib_1 = require("tslib");
const npm_package_arg_1 = tslib_1.__importDefault(require("npm-package-arg"));
const assert_1 = require("./lib/assert");
var getSemverFromNpaResult_1 = require("./lib/getSemverFromNpaResult");
Object.defineProperty(exports, "getSemverFromNpaResult", { enumerable: true, get: function () { return getSemverFromNpaResult_1.getSemverFromNpaResult; } });
function npa(arg, where) {
    const result = (0, npm_package_arg_1.default)(arg, where);
    (0, assert_1.assertNpaResultHasName)(result);
    return result;
}
function npaTry(arg, where) {
    try {
        return npa(arg, where);
    }
    catch (e) {
    }
}
exports.default = npa;
//# sourceMappingURL=index.js.map