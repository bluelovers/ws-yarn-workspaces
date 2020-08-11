"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.satisfies = void 0;
const satisfies_1 = __importDefault(require("semver/functions/satisfies"));
const handleVersionRange_1 = require("./handleVersionRange");
function satisfies(version, range, optionsOrLoose) {
    return satisfies_1.default(version, handleVersionRange_1.handleVersionRange(range), optionsOrLoose);
}
exports.satisfies = satisfies;
//# sourceMappingURL=satisfies.js.map