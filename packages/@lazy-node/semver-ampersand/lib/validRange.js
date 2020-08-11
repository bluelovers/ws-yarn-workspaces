"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validRange = void 0;
const valid_1 = __importDefault(require("semver/ranges/valid"));
const handleVersionRange_1 = require("./handleVersionRange");
function validRange(range, optionsOrLoose) {
    return valid_1.default(handleVersionRange_1.handleVersionRange(range), optionsOrLoose);
}
exports.validRange = validRange;
exports.default = validRange;
//# sourceMappingURL=validRange.js.map