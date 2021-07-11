"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumSemverVersion = exports.separatorDoubleVerticalBar = exports.reDoubleVerticalBar = exports.reInvalidCharacterOrAmpersand = exports.reInvalidCharacter = exports.reAmpersandAndSpaces = exports.reSpaces = void 0;
exports.reSpaces = /\s+/g;
exports.reAmpersandAndSpaces = /[&\s]+/g;
exports.reInvalidCharacter = /[^\s\w.*\-><~!^|=+]/;
exports.reInvalidCharacterOrAmpersand = /[^\s\w.*\-><~!^|=+&]/;
exports.reDoubleVerticalBar = /\s*\|\|\s*/g;
exports.separatorDoubleVerticalBar = ' || ';
var EnumSemverVersion;
(function (EnumSemverVersion) {
    /**
     * nothing is allowed
     */
    EnumSemverVersion["NULL"] = "<0.0.0-0";
    /**
     * nothing is forbidden
     */
    EnumSemverVersion["STAR"] = "*";
    EnumSemverVersion["ANY"] = "";
})(EnumSemverVersion = exports.EnumSemverVersion || (exports.EnumSemverVersion = {}));
//# sourceMappingURL=const.js.map