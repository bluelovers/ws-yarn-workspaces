"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAliasResult = isAliasResult;
exports.isFileResult = isFileResult;
exports.isRegistryResult = isRegistryResult;
exports.isHostedGitResult = isHostedGitResult;
exports.isURLResult = isURLResult;
exports.isNpmPackageArgResult = isNpmPackageArgResult;
function isAliasResult(npaResult) {
    return npaResult.type === 'alias';
}
function isFileResult(npaResult) {
    return npaResult.type === 'file' || npaResult.type === 'directory';
}
function isRegistryResult(npaResult) {
    return npaResult.type === 'version' || npaResult.type === 'range' || npaResult.type === 'tag';
}
function isHostedGitResult(npaResult) {
    var _a, _b;
    return npaResult.type === 'git' && ((_b = (_a = npaResult.hosted) === null || _a === void 0 ? void 0 : _a.domain) === null || _b === void 0 ? void 0 : _b.length) > 0;
}
function isURLResult(npaResult) {
    return npaResult.type === 'git' && !isHostedGitResult(npaResult) || npaResult.type === 'remote';
}
function isNpmPackageArgResult(npaResult) {
    return isAliasResult(npaResult) || isFileResult(npaResult) || isRegistryResult(npaResult) || isHostedGitResult(npaResult) || isURLResult(npaResult);
}
//# sourceMappingURL=detect.js.map