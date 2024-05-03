"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._dummyEchoPrefix = _dummyEchoPrefix;
exports._dummyEchoTextCore = _dummyEchoTextCore;
exports._dummyEchoText = _dummyEchoText;
exports.isDummyEchoMaybe = isDummyEchoMaybe;
exports.isDummyEchoMaybeOrEmpty = isDummyEchoMaybeOrEmpty;
function _dummyEchoPrefix(prefix) {
    return `echo ${prefix !== null && prefix !== void 0 ? prefix : ''}`.trim();
}
function _dummyEchoTextCore(pre, text) {
    return `${pre} ${text}`.trim();
}
function _dummyEchoText(prefix, text) {
    return _dummyEchoTextCore(_dummyEchoPrefix(prefix), text);
}
function isDummyEchoMaybe(value) {
    return (value === null || value === void 0 ? void 0 : value.length) && value.startsWith('echo ') && !value.includes('&');
}
function isDummyEchoMaybeOrEmpty(value) {
    return !(value === null || value === void 0 ? void 0 : value.length) || (value.startsWith('echo ') && !value.includes('&'));
}
//# sourceMappingURL=dummy.js.map