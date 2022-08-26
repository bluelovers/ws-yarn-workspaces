"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDummyEchoMaybeOrEmpty = exports.isDummyEchoMaybe = exports._dummyEchoText = exports._dummyEchoTextCore = exports._dummyEchoPrefix = void 0;
function _dummyEchoPrefix(prefix) {
    return `echo ${prefix !== null && prefix !== void 0 ? prefix : ''}`.trim();
}
exports._dummyEchoPrefix = _dummyEchoPrefix;
function _dummyEchoTextCore(pre, text) {
    return `${pre} ${text}`.trim();
}
exports._dummyEchoTextCore = _dummyEchoTextCore;
function _dummyEchoText(prefix, text) {
    return _dummyEchoTextCore(_dummyEchoPrefix(prefix), text);
}
exports._dummyEchoText = _dummyEchoText;
function isDummyEchoMaybe(value) {
    return (value === null || value === void 0 ? void 0 : value.length) && value.startsWith('echo ') && !value.includes('&');
}
exports.isDummyEchoMaybe = isDummyEchoMaybe;
function isDummyEchoMaybeOrEmpty(value) {
    return !(value === null || value === void 0 ? void 0 : value.length) || (value.startsWith('echo ') && !value.includes('&'));
}
exports.isDummyEchoMaybeOrEmpty = isDummyEchoMaybeOrEmpty;
//# sourceMappingURL=dummy.js.map