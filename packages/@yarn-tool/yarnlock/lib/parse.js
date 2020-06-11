"use strict";
/**
 * Created by user on 2020/6/11.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = exports.parseFull = void 0;
const lockfile_1 = __importDefault(require("@yarnpkg/lockfile"));
function parseFull(text) {
    return lockfile_1.default.parse(text.toString());
}
exports.parseFull = parseFull;
function parse(text) {
    return parseFull(text).object;
}
exports.parse = parse;
function stringify(json) {
    return lockfile_1.default.stringify(json);
}
exports.stringify = stringify;
//# sourceMappingURL=parse.js.map