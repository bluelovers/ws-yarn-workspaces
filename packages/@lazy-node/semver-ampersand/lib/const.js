"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separatorDoubleVerticalBar = exports.reDoubleVerticalBar = exports.reInvalidCharacterOrAmpersand = exports.reInvalidCharacter = exports.reAmpersandAndSpaces = exports.reSpaces = void 0;
exports.reSpaces = /\s+/g;
exports.reAmpersandAndSpaces = /[&\s]+/g;
exports.reInvalidCharacter = /[^\s\w.*\-><~!^|=+]/;
exports.reInvalidCharacterOrAmpersand = /[^\s\w.*\-><~!^|=+&]/;
exports.reDoubleVerticalBar = /\s*\|\|\s*/g;
exports.separatorDoubleVerticalBar = ' || ';
//# sourceMappingURL=const.js.map