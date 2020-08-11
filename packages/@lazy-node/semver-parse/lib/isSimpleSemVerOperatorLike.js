"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOperator = exports.isSimpleSemVerObjectLike = exports.isSimpleSemVerOperatorLike = void 0;
function isSimpleSemVerOperatorLike(obj) {
    var _a, _b;
    return (!((_a = obj.major) === null || _a === void 0 ? void 0 : _a.length) && ((_b = obj.operator) === null || _b === void 0 ? void 0 : _b.length) > 0);
}
exports.isSimpleSemVerOperatorLike = isSimpleSemVerOperatorLike;
function isSimpleSemVerObjectLike(obj) {
    var _a;
    return ((_a = obj.major) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.isSimpleSemVerObjectLike = isSimpleSemVerObjectLike;
function hasOperator(obj) {
    var _a;
    return ((_a = obj.operator) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.hasOperator = hasOperator;
//# sourceMappingURL=isSimpleSemVerOperatorLike.js.map