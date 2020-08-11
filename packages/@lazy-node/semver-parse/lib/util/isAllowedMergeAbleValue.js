"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedMergeAbleValue = void 0;
function isAllowedMergeAbleValue(value) {
    return (typeof value === 'string' && value.length > 0 && value !== '*' && value !== 'x');
}
exports.isAllowedMergeAbleValue = isAllowedMergeAbleValue;
//# sourceMappingURL=isAllowedMergeAbleValue.js.map