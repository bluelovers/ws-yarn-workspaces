"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minSatisfying = void 0;
const min_satisfying_1 = __importDefault(require("semver/ranges/min-satisfying"));
const handleVersionRange_1 = require("./handleVersionRange");
function minSatisfying(versions, range, optionsOrLoose) {
    return min_satisfying_1.default(versions, handleVersionRange_1.handleVersionRange(range), optionsOrLoose);
}
exports.minSatisfying = minSatisfying;
//# sourceMappingURL=minSatisfying.js.map