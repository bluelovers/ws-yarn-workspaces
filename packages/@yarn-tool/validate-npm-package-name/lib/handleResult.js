"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResult = void 0;
function handleResult(warnings, errors) {
    const result = {
        validForNewPackages: errors.length === 0 && warnings.length === 0,
        validForOldPackages: errors.length === 0,
        warnings: warnings,
        errors: errors,
    };
    if (!result.warnings.length)
        delete result.warnings;
    if (!result.errors.length)
        delete result.errors;
    return result;
}
exports.handleResult = handleResult;
//# sourceMappingURL=handleResult.js.map