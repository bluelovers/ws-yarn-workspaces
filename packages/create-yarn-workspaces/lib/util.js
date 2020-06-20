"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSamePath = void 0;
const path_1 = require("path");
const path_is_same_1 = __importDefault(require("path-is-same"));
function isSamePath(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    else if (path_is_same_1.default(p1, p2)) {
        return true;
    }
    let s = path_1.relative(p1, p2);
    return (s === '.' || s === '');
}
exports.isSamePath = isSamePath;
//# sourceMappingURL=util.js.map