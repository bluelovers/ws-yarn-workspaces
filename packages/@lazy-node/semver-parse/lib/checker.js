"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSimpleSemVerObjectOrOperatorLike = exports.isSimpleSemVerObjectOrOperatorLike = exports.assertHasOperator = exports.hasOperator = exports.assertSimpleSemVerObjectWithOperatorLike = exports.isSimpleSemVerObjectWithOperatorLike = exports.assertSimpleSemVerObjectLike = exports.isSimpleSemVerObjectLike = exports.assertSimpleSemVerOperatorLike = exports.isSimpleSemVerOperatorLike = void 0;
function isSimpleSemVerOperatorLike(obj) {
    return !isSimpleSemVerObjectLike(obj) && hasOperator(obj);
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
function isSimpleSemVerObjectWithOperatorLike(obj) {
    return isSimpleSemVerObjectLike(obj) && hasOperator(obj);
}
exports.isSimpleSemVerObjectWithOperatorLike = isSimpleSemVerObjectWithOperatorLike;
function assertSimpleSemVerObjectWithOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject`);
    }
}
exports.assertSimpleSemVerObjectWithOperatorLike = assertSimpleSemVerObjectWithOperatorLike;
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
function isSimpleSemVerObjectOrOperatorLike(obj) {
    return isSimpleSemVerObjectLike(obj) || hasOperator(obj);
}
exports.isSimpleSemVerObjectOrOperatorLike = isSimpleSemVerObjectOrOperatorLike;
function assertSimpleSemVerObjectOrOperatorLike(obj, notThrow) {
    if (notThrow !== true && !isSimpleSemVerObjectOrOperatorLike(obj)) {
        throw new TypeError(`obj not a SimpleSemVerObject or SimpleSemVerOperator`);
    }
}
exports.assertSimpleSemVerObjectOrOperatorLike = assertSimpleSemVerObjectOrOperatorLike;
//# sourceMappingURL=checker.js.map