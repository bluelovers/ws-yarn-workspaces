"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedMergeAbleValue = isAllowedMergeAbleValue;
function isAllowedMergeAbleValue(value) {
    return (typeof value === 'string' && value.length > 0 && value !== '*' && value !== 'x');
}
//# sourceMappingURL=isAllowedMergeAbleValue.js.map