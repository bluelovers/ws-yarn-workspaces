"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResult = handleResult;
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
//# sourceMappingURL=handleResult.js.map