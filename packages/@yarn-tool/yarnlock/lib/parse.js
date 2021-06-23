"use strict";
/**
 * Created by user on 2020/6/11.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = exports.parseFull = void 0;
const lockfile_1 = require("@yarnpkg/lockfile");
function parseFull(text) {
    return (0, lockfile_1.parse)(text.toString());
}
exports.parseFull = parseFull;
function parse(text) {
    return parseFull(text).object;
}
exports.parse = parse;
function stringify(json) {
    return (0, lockfile_1.stringify)(json);
}
exports.stringify = stringify;
//# sourceMappingURL=parse.js.map