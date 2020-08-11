"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertHasOperator = exports.hasOperator = exports.assertSimpleSemVerObjectLike = exports.isSimpleSemVerObjectLike = exports.assertSimpleSemVerOperatorLike = exports.isSimpleSemVerOperatorLike = void 0;
function isSimpleSemVerOperatorLike(obj) {
    var _a, _b;
    return (!((_a = obj.major) === null || _a === void 0 ? void 0 : _a.length) && ((_b = obj.operator) === null || _b === void 0 ? void 0 : _b.length) > 0);
}
exports.isSimpleSemVerOperatorLike = isSimpleSemVerOperatorLike;
function assertSimpleSemVerOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerOperatorLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerOperator`);
    }
}
exports.assertSimpleSemVerOperatorLike = assertSimpleSemVerOperatorLike;
function isSimpleSemVerObjectLike(obj) {
    var _a;
    return ((_a = obj.major) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.isSimpleSemVerObjectLike = isSimpleSemVerObjectLike;
function assertSimpleSemVerObjectLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject`);
    }
}
exports.assertSimpleSemVerObjectLike = assertSimpleSemVerObjectLike;
function hasOperator(obj) {
    var _a;
    return ((_a = obj.operator) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
exports.hasOperator = hasOperator;
function assertHasOperator(obj, notThrow) {
    if (notThrow !== true && !hasOperator(obj)) {
        throw new TypeError(`obj not has operator`);
    }
}
exports.assertHasOperator = assertHasOperator;
//# sourceMappingURL=checker.js.map