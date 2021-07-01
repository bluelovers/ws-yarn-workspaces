"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.hasAmpersandAndSpaces = void 0;
const const_1 = require("../const");
function hasAmpersandAndSpaces(input) {
    return const_1.reAmpersandAndSpaces.test(input);
}
exports.hasAmpersandAndSpaces = hasAmpersandAndSpaces;
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}
exports.isPlainObject = isPlainObject;
//# sourceMappingURL=index.js.map