"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSimpleSemVerOperatorLike = isSimpleSemVerOperatorLike;
exports.assertSimpleSemVerOperatorLike = assertSimpleSemVerOperatorLike;
exports.isSimpleSemVerObjectLike = isSimpleSemVerObjectLike;
exports.assertSimpleSemVerObjectLike = assertSimpleSemVerObjectLike;
exports.isSimpleSemVerObjectWithOperatorLike = isSimpleSemVerObjectWithOperatorLike;
exports.assertSimpleSemVerObjectWithOperatorLike = assertSimpleSemVerObjectWithOperatorLike;
exports.hasOperator = hasOperator;
exports.assertHasOperator = assertHasOperator;
exports.isSimpleSemVerObjectOrOperatorLike = isSimpleSemVerObjectOrOperatorLike;
exports.assertSimpleSemVerObjectOrOperatorLike = assertSimpleSemVerObjectOrOperatorLike;
function isSimpleSemVerOperatorLike(obj) {
    return !isSimpleSemVerObjectLike(obj) && hasOperator(obj);
}
function assertSimpleSemVerOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerOperatorLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerOperator`);
    }
}
function isSimpleSemVerObjectLike(obj) {
    var _a;
    return ((_a = obj.major) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
function assertSimpleSemVerObjectLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject`);
    }
}
function isSimpleSemVerObjectWithOperatorLike(obj) {
    return isSimpleSemVerObjectLike(obj) && hasOperator(obj);
}
function assertSimpleSemVerObjectWithOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject`);
    }
}
function hasOperator(obj) {
    var _a;
    return ((_a = obj.operator) === null || _a === void 0 ? void 0 : _a.length) > 0;
}
function assertHasOperator(obj, notThrow) {
    if (notThrow !== true && !hasOperator(obj)) {
        throw new TypeError(`obj not has operator`);
    }
}
function isSimpleSemVerObjectOrOperatorLike(obj) {
    return isSimpleSemVerObjectLike(obj) || hasOperator(obj);
}
function assertSimpleSemVerObjectOrOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectOrOperatorLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject or SimpleSemVerOperator`);
    }
}
//# sourceMappingURL=checker.js.map