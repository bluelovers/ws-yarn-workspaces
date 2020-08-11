"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxSatisfying = void 0;
const max_satisfying_1 = __importDefault(require("semver/ranges/max-satisfying"));
const handleVersionRange_1 = require("./handleVersionRange");
function maxSatisfying(versions, range, optionsOrLoose) {
    return max_satisfying_1.default(versions, handleVersionRange_1.handleVersionRange(range), optionsOrLoose);
}
exports.maxSatisfying = maxSatisfying;
exports.default = maxSatisfying;
//# sourceMappingURL=maxSatisfying.js.map