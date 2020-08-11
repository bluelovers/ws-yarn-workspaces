"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyRange = void 0;
const simplify_1 = __importDefault(require("semver/ranges/simplify"));
const handleVersionRange_1 = require("./handleVersionRange");
function simplifyRange(ranges, range, options) {
    return simplify_1.default(ranges, handleVersionRange_1.handleVersionRange(range), options);
}
exports.simplifyRange = simplifyRange;
exports.default = simplifyRange;
//# sourceMappingURL=simplifyRange.js.map