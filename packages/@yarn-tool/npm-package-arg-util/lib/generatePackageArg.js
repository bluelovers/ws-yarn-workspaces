"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePackageArg = generatePackageArg;
exports._allowedResultType = _allowedResultType;
function generatePackageArg(input, includeVersion) {
    var _a;
    if (includeVersion && ((_a = input.semver) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        return input.name + '@' + input.semver;
    }
    return input.name;
}
function _allowedResultType(type) {
    return ["tag", "version", "range"].includes(type);
}
//# sourceMappingURL=generatePackageArg.js.map