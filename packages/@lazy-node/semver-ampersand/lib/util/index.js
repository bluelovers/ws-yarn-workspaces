"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAmpersandAndSpaces = hasAmpersandAndSpaces;
exports.isPlainObject = isPlainObject;
const const_1 = require("../const");
function hasAmpersandAndSpaces(input) {
    return const_1.reAmpersandAndSpaces.test(input);
}
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}
//# sourceMappingURL=index.js.map