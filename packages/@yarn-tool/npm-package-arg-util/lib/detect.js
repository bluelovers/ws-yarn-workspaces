"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNpmPackageArgResult = exports.isURLResult = exports.isHostedGitResult = exports.isRegistryResult = exports.isFileResult = exports.isAliasResult = void 0;
function isAliasResult(npaResult) {
    return npaResult.type === 'alias';
}
exports.isAliasResult = isAliasResult;
function isFileResult(npaResult) {
    return npaResult.type === 'file' || npaResult.type === 'directory';
}
exports.isFileResult = isFileResult;
function isRegistryResult(npaResult) {
    return npaResult.type === 'version' || npaResult.type === 'range' || npaResult.type === 'tag';
}
exports.isRegistryResult = isRegistryResult;
function isHostedGitResult(npaResult) {
    var _a, _b;
    return npaResult.type === 'git' && ((_b = (_a = npaResult.hosted) === null || _a === void 0 ? void 0 : _a.domain) === null || _b === void 0 ? void 0 : _b.length) > 0;
}
exports.isHostedGitResult = isHostedGitResult;
function isURLResult(npaResult) {
    return npaResult.type === 'git' && !isHostedGitResult(npaResult) || npaResult.type === 'remote';
}
exports.isURLResult = isURLResult;
function isNpmPackageArgResult(npaResult) {
    return isAliasResult(npaResult) || isFileResult(npaResult) || isRegistryResult(npaResult) || isHostedGitResult(npaResult) || isURLResult(npaResult);
}
exports.isNpmPackageArgResult = isNpmPackageArgResult;
//# sourceMappingURL=detect.js.map