"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parseFull = void 0;
const parsers_1 = require("@yarnpkg/parsers");
function parseFull(text) {
    return (0, parsers_1.parseSyml)(text.toString());
}
exports.parseFull = parseFull;
function stringify(json) {
    return (0, parsers_1.stringifySyml)(json);
}
exports.stringify = stringify;
//# sourceMappingURL=parse.js.map