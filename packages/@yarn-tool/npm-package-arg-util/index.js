"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemverFromNpaResult = exports.npa = void 0;
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
function npa(arg, where) {
    return npm_package_arg_1.default(arg, where);
}
exports.npa = npa;
function getSemverFromNpaResult(npaResult) {
    let semver;
    switch (npaResult.type) {
        case 'alias':
            semver = npaResult.subSpec.rawSpec;
            break;
        default:
            semver = npaResult.rawSpec;
            break;
    }
    return semver;
}
exports.getSemverFromNpaResult = getSemverFromNpaResult;
exports.default = npa;
//# sourceMappingURL=index.js.map